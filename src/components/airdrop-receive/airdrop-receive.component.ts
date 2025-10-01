import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
// Fix: Import types from the model file directly, not the service.
import { AirdropService } from '../../services/airdrop.service';
import { AirdropRequest, PaymentRequest } from '../../models/airdrop.models';
import { Contact } from '../../models/phone.models';

@Component({
  selector: 'app-airdrop-receive',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './airdrop-receive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirdropReceiveComponent {
  airdropService = inject(AirdropService);

  get request(): AirdropRequest | null {
    return this.airdropService.incomingRequest();
  }

  // Type guard for the template
  get contactRequest(): Contact | null {
    const req = this.request;
    if (req?.itemType === 'contact') {
      return req.item as Contact;
    }
    return null;
  }

  get paymentRequest(): PaymentRequest | null {
    const req = this.request;
    if (req?.itemType === 'payment_request') {
      return req.item as PaymentRequest;
    }
    return null;
  }
  
  accept() {
    this.airdropService.acceptRequest();
  }

  decline() {
    this.airdropService.declineRequest();
  }
}
