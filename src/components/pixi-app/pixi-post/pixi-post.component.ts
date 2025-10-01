import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PixiPost } from '../../../models/pixi.models';
import { PixiStateService } from '../../../services/pixi-state.service';

@Component({
  selector: 'app-pixi-post',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pixi-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiPostComponent {
  post = input.required<PixiPost>();
  pixiState = inject(PixiStateService);
  
  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    this.pixiState.toggleLike(this.post().id);
  }
}
