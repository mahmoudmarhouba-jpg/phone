export interface PixiUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  postCount: number;
  isVerified: boolean;
  stories: PixiStory[];
  hasUnreadStory: boolean;
}

export interface PixiStory {
  id: string;
  imageUrl: string;
  timestamp: number;
  duration: number; // in seconds
}

export interface PixiPost {
  id: string;
  author: PixiUser;
  imageUrl: string;
  caption: string;
  timestamp: number;
  likes: number;
  comments: PixiComment[];
  isLiked: boolean;
  isSaved: boolean;
}

export interface PixiComment {
  id: string;
  author: PixiUser;
  text: string;
  timestamp: number;
}

export interface PixiNotification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  fromUser: PixiUser;
  post?: PixiPost;
  timestamp: number;
  isRead: boolean;
}