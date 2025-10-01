import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-gps-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gps-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpsAppComponent {
  phoneState = inject(PhoneStateService);
  mapUrl = 'https://picsum.photos/seed/map/360/780';
}
