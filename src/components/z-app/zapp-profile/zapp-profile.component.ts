import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZappStateService } from '../../../services/zapp-state.service';
import { PhoneStateService } from '../../../services/phone-state.service';
import { ZappPostComponent } from '../zapp-post/zapp-post.component';

@Component({
  selector: 'app-zapp-profile',
  standalone: true,
  imports: [CommonModule, ZappPostComponent],
  templateUrl: './zapp-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappProfileComponent {
  zappState = inject(ZappStateService);
  phoneState = inject(PhoneStateService);

  activeProfileTab = signal<'posts' | 'replies' | 'media' | 'likes'>('posts');

  setProfileTab(tab: 'posts' | 'replies' | 'media' | 'likes') {
    this.activeProfileTab.set(tab);
  }

  private userAllPosts = computed(() => {
    const user = this.zappState.currentUser();
    if (!user) return [];
    // For this profile view, we only show posts by the current user.
    return this.zappState.posts().filter(post => post.author.id === user.id);
  });

  userPosts = computed(() => {
    return this.userAllPosts().filter(p => !p.inReplyToUser);
  });
  
  userReplies = computed(() => {
    return this.userAllPosts().filter(p => !!p.inReplyToUser);
  });

  userMedia = computed(() => {
    return this.userAllPosts().filter(p => !!p.imageUrl);
  });

  userLikes = computed(() => {
    // This shows all posts the current user has liked, regardless of author.
    // This is consistent with how the "Likes" tab works on Twitter/X.
    return this.zappState.userLikedPosts();
  });

  editProfile() {
    this.zappState.setZappView('profile-edit');
  }
}
