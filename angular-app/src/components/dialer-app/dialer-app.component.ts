import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { Contact } from '../../models/phone.models';

@Component({
  selector: 'app-dialer-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialer-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialerAppComponent {
  phoneState = inject(PhoneStateService);
  dialedNumber = signal('');

  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  pressKey(key: string) {
    this.dialedNumber.update(num => num + key);
  }

  backspace() {
    this.dialedNumber.update(num => num.slice(0, -1));
  }

  callNumber() {
    const number = this.dialedNumber();
    if (number.length > 0) {
      const existingContact = this.phoneState.contacts().find(c => c.number === number);
      const contact: Contact = existingContact ?? { id: number, name: number, number };
      this.phoneState.startCall(contact);
    }
  }
}
