import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PixiStateService } from '../../../services/pixi-state.service';

@Component({
  selector: 'app-pixi-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pixi-create-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiCreatePostComponent {
  pixiState = inject(PixiStateService);
  
  caption = signal('');
  // Use a random image for the new post preview
  previewImageUrl = `https://picsum.photos/seed/${Date.now()}/500/500`;

  cancel() {
    this.pixiState.setView('feed');
  }

  share() {
    this.pixiState.createPost(this.caption());
  }
}
