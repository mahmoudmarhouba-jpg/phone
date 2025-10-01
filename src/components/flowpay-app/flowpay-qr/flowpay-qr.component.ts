import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowPayService } from '../../../services/flowpay.service';

@Component({
  selector: 'app-flowpay-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flowpay-qr.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowpayQrComponent {
  flowpay = inject(FlowPayService);

  // In a real app, this would generate a QR code from the user's info.
  // For this mock, we use a placeholder image from an API.
  qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `flowpay:pay?acc=${this.flowpay.account().accountNumber}&name=${this.flowpay.account().ownerName}`
  )}`;

  close() {
    this.flowpay.setView('dashboard');
  }
}
