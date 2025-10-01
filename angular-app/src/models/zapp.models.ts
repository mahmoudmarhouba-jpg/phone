export interface ZUser {
  id: string; // Corresponds to player server ID or character ID
  username: string; // The unique @handle
  displayName: string;
  avatarUrl: string;
  headerUrl: string;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  followingIds: string[];
}

export interface ZComment {
    id: string;
    author: ZUser;
    text: string;
    timestamp: number;
}

export interface ZPost {
  id: string;
  author: ZUser;
  text: string;
  imageUrl?: string;
  timestamp: number;
  likes: number;
  reposts: number;
  comments: ZComment[];
  isLiked: boolean;
  isReposted: boolean;
  inReplyToUser?: ZUser;
}

export interface ZNotification {
  id: string;
  type: 'like' | 'repost' | 'mention' | 'reply' | 'follow';
  fromUser: ZUser;
  post?: ZPost;
  timestamp: number;
  isRead: boolean;
}