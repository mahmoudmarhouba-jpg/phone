import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';

@Component({
  selector: 'app-pixi-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixi-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiProfileComponent {
  pixiState = inject(PixiStateService);
  
  user = this.pixiState.currentUser;
  
  userPosts = computed(() => {
    const userId = this.user()?.id;
    if(!userId) return [];
    return this.pixiState.posts().filter(p => p.author.id === userId);
  });
}
