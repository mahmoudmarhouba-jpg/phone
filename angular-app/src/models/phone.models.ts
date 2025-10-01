export interface Contact {
  id: string;
  name: string;
  number: string;
  avatar?: string;
  favorite?: boolean;
}

export interface Message {
  id: string;
  from: string; // Phone number
  to: string;   // Phone number
  text: string;
  timestamp: number;
  read: boolean;
  isSender: boolean;
}

export interface Conversation {
    contact: Contact;
    lastMessage: Message;
}

export interface App {
  id: string;
  name: string;
  icon: string; // Path to icon SVG or heroicon name
  component: string;
  notificationCount?: number;
  page?: number;
  category?: string;
  version?: string;
}

export interface Call {
    id: string;
    contact: Contact;
    status: 'incoming' | 'outgoing' | 'active' | 'ended';
    duration: number; // in seconds
    startTime?: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  description: string;
  amount: number;
  timestamp: number;
}

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
}