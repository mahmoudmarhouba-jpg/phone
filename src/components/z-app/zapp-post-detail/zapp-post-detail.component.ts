import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZappStateService } from '../../../services/zapp-state.service';
import { ZappPostComponent } from '../zapp-post/zapp-post.component';
import { ZappCommentComponent } from '../zapp-comment/zapp-comment.component';

@Component({
  selector: 'app-zapp-post-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ZappPostComponent, ZappCommentComponent],
  templateUrl: './zapp-post-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappPostDetailComponent {
  zappState = inject(ZappStateService);

  post = computed(() => this.zappState.selectedPost());
  newCommentText = signal('');

  get formattedText(): string {
    const postText = this.post()?.text || '';
    // Highlight hashtags
    let text = postText.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>');
    // Highlight mentions
    text = text.replace(/@(\w+)/g, '<span class="text-blue-500">@$1</span>');
    return text;
  }

  addComment() {
    const postId = this.post()?.id;
    if (postId && this.newCommentText().trim()) {
      this.zappState.addComment(postId, this.newCommentText());
      this.newCommentText.set('');
    }
  }

  goBack() {
    this.zappState.selectPostForDetail(null);
  }
  
  // Dummy methods to stop propagation since actions are handled globally for now
  toggleLike(event: MouseEvent) { event.stopPropagation(); }
  toggleRepost(event: MouseEvent) { event.stopPropagation(); }
}