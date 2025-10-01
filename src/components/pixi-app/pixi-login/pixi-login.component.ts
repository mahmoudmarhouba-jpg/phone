import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';
import { PhoneStateService } from '../../../services/phone-state.service';

@Component({
  selector: 'app-pixi-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixi-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiLoginComponent {
  pixiState = inject(PixiStateService);
  phoneState = inject(PhoneStateService);

  login() {
    this.pixiState.login();
  }
}
