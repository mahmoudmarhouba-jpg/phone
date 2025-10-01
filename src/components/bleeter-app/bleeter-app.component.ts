import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-bleeter-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bleeter-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BleeterAppComponent {
  phoneState = inject(PhoneStateService);
}
