import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-bank-app',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './bank-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAppComponent {
  phoneState = inject(PhoneStateService);
}
