import { Injectable, signal, computed } from '@angular/core';
import { PixiUser, PixiPost, PixiStory, PixiNotification, PixiComment } from '../models/pixi.models';

// --- MOCK DATA ---

const MOCK_USERS: PixiUser[] = [
  {
    id: 'user1',
    username: 'johnny_silver',
    displayName: 'Johnny Silver',
    avatarUrl: 'https://i.pravatar.cc/150?u=johnny',
    bio: 'Rockstar. Rebel. Legend. Making noise in Los Santos.',
    followers: 12500,
    following: 3,
    postCount: 5,
    isVerified: true,
    stories: [
      { id: 's1', imageUrl: 'https://picsum.photos/seed/js1/450/800', timestamp: Date.now() - 3600 * 1000 * 1, duration: 5 },
      { id: 's2', imageUrl: 'https://picsum.photos/seed/js2/450/800', timestamp: Date.now() - 3600 * 1000 * 2, duration: 5 },
    ],
    hasUnreadStory: true,
  },
  {
    id: 'user2',
    username: 'ava_v',
    displayName: 'Ava',
    avatarUrl: 'https://i.pravatar.cc/150?u=ava',
    bio: 'Just a girl exploring the city lights ✨',
    followers: 890,
    following: 250,
    postCount: 12,
    isVerified: false,
    stories: [
      { id: 's3', imageUrl: 'https://picsum.photos/seed/as1/450/800', timestamp: Date.now() - 3600 * 1000 * 3, duration: 7 },
    ],
    hasUnreadStory: true,
  },
  {
    id: 'user3',
    username: 'lspd_official',
    displayName: 'Los Santos Police Dept.',
    avatarUrl: 'https://i.pravatar.cc/150?u=lspd',
    bio: 'Official account of the LSPD. To Protect and to Serve.',
    followers: 54000,
    following: 1,
    postCount: 3,
    isVerified: true,
    stories: [],
    hasUnreadStory: false,
  },
   {
    id: 'user4',
    username: 'liam_the_wrench',
    displayName: 'Liam T.',
    avatarUrl: 'https://i.pravatar.cc/150?u=liam',
    bio: 'If it has wheels, I can fix it. LS Customs finest.',
    followers: 450,
    following: 500,
    postCount: 8,
    isVerified: false,
    stories: [],
    hasUnreadStory: false,
  },
];

const MOCK_POSTS: PixiPost[] = [
  {
    id: 'post1',
    author: MOCK_USERS[0],
    imageUrl: 'https://picsum.photos/seed/p1/500/500',
    caption: 'Another night, another gig. The city never sleeps. #rocknroll #livemusic',
    timestamp: Date.now() - 3600 * 1000 * 5,
    likes: 2345,
    comments: [
        { id: 'c1', author: MOCK_USERS[1], text: 'Awesome show! 🔥', timestamp: Date.now() - 3600 * 1000 * 4 },
    ],
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'post2',
    author: MOCK_USERS[1],
    imageUrl: 'https://picsum.photos/seed/p2/500/600',
    caption: 'Found this hidden gem in Vespucci. The vibes are immaculate.',
    timestamp: Date.now() - 3600 * 1000 * 24 * 2,
    likes: 789,
    comments: [],
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'post3',
    author: MOCK_USERS[2],
    imageUrl: 'https://picsum.photos/seed/p3/500/400',
    caption: 'LSPD is recruiting. Do you have what it takes to wear the badge? Visit our website to apply. #LSPD #ProtectAndServe',
    timestamp: Date.now() - 3600 * 1000 * 24 * 3,
    likes: 4500,
    comments: [],
    isLiked: false,
    isSaved: false,
  },
   {
    id: 'post4',
    author: MOCK_USERS[3],
    imageUrl: 'https://picsum.photos/seed/p4/500/500',
    caption: 'Just finished this beauty. A classic restored to its former glory. #carrestoration #lscustoms',
    timestamp: Date.now() - 3600 * 1000 * 8,
    likes: 302,
    comments: [],
    isLiked: true,
    isSaved: true,
  }
];

const MOCK_NOTIFICATIONS: PixiNotification[] = [
    { id: 'n1', type: 'like', fromUser: MOCK_USERS[1], post: MOCK_POSTS[0], timestamp: Date.now() - 3600*1000*1, isRead: false },
    { id: 'n2', type: 'follow', fromUser: MOCK_USERS[3], timestamp: Date.now() - 3600*1000*2, isRead: false },
    { id: 'n3', type: 'comment', fromUser: MOCK_USERS[0], post: MOCK_POSTS[2], timestamp: Date.now() - 3600*1000*6, isRead: true },
]

type PixiView = 'login' | 'feed' | 'explore' | 'create' | 'notifications' | 'profile';

@Injectable({ providedIn: 'root' })
export class PixiStateService {
  
  currentUser = signal<PixiUser | null>(null);
  posts = signal<PixiPost[]>([]);
  stories = signal<PixiUser[]>([]); // We only need the user list for the story bar
  notifications = signal<PixiNotification[]>([]);
  explorePosts = signal<PixiPost[]>([]);

  // --- UI STATE ---
  currentView = signal<PixiView>('login');
  isStoryViewerVisible = signal(false);
  selectedStoryUser = signal<PixiUser | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {}

  // --- ACTIONS ---
  login() {
    // In a real app, this would be the result of an auth flow.
    // For the demo, we'll log in as Johnny Silver.
    const loggedInUser = MOCK_USERS[0];
    this.currentUser.set(loggedInUser);
    this.posts.set(MOCK_POSTS);
    this.stories.set(MOCK_USERS.filter(u => u.stories.length > 0)); // Users with stories
    this.notifications.set(MOCK_NOTIFICATIONS);
    // Create a shuffled list for the explore page
    this.explorePosts.set([...MOCK_POSTS].sort(() => Math.random() - 0.5));
    this.currentView.set('feed');
  }

  logout() {
    this.currentUser.set(null);
    this.currentView.set('login');
  }
  
  setView(view: PixiView) {
    this.currentView.set(view);
  }

  toggleLike(postId: string) {
    this.posts.update(posts =>
      posts.map(p =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }
  
  createPost(caption: string) {
      const user = this.currentUser();
      if (!user) return;
      const newPost: PixiPost = {
        id: `post${Date.now()}`,
        author: user,
        imageUrl: `https://picsum.photos/seed/${Date.now()}/500/500`,
        caption,
        timestamp: Date.now(),
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
      };
      this.posts.update(posts => [newPost, ...posts]);
      this.setView('feed');
  }

  openStory(user: PixiUser) {
    this.selectedStoryUser.set(user);
    this.isStoryViewerVisible.set(true);
  }

  closeStory() {
    this.isStoryViewerVisible.set(false);
    // Mark story as read
    this.stories.update(users => users.map(u => u.id === this.selectedStoryUser()?.id ? {...u, hasUnreadStory: false} : u));
    this.selectedStoryUser.set(null);
  }
}