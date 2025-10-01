import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZappStateService } from '../../../services/zapp-state.service';
import { ZappPostComponent } from '../zapp-post/zapp-post.component';

@Component({
  selector: 'app-zapp-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ZappPostComponent],
  templateUrl: './zapp-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappFeedComponent {
  zappState = inject(ZappStateService);

  newPostText = signal('');
  characterCount = signal(0);
  attachedImageUrl = signal<string | null>(null);
  readonly MAX_CHARS = 280;

  activeFeedTab = signal<'foryou' | 'following'>('foryou');

  activePosts = computed(() => {
    if (this.activeFeedTab() === 'following') {
        return this.zappState.followingPosts();
    }
    return this.zappState.posts();
  });

  setFeedTab(tab: 'foryou' | 'following') {
    this.activeFeedTab.set(tab);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.newPostText.set(value);
    this.characterCount.set(value.length);
  }

  createPost() {
    this.zappState.createPost(this.newPostText(), this.attachedImageUrl());
    this.newPostText.set('');
    this.characterCount.set(0);
    this.attachedImageUrl.set(null);
  }

  toggleAttachImage() {
    if (this.attachedImageUrl()) {
      this.attachedImageUrl.set(null);
    } else {
      // Use a random seed for a different image each time
      const randomSeed = Math.random().toString(36).substring(7);
      this.attachedImageUrl.set(`https://picsum.photos/seed/${randomSeed}/600/400`);
    }
  }
}