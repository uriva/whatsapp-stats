export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'voice_note' 
  | 'sticker' 
  | 'gif' 
  | 'document' 
  | 'contact' 
  | 'location' 
  | 'deleted' 
  | 'call' 
  | 'system';

export interface ChatMessage {
  id: string;
  timestamp: Date;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  author: string;
  content: string;
  type: MessageType;
  isSystem: boolean;
  wordCount: number;
  charCount: number;
  emojis: string[];
  links: string[];
  isQuestion: boolean;
  isReplyToPrevious?: boolean;
  responseTimeSeconds?: number; // Time since previous message from a different author
}

export interface ConversationThread {
  id: string;
  startTime: Date;
  endTime: Date;
  initiator: string;
  messageCount: number;
  durationMinutes: number;
  participants: string[];
  messages: ChatMessage[];
  gapBeforeHours: number;
}

export interface ParticipantStats {
  name: string;
  color: string;
  totalMessages: number;
  messagePercentage: number;
  totalWords: number;
  totalChars: number;
  avgWordsPerMessage: number;
  avgCharsPerMessage: number;
  
  // Media stats
  mediaCount: number;
  imagesCount: number;
  videosCount: number;
  voiceNotesCount: number;
  stickersCount: number;
  documentsCount: number;
  linksCount: number;
  deletedCount: number;
  questionsCount: number;
  
  // Conversation initiation
  conversationsInitiated: number;
  initiationPercentage: number;
  morningInitiations: number; // 5am - 12pm
  afternoonInitiations: number; // 12pm - 5pm
  eveningInitiations: number; // 5pm - 10pm
  nightInitiations: number; // 10pm - 5am
  
  // Response times (in seconds)
  responseCount: number;
  avgResponseTimeSeconds: number;
  medianResponseTimeSeconds: number;
  fastestResponseTimeSeconds: number;
  slowestResponseTimeSeconds: number;
  responseTimeBuckets: {
    under1Min: number;
    oneToFiveMin: number;
    fiveToFifteenMin: number;
    fifteenToSixtyMin: number;
    oneToSixHours: number;
    overSixHours: number;
  };
  
  // Dynamics
  doubleTextCount: number; // Consecutive messages sent after long pause without reply
  leftOnReadCandidateCount: number; // Last message of a thread
  
  // Vocabulary & Emojis
  topEmojis: { emoji: string; count: number }[];
  totalEmojis: number;
  topWords: { word: string; count: number }[];
  laughCount: number; // haha, lol, etc.
  
  // Temporal
  hourlyDistribution: number[]; // 24 numbers
  dayOfWeekDistribution: number[]; // 7 numbers (0=Sun, 6=Sat)
  mostActiveHour: number;
  mostActiveDay: number;
}

export interface ChatAnalysis {
  title: string;
  isGroup: boolean;
  participants: ParticipantStats[];
  totalMessages: number;
  totalWords: number;
  totalMedia: number;
  totalLinks: number;
  totalDeleted: number;
  totalEmojis: number;
  
  startDate: Date;
  endDate: Date;
  totalDays: number;
  activeDaysCount: number;
  avgMessagesPerDay: number;
  
  // Threads & Initiations
  threads: ConversationThread[];
  totalConversations: number;
  avgThreadDurationMinutes: number;
  avgThreadMessageCount: number;
  longestConversationThread: ConversationThread | null;
  longestSilenceHours: number;
  
  // Heatmaps & Trends
  hourlyActivity: { hour: number; count: number; [key: string]: any }[];
  dayOfWeekActivity: { day: string; dayIndex: number; count: number; [key: string]: any }[];
  punchcard: { day: number; hour: number; count: number }[];
  dailyTimeline: { date: string; count: number; [key: string]: any }[];
  monthlyTimeline: { month: string; count: number; [key: string]: any }[];
  
  // Top Words & Emojis Global
  topGlobalEmojis: { emoji: string; count: number }[];
  topGlobalWords: { word: string; count: number }[];
  
  // Highlights & Fun Badges
  awards: ChatAward[];
  
  // 1-on-1 Specific Dynamics (if 2 participants)
  chemistryScore?: {
    overall: number; // 0-100
    talkBalance: number; // 0-100 (100 = 50/50 balance)
    responseSpeedBalance: number; // 0-100
    initiationBalance: number; // 0-100
    effortBalance: number; // words per message balance
    nightOwlSynergy: number; // how much they text at night together
    summary: string;
  };
}

export interface ChatAward {
  id: string;
  title: string;
  recipient: string;
  description: string;
  icon: string;
  metric: string;
}

export interface ParseOptions {
  dateFormat?: 'auto' | 'dmy' | 'mdy' | 'ymd';
  conversationGapHours?: number; // default 6
}
