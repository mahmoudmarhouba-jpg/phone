import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FlowPayService } from '../../../services/flowpay.service';

@Component({
  selector: 'app-flowpay-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './flowpay-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowpayDashboardComponent {
  flowpay = inject(FlowPayService);
}
