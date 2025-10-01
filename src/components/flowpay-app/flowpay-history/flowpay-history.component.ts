import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FlowPayService } from '../../../services/flowpay.service';

@Component({
  selector: 'app-flowpay-history',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './flowpay-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowpayHistoryComponent {
  flowpay = inject(FlowPayService);
}
