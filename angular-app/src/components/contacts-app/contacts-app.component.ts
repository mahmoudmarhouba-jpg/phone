import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneStateService } from '../../services/phone-state.service';
import { AirdropService } from '../../services/airdrop.service';
import { Contact } from '../../models/phone.models';

@Component({
  selector: 'app-contacts-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsAppComponent {
  phoneState = inject(PhoneStateService);
  airdropService = inject(AirdropService);
  
  favorites = computed(() => this.phoneState.contacts().filter(c => c.favorite));
  otherContacts = computed(() => this.phoneState.contacts().filter(c => !c.favorite).sort((a,b) => a.name.localeCompare(b.name)));

  callContact(contact: Contact) {
    this.phoneState.startCall(contact);
  }

  messageContact(contact: Contact) {
    this.phoneState.selectConversation(contact);
  }

  shareContact(event: MouseEvent, contact: Contact) {
    event.stopPropagation();
    this.airdropService.openSendModal(contact, 'contact');
  }
}
