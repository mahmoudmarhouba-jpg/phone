import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlowPayService } from '../../../services/flowpay.service';
import { AirdropService } from '../../../services/airdrop.service';
import { PaymentRequest } from '../../../models/airdrop.models';

@Component({
  selector: 'app-flowpay-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './flowpay-transfer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowpayTransferComponent {
  flowpay = inject(FlowPayService);
  airdropService = inject(AirdropService);

  // Form state
  recipient = signal('');
  amount = signal<number | null>(null);
  note = signal('');

  // UI state
  isConfirmModalVisible = signal(false);

  get isFormValid(): boolean {
    const numericAmount = this.amount();
    return (
      this.recipient().trim().length > 0 &&
      numericAmount !== null &&
      numericAmount > 0 &&
      numericAmount <= this.flowpay.account().balance
    );
  }

  get isAirdropFormValid(): boolean {
    const numericAmount = this.amount();
    return (
      numericAmount !== null &&
      numericAmount > 0 &&
      numericAmount <= this.flowpay.account().balance
    );
  }

  showConfirmation() {
    if (this.isFormValid) {
      this.isConfirmModalVisible.set(true);
    }
  }

  hideConfirmation() {
    this.isConfirmModalVisible.set(false);
  }

  confirmTransfer() {
    if (this.isFormValid) {
      this.flowpay.sendTransfer(
        this.recipient(),
        this.amount()!,
        this.note()
      );
      this.hideConfirmation();
    }
  }

  sendViaAirdrop() {
    if (this.isAirdropFormValid) {
      const paymentRequest: PaymentRequest = {
        amount: this.amount()!,
        note: this.note() || undefined,
      };
      this.airdropService.openSendModal(paymentRequest, 'payment_request');
    }
  }
}