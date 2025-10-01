import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneStateService } from '../../services/phone-state.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatViewComponent {
  phoneState = inject(PhoneStateService);
  newMessage = signal('');

  contact = computed(() => this.phoneState.selectedConversationContact());
  chatMessages = computed(() => {
    const contactNumber = this.contact()?.number;
    if (!contactNumber) return [];
    return this.phoneState.messages().filter(
      m => (m.from === contactNumber && m.to === this.phoneState.myPhoneNumber()) ||
           (m.to === contactNumber && m.from === this.phoneState.myPhoneNumber())
    ).sort((a, b) => a.timestamp - b.timestamp);
  });

  sendMessage() {
    const text = this.newMessage().trim();
    const to = this.contact()?.number;
    if (text && to) {
      this.phoneState.sendMessage(to, text);
      this.newMessage.set('');
    }
  }

  callContact() {
    const contact = this.contact();
    if(contact) {
      this.phoneState.startCall(contact);
    }
  }
}
