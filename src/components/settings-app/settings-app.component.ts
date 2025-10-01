import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-settings-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAppComponent {
  phoneState = inject(PhoneStateService);

  setTheme(theme: 'light' | 'dark') {
    this.phoneState.setTheme(theme);
  }
}
