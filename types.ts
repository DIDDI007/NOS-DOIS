
export type AppView = 'hub' | 'countdown' | 'writing' | 'gallery' | 'favorites' | 'settings' | 'memories' | 'trash' | 'history' | 'chats' | 'diary';

export type EmotionType = 'longing' | 'tired' | 'sad' | 'happy' | 'close';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'partner';
  timestamp: number;
}

export interface ChatEntry {
  id: string;
  messages: Message[];
  emotion: string;
  timestamp: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
}

export interface EmotionContent {
  id: string;
  label: string;
  icon: string;
  greeting: string;
  color: string;
  messages: string[];
  suggestions: string[];
}

export interface EmotionHistoryEntry {
  id: string;
  emotionId: EmotionType;
  label: string;
  icon: string;
  timestamp: number;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  unlockCondition: string;
  isUnlocked: boolean;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: number;
}

export interface FavoriteMessage {
  id: string;
  text: string;
  timestamp: number;
  emotion?: string;
}

export interface AppSettings {
  targetDate: string;
  notificationsEnabled: boolean;
  nightMode: boolean;
  brightness: number;
}

export interface AppState {
  coupleId: string;
  currentView: AppView;
  photos: Photo[];
  trash: Photo[];
  favorites: FavoriteMessage[];
  history: EmotionHistoryEntry[];
  chats: ChatEntry[];
  diary: DiaryEntry[];
  settings: AppSettings;
  newPhotoNotification: boolean;
}
