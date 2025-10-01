import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AirdropService } from '../../services/airdrop.service';
import { Player, PaymentRequest } from '../../models/airdrop.models';
import { Contact } from '../../models/phone.models';

@Component({
  selector: 'app-airdrop-send',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './airdrop-send.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirdropSendComponent {
  airdropService = inject(AirdropService);

  // Cast the item to Contact for the template
  get contactToSend(): Contact | null {
    const itemData = this.airdropService.itemToSend();
    if (itemData?.type === 'contact') {
      return itemData.item as Contact;
    }
    return null;
  }

  get paymentRequestToSend(): PaymentRequest | null {
    const itemData = this.airdropService.itemToSend();
    if (itemData?.type === 'payment_request') {
      return itemData.item as PaymentRequest;
    }
    return null;
  }
  
  selectPlayer(player: Player) {
    this.airdropService.sendItem(player);
  }

  cancel() {
    this.airdropService.closeSendModal();
  }
}