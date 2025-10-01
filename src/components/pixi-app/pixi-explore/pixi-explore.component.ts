import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';

@Component({
  selector: 'app-pixi-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixi-explore.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiExploreComponent {
  pixiState = inject(PixiStateService);
}
