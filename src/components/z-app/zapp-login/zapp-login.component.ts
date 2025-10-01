import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZappStateService } from '../../../services/zapp-state.service';
import { PhoneStateService } from '../../../services/phone-state.service';

@Component({
  selector: 'app-zapp-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zapp-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappLoginComponent {
  zappState = inject(ZappStateService);
  phoneState = inject(PhoneStateService);

  username = signal('');
  displayName = signal('');

  createAccount() {
    const user = this.username().trim();
    const display = this.displayName().trim();
    if (user && display) {
      this.zappState.login(user, display);
    }
  }
}
