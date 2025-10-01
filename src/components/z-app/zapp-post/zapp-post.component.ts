import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ZPost } from '../../../models/zapp.models';
import { ZappStateService } from '../../../services/zapp-state.service';

@Component({
  selector: 'app-zapp-post',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './zapp-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappPostComponent {
  post = input.required<ZPost>();
  zappState = inject(ZappStateService);

  get formattedText(): string {
    let text = this.post().text;
    // Highlight hashtags
    text = text.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>');
    // Highlight mentions
    text = text.replace(/@(\w+)/g, '<span class="text-blue-500">@$1</span>');
    return text;
  }
  
  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    this.zappState.toggleLike(this.post().id);
  }

  toggleRepost(event: MouseEvent) {
    event.stopPropagation();
    this.zappState.toggleRepost(this.post().id);
  }
  
  viewPostDetails() {
    this.zappState.selectPostForDetail(this.post());
  }
}