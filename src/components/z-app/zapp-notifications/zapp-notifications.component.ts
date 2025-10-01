import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZappStateService } from '../../../services/zapp-state.service';
import { PhoneStateService } from '../../../services/phone-state.service';

@Component({
  selector: 'app-zapp-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zapp-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappNotificationsComponent {
  zappState = inject(ZappStateService);
  phoneState = inject(PhoneStateService);
}
