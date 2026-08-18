import { ChatMessage, ChatAnalysis, ParticipantStats, ConversationThread, ChatAward } from './types';

// Palette of distinctive vibrant colors for participants
const PARTICIPANT_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#84CC16', // Lime
  '#14B8A6', // Teal
  '#F97316', // Orange
];

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
  'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'are', 'was', 'were', 'been', 'is', 'am', 'has', 'had', 'did', 'does', 'doing', 'ok',
  'okay', 'yeah', 'yes', 'yep', 'nope', 'dont', "don't", 'im', "i'm", 'ill', "i'll", 'ive', "i've", 'cant', "can't",
  'omitted', 'media', 'attached', 'image', 'video', 'audio', 'sticker', 'null', 'message', 'deleted', 'call'
]);

const LAUGH_REGEX = /\b(ha(ha)+|he(he)+|lol|lmao|rofl|k(k)+|j(aj)+)\b|😂|🤣|😹/i;

function getMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function analyzeChat(
  messages: ChatMessage[],
  title: string = 'WhatsApp Chat',
  options: { conversationGapHours?: number } = {}
): ChatAnalysis {
  const gapHours = options.conversationGapHours || 6;
  const gapMs = gapHours * 60 * 60 * 1000;

  // Filter out system messages for participant stats
  const userMessages = messages.filter(m => !m.isSystem && m.author && m.author !== 'System');
  
  // Collect unique authors
  const authorMap = new Map<string, ChatMessage[]>();
  userMessages.forEach(m => {
    if (!authorMap.has(m.author)) {
      authorMap.set(m.author, []);
    }
    authorMap.get(m.author)!.push(m);
  });

  const authors = Array.from(authorMap.keys());
  const isGroup = authors.length > 2;

  // 1. Split into Conversation Threads & compute Initiations
  const threads: ConversationThread[] = [];
  let currentThreadMsgs: ChatMessage[] = [];
  let lastMsgTime: Date | null = null;
  let longestSilenceMs = 0;

  for (let i = 0; i < userMessages.length; i++) {
    const msg = userMessages[i];
    
    if (lastMsgTime) {
      const diffMs = msg.timestamp.getTime() - lastMsgTime.getTime();
      if (diffMs > longestSilenceMs) {
        longestSilenceMs = diffMs;
      }

      if (diffMs >= gapMs) {
        // Close previous thread
        if (currentThreadMsgs.length > 0) {
          const first = currentThreadMsgs[0];
          const last = currentThreadMsgs[currentThreadMsgs.length - 1];
          const duration = Math.round((last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60));
          const threadParticipants = Array.from(new Set(currentThreadMsgs.map(m => m.author)));

          threads.push({
            id: `thread-${threads.length + 1}`,
            startTime: first.timestamp,
            endTime: last.timestamp,
            initiator: first.author,
            messageCount: currentThreadMsgs.length,
            durationMinutes: duration,
            participants: threadParticipants,
            messages: currentThreadMsgs,
            gapBeforeHours: Math.round(diffMs / (1000 * 60 * 60) * 10) / 10,
          });
        }
        currentThreadMsgs = [msg];
      } else {
        currentThreadMsgs.push(msg);
      }
    } else {
      currentThreadMsgs.push(msg);
    }
    lastMsgTime = msg.timestamp;
  }

  if (currentThreadMsgs.length > 0) {
    const first = currentThreadMsgs[0];
    const last = currentThreadMsgs[currentThreadMsgs.length - 1];
    const duration = Math.round((last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60));
    const threadParticipants = Array.from(new Set(currentThreadMsgs.map(m => m.author)));

    threads.push({
      id: `thread-${threads.length + 1}`,
      startTime: first.timestamp,
      endTime: last.timestamp,
      initiator: first.author,
      messageCount: currentThreadMsgs.length,
      durationMinutes: duration,
      participants: threadParticipants,
      messages: currentThreadMsgs,
      gapBeforeHours: 0,
    });
  }

  // 2. Compute Response Times & Double Texts
  // Track response times per author
  const authorResponseTimes = new Map<string, number[]>();
  const authorDoubleTexts = new Map<string, number>();
  const authorLeftOnRead = new Map<string, number>();
  authors.forEach(a => {
    authorResponseTimes.set(a, []);
    authorDoubleTexts.set(a, 0);
    authorLeftOnRead.set(a, 0);
  });

  // Calculate response times within threads
  for (const thread of threads) {
    let lastAuthor: string | null = null;
    let lastAuthorTime: Date | null = null;

    for (let i = 0; i < thread.messages.length; i++) {
      const msg = thread.messages[i];
      
      if (lastAuthor && lastAuthor !== msg.author && lastAuthorTime) {
        const responseSeconds = (msg.timestamp.getTime() - lastAuthorTime.getTime()) / 1000;
        // Only count valid positive responses within 12 hours
        if (responseSeconds >= 0 && responseSeconds <= 12 * 3600) {
          msg.responseTimeSeconds = responseSeconds;
          msg.isReplyToPrevious = true;
          authorResponseTimes.get(msg.author)?.push(responseSeconds);
        }
      } else if (lastAuthor === msg.author && lastAuthorTime) {
        // Consecutive message by same author
        const pauseSeconds = (msg.timestamp.getTime() - lastAuthorTime.getTime()) / 1000;
        if (pauseSeconds > 180) { // Sent after 3+ minutes pause without other's reply
          const current = authorDoubleTexts.get(msg.author) || 0;
          authorDoubleTexts.set(msg.author, current + 1);
        }
      }

      lastAuthor = msg.author;
      lastAuthorTime = msg.timestamp;
    }

    // Thread ender (left on read / conversation closer)
    if (thread.messages.length > 0) {
      const lastMsg = thread.messages[thread.messages.length - 1];
      const count = authorLeftOnRead.get(lastMsg.author) || 0;
      authorLeftOnRead.set(lastMsg.author, count + 1);
    }
  }

  // 3. Compute Initiations per participant
  const authorInitiations = new Map<string, { total: number; morning: number; afternoon: number; evening: number; night: number }>();
  authors.forEach(a => {
    authorInitiations.set(a, { total: 0, morning: 0, afternoon: 0, evening: 0, night: 0 });
  });

  for (const thread of threads) {
    const init = authorInitiations.get(thread.initiator);
    if (init) {
      init.total += 1;
      const hour = thread.startTime.getHours();
      if (hour >= 5 && hour < 12) init.morning += 1;
      else if (hour >= 12 && hour < 17) init.afternoon += 1;
      else if (hour >= 17 && hour < 22) init.evening += 1;
      else init.night += 1;
    }
  }

  // 4. Compute Participant Detailed Stats
  const totalUserMessages = userMessages.length;
  const participantStats: ParticipantStats[] = [];

  const globalEmojiMap = new Map<string, number>();
  const globalWordMap = new Map<string, number>();

  authors.forEach((authorName, index) => {
    const msgs = authorMap.get(authorName) || [];
    const color = PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
    
    let totalWords = 0;
    let totalChars = 0;
    let imagesCount = 0;
    let videosCount = 0;
    let voiceNotesCount = 0;
    let stickersCount = 0;
    let documentsCount = 0;
    let linksCount = 0;
    let deletedCount = 0;
    let questionsCount = 0;
    let laughCount = 0;

    const emojiMap = new Map<string, number>();
    const wordMap = new Map<string, number>();
    const hourly = new Array(24).fill(0);
    const dayOfWeek = new Array(7).fill(0);

    msgs.forEach(m => {
      totalWords += m.wordCount;
      totalChars += m.charCount;
      if (m.type === 'image') imagesCount++;
      if (m.type === 'video') videosCount++;
      if (m.type === 'voice_note' || m.type === 'audio') voiceNotesCount++;
      if (m.type === 'sticker') stickersCount++;
      if (m.type === 'document') documentsCount++;
      if (m.type === 'deleted') deletedCount++;
      linksCount += m.links.length;
      if (m.isQuestion) questionsCount++;

      // Laugh check
      if (LAUGH_REGEX.test(m.content)) laughCount++;

      // Emojis
      m.emojis.forEach(e => {
        emojiMap.set(e, (emojiMap.get(e) || 0) + 1);
        globalEmojiMap.set(e, (globalEmojiMap.get(e) || 0) + 1);
      });

      // Words
      const cleanWords = m.content
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
      
      cleanWords.forEach(w => {
        wordMap.set(w, (wordMap.get(w) || 0) + 1);
        globalWordMap.set(w, (globalWordMap.get(w) || 0) + 1);
      });

      // Hourly & Day
      const hour = m.timestamp.getHours();
      const day = m.timestamp.getDay();
      hourly[hour] += 1;
      dayOfWeek[day] += 1;
    });

    const mediaCount = imagesCount + videosCount + voiceNotesCount + stickersCount + documentsCount;
    const responseTimes = authorResponseTimes.get(authorName) || [];
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;
    const medianResponseTime = getMedian(responseTimes);
    const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    const responseBuckets = {
      under1Min: responseTimes.filter(t => t < 60).length,
      oneToFiveMin: responseTimes.filter(t => t >= 60 && t < 300).length,
      fiveToFifteenMin: responseTimes.filter(t => t >= 300 && t < 900).length,
      fifteenToSixtyMin: responseTimes.filter(t => t >= 900 && t < 3600).length,
      oneToSixHours: responseTimes.filter(t => t >= 3600 && t < 21600).length,
      overSixHours: responseTimes.filter(t => t >= 21600).length,
    };

    const topEmojis = Array.from(emojiMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([emoji, count]) => ({ emoji, count }));

    const topWords = Array.from(wordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));

    const inits = authorInitiations.get(authorName) || { total: 0, morning: 0, afternoon: 0, evening: 0, night: 0 };
    const mostActiveHour = hourly.indexOf(Math.max(...hourly));
    const mostActiveDay = dayOfWeek.indexOf(Math.max(...dayOfWeek));

    participantStats.push({
      name: authorName,
      color,
      totalMessages: msgs.length,
      messagePercentage: totalUserMessages > 0 ? Math.round((msgs.length / totalUserMessages) * 1000) / 10 : 0,
      totalWords,
      totalChars,
      avgWordsPerMessage: msgs.length > 0 ? Math.round((totalWords / msgs.length) * 10) / 10 : 0,
      avgCharsPerMessage: msgs.length > 0 ? Math.round((totalChars / msgs.length) * 10) / 10 : 0,
      mediaCount,
      imagesCount,
      videosCount,
      voiceNotesCount,
      stickersCount,
      documentsCount,
      linksCount,
      deletedCount,
      questionsCount,
      conversationsInitiated: inits.total,
      initiationPercentage: threads.length > 0 ? Math.round((inits.total / threads.length) * 1000) / 10 : 0,
      morningInitiations: inits.morning,
      afternoonInitiations: inits.afternoon,
      eveningInitiations: inits.evening,
      nightInitiations: inits.night,
      responseCount: responseTimes.length,
      avgResponseTimeSeconds: Math.round(avgResponseTime),
      medianResponseTimeSeconds: Math.round(medianResponseTime),
      fastestResponseTimeSeconds: Math.round(fastestResponse),
      slowestResponseTimeSeconds: Math.round(slowestResponse),
      responseTimeBuckets: responseBuckets,
      doubleTextCount: authorDoubleTexts.get(authorName) || 0,
      leftOnReadCandidateCount: authorLeftOnRead.get(authorName) || 0,
      topEmojis,
      totalEmojis: Array.from(emojiMap.values()).reduce((a, b) => a + b, 0),
      topWords,
      laughCount,
      hourlyDistribution: hourly,
      dayOfWeekDistribution: dayOfWeek,
      mostActiveHour,
      mostActiveDay,
    });
  });

  // Sort participants by total messages descending
  participantStats.sort((a, b) => b.totalMessages - a.totalMessages);

  // 5. Global Timeline Aggregations
  const dailyMap = new Map<string, { count: number; [author: string]: number }>();
  const monthlyMap = new Map<string, { count: number; [author: string]: number }>();
  const punchcardMap = new Map<string, number>();

  userMessages.forEach(m => {
    // Daily
    const dStr = m.dateStr;
    if (!dailyMap.has(dStr)) {
      dailyMap.set(dStr, { count: 0 });
    }
    const dayEntry = dailyMap.get(dStr)!;
    dayEntry.count += 1;
    dayEntry[m.author] = (dayEntry[m.author] || 0) + 1;

    // Monthly
    const mStr = dStr.slice(0, 7); // YYYY-MM
    if (!monthlyMap.has(mStr)) {
      monthlyMap.set(mStr, { count: 0 });
    }
    const monthEntry = monthlyMap.get(mStr)!;
    monthEntry.count += 1;
    monthEntry[m.author] = (monthEntry[m.author] || 0) + 1;

    // Punchcard (Day of week 0-6 x Hour 0-23)
    const pKey = `${m.timestamp.getDay()}-${m.timestamp.getHours()}`;
    punchcardMap.set(pKey, (punchcardMap.get(pKey) || 0) + 1);
  });

  const dailyTimeline: { date: string; count: number; [key: string]: any }[] = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({ date, ...data }));

  const monthlyTimeline: { month: string; count: number; [key: string]: any }[] = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, data]) => ({ month, ...data }));

  const punchcard: { day: number; hour: number; count: number }[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      punchcard.push({
        day: d,
        hour: h,
        count: punchcardMap.get(`${d}-${h}`) || 0,
      });
    }
  }

  // Hourly Activity Global & Per Author
  const hourlyActivity: { hour: number; count: number; [key: string]: any }[] = Array.from({ length: 24 }, (_, hour) => {
    const entry: { hour: number; count: number; [key: string]: any } = {
      hour,
      count: 0,
    };
    participantStats.forEach(p => {
      entry[p.name] = p.hourlyDistribution[hour];
      entry.count += p.hourlyDistribution[hour];
    });
    return entry;
  });

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeekActivity: { day: string; dayIndex: number; count: number; [key: string]: any }[] = Array.from({ length: 7 }, (_, dayIndex) => {
    const entry: { day: string; dayIndex: number; count: number; [key: string]: any } = {
      day: DAY_NAMES[dayIndex],
      dayIndex,
      count: 0,
    };
    participantStats.forEach(p => {
      entry[p.name] = p.dayOfWeekDistribution[dayIndex];
      entry.count += p.dayOfWeekDistribution[dayIndex];
    });
    return entry;
  });

  // Global top emojis and words
  const topGlobalEmojis = Array.from(globalEmojiMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([emoji, count]) => ({ emoji, count }));

  const topGlobalWords = Array.from(globalWordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  // Date range and durations
  const startDate = userMessages.length > 0 ? userMessages[0].timestamp : new Date();
  const endDate = userMessages.length > 0 ? userMessages[userMessages.length - 1].timestamp : new Date();
  const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const activeDaysCount = dailyMap.size;
  const avgMessagesPerDay = Math.round((totalUserMessages / totalDays) * 10) / 10;

  // Longest thread
  let longestThread: ConversationThread | null = null;
  if (threads.length > 0) {
    longestThread = [...threads].sort((a, b) => b.messageCount - a.messageCount)[0];
  }

  // 6. Generate Awards / Superlatives
  const awards: ChatAward[] = [];

  if (participantStats.length > 0) {
    // 1. Most Talkative
    const mostTalkative = [...participantStats].sort((a, b) => b.totalMessages - a.totalMessages)[0];
    awards.push({
      id: 'most-talkative',
      title: 'The Chatterbox',
      recipient: mostTalkative.name,
      description: `Sent ${mostTalkative.totalMessages.toLocaleString()} messages (${mostTalkative.messagePercentage}% of all messages)`,
      icon: 'MessageSquare',
      metric: `${mostTalkative.messagePercentage}% share`,
    });

    // 2. Conversation Starter
    const topStarter = [...participantStats].sort((a, b) => b.conversationsInitiated - a.conversationsInitiated)[0];
    awards.push({
      id: 'top-starter',
      title: 'The Catalyst',
      recipient: topStarter.name,
      description: `Initiated ${topStarter.conversationsInitiated} conversations (${topStarter.initiationPercentage}% of all threads)`,
      icon: 'Sparkles',
      metric: `${topStarter.conversationsInitiated} starts`,
    });

    // 3. Speedy Responder
    const responders = participantStats.filter(p => p.responseCount >= 5);
    if (responders.length > 0) {
      const fastest = [...responders].sort((a, b) => a.medianResponseTimeSeconds - b.medianResponseTimeSeconds)[0];
      const mins = Math.round(fastest.medianResponseTimeSeconds / 60);
      awards.push({
        id: 'speed-demon',
        title: 'Speed Demon',
        recipient: fastest.name,
        description: `Median response time of ${mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : `${fastest.medianResponseTimeSeconds}s`}`,
        icon: 'Zap',
        metric: `${mins > 0 ? `${mins}m` : `${fastest.medianResponseTimeSeconds}s`}`,
      });
    }

    // 4. The Novelist (Longest messages)
    const novelist = [...participantStats].sort((a, b) => b.avgWordsPerMessage - a.avgWordsPerMessage)[0];
    if (novelist.avgWordsPerMessage > 3) {
      awards.push({
        id: 'the-novelist',
        title: 'The Novelist',
        recipient: novelist.name,
        description: `Averages ${novelist.avgWordsPerMessage} words per message`,
        icon: 'BookOpen',
        metric: `${novelist.avgWordsPerMessage} wpm`,
      });
    }

    // 5. Night Owl (Messages between 11pm and 5am)
    const nightOwls = participantStats.map(p => {
      const nightCount = (p.hourlyDistribution[23] || 0) + (p.hourlyDistribution[0] || 0) + 
                         (p.hourlyDistribution[1] || 0) + (p.hourlyDistribution[2] || 0) + 
                         (p.hourlyDistribution[3] || 0) + (p.hourlyDistribution[4] || 0);
      return { ...p, nightCount, nightRatio: p.totalMessages > 0 ? nightCount / p.totalMessages : 0 };
    }).sort((a, b) => b.nightRatio - a.nightRatio);

    if (nightOwls[0] && nightOwls[0].nightCount > 5) {
      awards.push({
        id: 'night-owl',
        title: 'The Night Owl',
        recipient: nightOwls[0].name,
        description: `${Math.round(nightOwls[0].nightRatio * 100)}% of messages sent after dark`,
        icon: 'Moon',
        metric: `${nightOwls[0].nightCount} night msgs`,
      });
    }

    // 6. Emoji Royalty
    const emojiChampion = [...participantStats].sort((a, b) => b.totalEmojis - a.totalEmojis)[0];
    if (emojiChampion.totalEmojis > 0) {
      const favEmoji = emojiChampion.topEmojis[0]?.emoji || '✨';
      awards.push({
        id: 'emoji-royalty',
        title: 'Emoji Royalty',
        recipient: emojiChampion.name,
        description: `Dropped ${emojiChampion.totalEmojis.toLocaleString()} emojis (Favorite: ${favEmoji})`,
        icon: 'Smile',
        metric: `${emojiChampion.totalEmojis} emojis`,
      });
    }

    // 7. Double Texter
    const doubleTexter = [...participantStats].sort((a, b) => b.doubleTextCount - a.doubleTextCount)[0];
    if (doubleTexter.doubleTextCount > 2) {
      awards.push({
        id: 'double-texter',
        title: 'The Double Texter',
        recipient: doubleTexter.name,
        description: `Sent multiple consecutive messages without waiting ${doubleTexter.doubleTextCount} times`,
        icon: 'Layers',
        metric: `${doubleTexter.doubleTextCount} runs`,
      });
    }

    // 8. Voice Note Maestro or Media King
    const mediaKing = [...participantStats].sort((a, b) => b.mediaCount - a.mediaCount)[0];
    if (mediaKing.mediaCount > 5) {
      awards.push({
        id: 'media-king',
        title: 'Media Enthusiast',
        recipient: mediaKing.name,
        description: `Shared ${mediaKing.mediaCount} photos, videos, stickers & voice notes`,
        icon: 'Camera',
        metric: `${mediaKing.mediaCount} media`,
      });
    }
  }

  // 7. 1-on-1 Chemistry Score (if exactly 2 participants)
  let chemistryScore: ChatAnalysis['chemistryScore'] | undefined;
  if (participantStats.length === 2) {
    const p1 = participantStats[0];
    const p2 = participantStats[1];

    // Talk Balance: 100 - (|p1% - 50| * 2)
    const talkBalance = Math.max(0, Math.min(100, Math.round(100 - (Math.abs(p1.messagePercentage - 50) * 2))));

    // Initiation Balance
    const totalInits = p1.conversationsInitiated + p2.conversationsInitiated;
    const p1InitPct = totalInits > 0 ? (p1.conversationsInitiated / totalInits) * 100 : 50;
    const initiationBalance = Math.max(0, Math.min(100, Math.round(100 - (Math.abs(p1InitPct - 50) * 2))));

    // Response Speed Balance (ratio of median response times)
    const r1 = Math.max(1, p1.medianResponseTimeSeconds);
    const r2 = Math.max(1, p2.medianResponseTimeSeconds);
    const speedRatio = Math.min(r1, r2) / Math.max(r1, r2);
    const responseSpeedBalance = Math.round(speedRatio * 100);

    // Effort Balance (words per message ratio)
    const w1 = Math.max(1, p1.avgWordsPerMessage);
    const w2 = Math.max(1, p2.avgWordsPerMessage);
    const effortBalance = Math.round((Math.min(w1, w2) / Math.max(w1, w2)) * 100);

    // Night Synergy
    const p1Night = (p1.hourlyDistribution[23] || 0) + (p1.hourlyDistribution[0] || 0) + (p1.hourlyDistribution[1] || 0);
    const p2Night = (p2.hourlyDistribution[23] || 0) + (p2.hourlyDistribution[0] || 0) + (p2.hourlyDistribution[1] || 0);
    const nightTotal = p1Night + p2Night;
    const nightSynergy = totalUserMessages > 0 ? Math.min(100, Math.round((nightTotal / (totalUserMessages * 0.15)) * 100)) : 50;

    const overall = Math.round(
      talkBalance * 0.35 +
      initiationBalance * 0.30 +
      responseSpeedBalance * 0.20 +
      effortBalance * 0.15
    );

    let summary = 'Remarkable balance and mutual engagement.';
    if (overall > 85) summary = 'Incredible connection! Both parties are equally invested, active, and responsive.';
    else if (overall > 70) summary = 'Great chemistry! Smooth conversation flow with high mutual interest.';
    else if (overall > 50) summary = 'Solid dynamic, though one person tends to drive topics or reply quicker.';
    else summary = 'Asymmetrical dynamic: one participant heavily leads initiations and volume.';

    chemistryScore = {
      overall,
      talkBalance,
      responseSpeedBalance,
      initiationBalance,
      effortBalance,
      nightOwlSynergy: nightSynergy,
      summary,
    };
  }

  return {
    title,
    isGroup,
    participants: participantStats,
    totalMessages: totalUserMessages,
    totalWords: participantStats.reduce((acc, p) => acc + p.totalWords, 0),
    totalMedia: participantStats.reduce((acc, p) => acc + p.mediaCount, 0),
    totalLinks: participantStats.reduce((acc, p) => acc + p.linksCount, 0),
    totalDeleted: participantStats.reduce((acc, p) => acc + p.deletedCount, 0),
    totalEmojis: participantStats.reduce((acc, p) => acc + p.totalEmojis, 0),
    startDate,
    endDate,
    totalDays,
    activeDaysCount,
    avgMessagesPerDay,
    threads,
    totalConversations: threads.length,
    avgThreadDurationMinutes: threads.length > 0 
      ? Math.round(threads.reduce((a, t) => a + t.durationMinutes, 0) / threads.length) 
      : 0,
    avgThreadMessageCount: threads.length > 0 
      ? Math.round((totalUserMessages / threads.length) * 10) / 10 
      : 0,
    longestConversationThread: longestThread,
    longestSilenceHours: Math.round(longestSilenceMs / (1000 * 60 * 60) * 10) / 10,
    hourlyActivity,
    dayOfWeekActivity,
    punchcard,
    dailyTimeline,
    monthlyTimeline,
    topGlobalEmojis,
    topGlobalWords,
    awards,
    chemistryScore,
  };
}

export function formatSeconds(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (mins < 60) {
    return `${mins}m ${remainingSecs > 0 ? `${remainingSecs}s` : ''}`.trim();
  }
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hrs}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`.trim();
}
