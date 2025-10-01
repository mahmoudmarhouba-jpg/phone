import { Injectable, signal, computed } from '@angular/core';
import { ZUser, ZPost, ZNotification, ZComment } from '../models/zapp.models';

// --- MOCK DATA ---

const MOCK_USERS: ZUser[] = [
  {
    id: 'player1', // Aligned with the default logged-in user ID
    username: 't-hayes',
    displayName: 'Tony Hayes',
    avatarUrl: 'https://i.pravatar.cc/150?u=tony',
    headerUrl: 'https://picsum.photos/seed/th-header/600/200',
    bio: 'Just a guy trying to make it in the city. LSVC Founder.',
    followers: 1258,
    following: 134,
    isVerified: true,
    followingIds: ['2'], // Follows Weazel News
  },
  {
    id: '2',
    username: 'weazelnews',
    displayName: 'Weazel News',
    avatarUrl: 'https://i.pravatar.cc/150?u=weazel',
    headerUrl: 'https://picsum.photos/seed/wn-header/600/200',
    bio: 'Your top source for news, weather, and traffic in Los Santos. #WeazelNews',
    followers: 25432,
    following: 12,
    isVerified: true,
    followingIds: [],
  },
  {
    id: '3',
    username: 'ava-j',
    displayName: 'Ava',
    avatarUrl: 'https://i.pravatar.cc/150?u=ava',
    headerUrl: 'https://picsum.photos/seed/aj-header/600/200',
    bio: 'Just vibing ✨',
    followers: 450,
    following: 300,
    isVerified: false,
    followingIds: ['player1', '2'], // Follows Tony and Weazel News
  },
];

const MOCK_COMMENTS: ZComment[] = [
    { id: 'c1', author: MOCK_USERS[2], text: 'This is huge!', timestamp: Date.now() - 1000 * 60 * 60 },
    { id: 'c2', author: MOCK_USERS[0], text: 'Can\'t wait to see what you\'ve been working on.', timestamp: Date.now() - 1000 * 60 * 30 },
];

const MOCK_POSTS: ZPost[] = [
  {
    id: 'p1',
    author: MOCK_USERS[1],
    text: 'BREAKING: Another high-speed pursuit concludes downtown. Suspects at large. Expect traffic delays around Pillbox Hill. #LosSantos #LSPD',
    timestamp: Date.now() - 1000 * 60 * 5,
    likes: 156,
    reposts: 89,
    comments: [],
    isLiked: false,
    isReposted: false,
  },
  {
    id: 'p2',
    author: MOCK_USERS[0],
    text: 'Big things coming soon for LSVC. Stay tuned.',
    imageUrl: 'https://picsum.photos/seed/lsvc/600/400',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: 302,
    reposts: 78,
    comments: MOCK_COMMENTS,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 'p3',
    author: MOCK_USERS[2],
    text: 'Coffee at Bean Machine is the only way to start the day ☕️',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    likes: 98,
    reposts: 12,
    comments: [],
    isLiked: false,
    isReposted: true,
  },
  {
    id: 'p4',
    author: MOCK_USERS[0],
    text: 'Great report as always.',
    timestamp: Date.now() - 1000 * 60 * 4,
    likes: 12,
    reposts: 2,
    comments: [],
    isLiked: false,
    isReposted: false,
    inReplyToUser: MOCK_USERS[1], // This is a reply
  },
  {
    id: 'p5',
    author: MOCK_USERS[2],
    text: 'Can\'t wait for this!',
    timestamp: Date.now() - 1000 * 60 * 60 * 1,
    likes: 45,
    reposts: 5,
    comments: [],
    isLiked: true,
    isReposted: false,
    inReplyToUser: MOCK_USERS[0], // Another reply
  },
];

const MOCK_NOTIFICATIONS: ZNotification[] = [
    { id: 'n1', type: 'like', fromUser: MOCK_USERS[2], post: MOCK_POSTS[1], timestamp: Date.now() - 1000 * 60 * 10, isRead: false },
    { id: 'n2', type: 'repost', fromUser: MOCK_USERS[0], post: MOCK_POSTS[2], timestamp: Date.now() - 1000 * 60 * 30, isRead: false },
    { id: 'n3', type: 'follow', fromUser: MOCK_USERS[1], timestamp: Date.now() - 1000 * 60 * 60 * 3, isRead: true },
    { id: 'n4', type: 'like', fromUser: MOCK_USERS[0], post: MOCK_POSTS[1], timestamp: Date.now() - 1000 * 60 * 60 * 5, isRead: true },
];

type ZappView = 'feed' | 'search' | 'notifications' | 'profile' | 'profile-edit';

@Injectable({ providedIn: 'root' })
export class ZappStateService {
  currentUser = signal<ZUser | null>(null);
  posts = signal<ZPost[]>([]);
  notifications = signal<ZNotification[]>([]);
  allUsers = signal<ZUser[]>(MOCK_USERS);
  trendingHashtags = signal<{ tag: string, count: string }[]>([
      { tag: '#WeazelNews', count: '1,203 posts' },
      { tag: '#FleecaHeist', count: '890 posts' },
      { tag: '#GruppeSechs', count: '754 posts' },
      { tag: '#LSPD', count: '688 posts' },
      { tag: '#Vinewood', count: '501 posts' },
    ]);
  
  selectedPost = signal<ZPost | null>(null);
  zappView = signal<ZappView>('feed');
  zappSearchTerm = signal('');

  isPostDetailView = computed(() => !!this.selectedPost());
  isLoggedIn = computed(() => !!this.currentUser());

  // --- DERIVED STATE ---
  followingPosts = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    const followingIds = user.followingIds;
    return this.posts().filter(post => followingIds.includes(post.author.id));
  });

  userLikedPosts = computed(() => {
    // This simulates the logged-in user's liked posts.
    return this.posts().filter(post => post.isLiked);
  });
  
  zappSearchResults = computed(() => {
    const term = this.zappSearchTerm().trim().toLowerCase();
    if (!term) {
        return { users: [], posts: [] };
    }

    const users = this.allUsers().filter(
        u => u.displayName.toLowerCase().includes(term) || u.username.toLowerCase().includes(term)
    );

    const posts = this.posts().filter(
        p => p.text.toLowerCase().includes(term)
    );

    return { users, posts };
  });

  constructor() {
    // For browser testing, auto-login after a short delay
    // setTimeout(() => {
    //   this.login('devUser', 'Dev User');
    // }, 500);
  }

  // --- ACTIONS ---

  setZappView(view: ZappView) {
    this.zappView.set(view);
  }

  login(username: string, displayName: string, avatarUrl?: string) {
    // In a real app, this would come from the server after auth
    const newUser: ZUser = {
      id: 'player1', // This would be the player's server ID
      username,
      displayName,
      avatarUrl: avatarUrl || `https://i.pravatar.cc/150?u=${username}`,
      headerUrl: 'https://picsum.photos/seed/p1-header/600/200',
      bio: 'New to Z! Just figuring this thing out.',
      followers: 0,
      following: 2,
      isVerified: false,
      followingIds: ['2', '3'],
    };
    this.currentUser.set(MOCK_USERS[0]); // Use mock user with posts for demo
    this.fetchFeed(); // Load the feed after logging in
    this.fetchNotifications();
  }

  logout() {
    this.currentUser.set(null);
    this.posts.set([]);
  }

  fetchFeed() {
    // Simulate fetching posts from a server
    this.posts.set(MOCK_POSTS);
  }
  
  fetchNotifications() {
      this.notifications.set(MOCK_NOTIFICATIONS);
  }

  createPost(text: string, imageUrl?: string | null) {
    const user = this.currentUser();
    if (!user || !text.trim()) return;

    const newPost: ZPost = {
      id: `p${Date.now()}`,
      author: user,
      text: text.trim(),
      imageUrl: imageUrl ?? undefined,
      timestamp: Date.now(),
      likes: 0,
      reposts: 0,
      comments: [],
      isLiked: false,
      isReposted: false,
    };

    this.posts.update(currentPosts => [newPost, ...currentPosts]);
  }

  toggleLike(postId: string) {
    this.posts.update(posts =>
      posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
    // TODO: Send NUI message to server
  }

  toggleRepost(postId: string) {
    this.posts.update(posts =>
      posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isReposted: !p.isReposted,
            reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1,
          };
        }
        return p;
      })
    );
     // TODO: Send NUI message to server
  }

  selectPostForDetail(post: ZPost | null) {
    this.selectedPost.set(post);
  }

  addComment(postId: string, text: string) {
    const user = this.currentUser();
    if(!user || !text.trim()) return;

    const newComment: ZComment = {
        id: `c${Date.now()}`,
        author: user,
        text: text.trim(),
        timestamp: Date.now()
    };

    this.posts.update(posts => posts.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                comments: [...p.comments, newComment]
            };
        }
        return p;
    }));
    
    // Also update the selected post if it's the one being commented on
    if(this.selectedPost()?.id === postId) {
        this.selectedPost.update(p => p ? ({ ...p, comments: [...p.comments, newComment] }) : null);
    }
  }

  updateUserProfile(data: { displayName: string, bio: string }) {
    this.currentUser.update(user => {
        if (!user) return null;
        return {
            ...user,
            displayName: data.displayName,
            bio: data.bio,
        };
    });
  }
}