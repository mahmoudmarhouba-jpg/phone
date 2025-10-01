import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-lifinvader-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lifinvader-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifinvaderAppComponent {
  phoneState = inject(PhoneStateService);
}
