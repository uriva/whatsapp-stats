import JSZip from 'jszip';
import { ChatMessage, MessageType, ParseOptions } from './types';

// Regex for extracting emojis safely
const EMOJI_REGEX = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF]|\uD83D[\uDE80-\uDEFF])/gu;

// Regex for URLs
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

// Clean invisible unicode formatting characters
export function cleanWhatsAppText(text: string): string {
  return text
    .replace(/[\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u200B\uFEFF]/g, '')
    .replace(/\u202F/g, ' ') // Narrow no-break space (used in iOS time formats)
    .replace(/\u00A0/g, ' '); // Non-breaking space
}

/**
 * Detect date format by scanning date tokens across lines
 */
function detectDateFormat(dates: { part1: number; part2: number; part3: number }[]): 'dmy' | 'mdy' | 'ymd' {
  let hasDayInPart1 = false;
  let hasDayInPart2 = false;
  let hasYearInPart1 = false;

  for (const d of dates) {
    if (d.part1 > 1000) {
      hasYearInPart1 = true;
      break;
    }
    if (d.part1 > 12) {
      hasDayInPart1 = true;
    }
    if (d.part2 > 12) {
      hasDayInPart2 = true;
    }
  }

  if (hasYearInPart1) return 'ymd';
  if (hasDayInPart1) return 'dmy';
  if (hasDayInPart2) return 'mdy';
  
  // Default to day/month/year as it is most common internationally
  return 'dmy';
}

/**
 * Parse date and time strings into a valid Date object
 */
function parseDateTime(
  datePart: string, 
  timePart: string, 
  format: 'dmy' | 'mdy' | 'ymd'
): Date | null {
  try {
    const cleanDate = datePart.trim().replace(/[./]/g, '-');
    const dateNums = cleanDate.split('-').map(n => parseInt(n, 10));
    if (dateNums.length < 3 || dateNums.some(isNaN)) return null;

    let year = 0;
    let month = 0;
    let day = 0;

    if (format === 'ymd') {
      year = dateNums[0];
      month = dateNums[1] - 1;
      day = dateNums[2];
    } else if (format === 'mdy') {
      month = dateNums[0] - 1;
      day = dateNums[1];
      year = dateNums[2];
    } else {
      // dmy
      day = dateNums[0];
      month = dateNums[1] - 1;
      year = dateNums[2];
    }

    // Handle 2-digit years
    if (year < 100) {
      year = year < 70 ? 2000 + year : 1900 + year;
    }

    // Parse time
    const cleanTime = timePart.trim();
    const isPM = /pm$/i.test(cleanTime);
    const isAM = /am$/i.test(cleanTime);
    const timeWithoutAmPm = cleanTime.replace(/\s*(?:am|pm)/i, '').trim();
    const timeParts = timeWithoutAmPm.split(':').map(n => parseInt(n, 10));

    if (timeParts.length < 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) return null;

    let hours = timeParts[0];
    const minutes = timeParts[1];
    const seconds = timeParts[2] && !isNaN(timeParts[2]) ? timeParts[2] : 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const date = new Date(year, month, day, hours, minutes, seconds);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * Classifies the type of message based on content
 */
function classifyMessageType(content: string, isSystem: boolean): MessageType {
  if (isSystem) return 'system';
  
  const lower = content.toLowerCase().trim();
  
  if (
    lower.includes('this message was deleted') || 
    lower.includes('you deleted this message') || 
    lower === 'null'
  ) {
    return 'deleted';
  }

  if (
    lower.includes('missed voice call') || 
    lower.includes('missed video call') || 
    lower.includes('missed group call')
  ) {
    return 'call';
  }

  if (
    lower.includes('‎<attached:') || 
    lower.includes('<media omitted>') || 
    lower.includes('image omitted') || 
    lower.includes('photo omitted') ||
    lower.includes('‎photo') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.heic')
  ) {
    return 'image';
  }

  if (
    lower.includes('video omitted') || 
    lower.endsWith('.mp4') || 
    lower.endsWith('.mov')
  ) {
    return 'video';
  }

  if (
    lower.includes('audio omitted') || 
    lower.includes('voice message') || 
    lower.includes('ptt-') ||
    lower.endsWith('.opus') || 
    lower.endsWith('.m4a') || 
    lower.endsWith('.mp3')
  ) {
    return 'voice_note';
  }

  if (lower.includes('sticker omitted') || lower.endsWith('.webp')) {
    return 'sticker';
  }

  if (lower.includes('gif omitted')) {
    return 'gif';
  }

  if (
    lower.includes('document omitted') || 
    lower.endsWith('.pdf') || 
    lower.endsWith('.docx') || 
    lower.endsWith('.zip')
  ) {
    return 'document';
  }

  if (lower.includes('contact card omitted') || lower.includes('vcard')) {
    return 'contact';
  }

  if (lower.includes('location: https://maps.google.com') || lower.includes('live location shared')) {
    return 'location';
  }

  return 'text';
}

/**
 * Main parser function to convert raw chat string to structured messages
 */
export function parseWhatsAppChat(rawText: string, options?: ParseOptions): ChatMessage[] {
  const cleaned = cleanWhatsAppText(rawText);
  const lines = cleaned.split(/\r?\n/);
  
  // Patterns for iOS and Android formats
  const lineRegex = /^(?:\[(\d{1,4}[./\-]\d{1,2}[./\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]|(\d{1,4}[./\-]\d{1,2}[./\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*-)\s*(.*)$/;

  // First pass: detect date format
  const sampleDateTokens: { part1: number; part2: number; part3: number }[] = [];
  
  for (let i = 0; i < Math.min(lines.length, 500); i++) {
    const match = lines[i].match(lineRegex);
    if (match) {
      const dateStr = match[1] || match[3];
      const parts = dateStr.replace(/[./]/g, '-').split('-').map(n => parseInt(n, 10));
      if (parts.length >= 3 && !parts.some(isNaN)) {
        sampleDateTokens.push({ part1: parts[0], part2: parts[1], part3: parts[2] });
      }
    }
  }

  const detectedFormat = options?.dateFormat && options.dateFormat !== 'auto' 
    ? options.dateFormat 
    : detectDateFormat(sampleDateTokens);

  const rawMessages: {
    timestamp: Date;
    author: string;
    content: string;
    isSystem: boolean;
  }[] = [];

  let currentMsg: {
    timestamp: Date;
    author: string;
    content: string;
    isSystem: boolean;
  } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(lineRegex);

    if (match) {
      if (currentMsg) {
        rawMessages.push(currentMsg);
        currentMsg = null;
      }

      const datePart = match[1] || match[3];
      const timePart = match[2] || match[4];
      const rest = match[5] || '';

      const timestamp = parseDateTime(datePart, timePart, detectedFormat);
      if (!timestamp) {
        // If date parsing failed, append to previous message if possible
        if (rawMessages.length > 0) {
          rawMessages[rawMessages.length - 1].content += '\n' + line;
        }
        continue;
      }

      // Check if it's a user message or system message
      const authorSeparatorIndex = rest.indexOf(': ');

      if (authorSeparatorIndex > -1) {
        const author = rest.slice(0, authorSeparatorIndex).trim();
        const content = rest.slice(authorSeparatorIndex + 2);
        
        currentMsg = {
          timestamp,
          author,
          content,
          isSystem: false,
        };
      } else {
        // System message
        currentMsg = {
          timestamp,
          author: 'System',
          content: rest.trim(),
          isSystem: true,
        };
      }
    } else {
      // Continuation line of multi-line message
      if (currentMsg) {
        currentMsg.content += '\n' + line;
      } else if (rawMessages.length > 0) {
        rawMessages[rawMessages.length - 1].content += '\n' + line;
      }
    }
  }

  if (currentMsg) {
    rawMessages.push(currentMsg);
  }

  // Convert to full ChatMessage with metadata
  let msgIdCounter = 0;
  const messages: ChatMessage[] = [];

  for (let i = 0; i < rawMessages.length; i++) {
    const raw = rawMessages[i];
    const emojis = raw.content.match(EMOJI_REGEX) || [];
    const links = raw.content.match(URL_REGEX) || [];
    const cleanContent = raw.content.trim();
    const type = classifyMessageType(cleanContent, raw.isSystem);
    
    // Word count calculation
    const words = cleanContent
      .replace(URL_REGEX, '')
      .replace(EMOJI_REGEX, '')
      .split(/\s+/)
      .filter(w => w.trim().length > 0);

    const year = raw.timestamp.getFullYear();
    const month = String(raw.timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(raw.timestamp.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const hours = String(raw.timestamp.getHours()).padStart(2, '0');
    const minutes = String(raw.timestamp.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const isQuestion = cleanContent.includes('?') || cleanContent.includes('¿');

    messages.push({
      id: `msg-${++msgIdCounter}`,
      timestamp: raw.timestamp,
      dateStr,
      timeStr,
      author: raw.author,
      content: cleanContent,
      type,
      isSystem: raw.isSystem,
      wordCount: words.length,
      charCount: cleanContent.length,
      emojis,
      links,
      isQuestion,
    });
  }

  return messages;
}

/**
 * Handle extracting chat text from an uploaded File (supports .txt and .zip)
 */
export async function extractChatFromFile(file: File): Promise<{ text: string; filename: string }> {
  if (file.name.endsWith('.zip')) {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    // Look for _chat.txt or any .txt file in root/subfolders
    let targetFile: JSZip.JSZipObject | null = null;
    
    for (const relativePath in zipContent.files) {
      if (relativePath.toLowerCase().endsWith('_chat.txt')) {
        targetFile = zipContent.files[relativePath];
        break;
      }
    }

    if (!targetFile) {
      for (const relativePath in zipContent.files) {
        if (relativePath.toLowerCase().endsWith('.txt') && !relativePath.startsWith('__MACOSX/')) {
          targetFile = zipContent.files[relativePath];
          break;
        }
      }
    }

    if (!targetFile) {
      throw new Error('No .txt chat export file found inside the ZIP archive.');
    }

    const text = await targetFile.async('text');
    return { text, filename: file.name };
  } else {
    const text = await file.text();
    return { text, filename: file.name };
  }
}
