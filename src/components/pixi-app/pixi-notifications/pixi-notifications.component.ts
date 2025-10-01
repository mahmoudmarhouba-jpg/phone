import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';

@Component({
  selector: 'app-pixi-notifications',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pixi-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiNotificationsComponent {
  pixiState = inject(PixiStateService);
}
