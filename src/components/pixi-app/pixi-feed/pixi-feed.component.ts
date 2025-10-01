import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';
import { PixiPostComponent } from '../pixi-post/pixi-post.component';
import { PixiUser } from '../../../models/pixi.models';

@Component({
  selector: 'app-pixi-feed',
  standalone: true,
  imports: [CommonModule, PixiPostComponent],
  templateUrl: './pixi-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiFeedComponent {
  pixiState = inject(PixiStateService);

  openStory(user: PixiUser) {
    if (user.stories.length > 0) {
      this.pixiState.openStory(user);
    }
  }
}
