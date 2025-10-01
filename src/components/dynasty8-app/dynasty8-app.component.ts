import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-dynasty8-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynasty8-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dynasty8AppComponent {
  phoneState = inject(PhoneStateService);
}
