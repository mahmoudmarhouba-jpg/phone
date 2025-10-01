import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { FlowPayService } from '../../services/flowpay.service';
import { FlowpayDashboardComponent } from './flowpay-dashboard/flowpay-dashboard.component';
import { FlowpayTransferComponent } from './flowpay-transfer/flowpay-transfer.component';
import { FlowpayHistoryComponent } from './flowpay-history/flowpay-history.component';
import { FlowpayQrComponent } from './flowpay-qr/flowpay-qr.component';

@Component({
  selector: 'app-flowpay-app',
  standalone: true,
  imports: [
    CommonModule,
    FlowpayDashboardComponent,
    FlowpayTransferComponent,
    FlowpayHistoryComponent,
    FlowpayQrComponent,
  ],
  templateUrl: './flowpay-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowpayAppComponent {
  phoneState = inject(PhoneStateService);
  flowpay = inject(FlowPayService);
}
