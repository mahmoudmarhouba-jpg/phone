import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-camera-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraAppComponent {
  phoneState = inject(PhoneStateService);
}
