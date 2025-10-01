import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PhoneStateService } from '../../services/phone-state.service';
import { Conversation } from '../../models/phone.models';

@Component({
  selector: 'app-sms-app',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './sms-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsAppComponent {
  phoneState = inject(PhoneStateService);

  openConversation(convo: Conversation) {
    this.phoneState.selectConversation(convo.contact);
  }
}
