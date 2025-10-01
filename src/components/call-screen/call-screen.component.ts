import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { Call } from '../../models/phone.models';

@Component({
  selector: 'app-call-screen',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './call-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallScreenComponent implements OnInit, OnDestroy {
  phoneState = inject(PhoneStateService);
  call = this.phoneState.activeCall;
  duration = signal(0);
  private timer: number | undefined;

  ngOnInit() {
    const activeCall = this.call();
    if (activeCall) {
        // Simulate call connection
        if(activeCall.status === 'outgoing') {
            setTimeout(() => {
                this.call.update(c => c ? ({...c, status: 'active'}) : null);
                this.startTimer();
            }, 2000);
        } else {
            this.startTimer();
        }
    }
  }

  startTimer() {
    this.timer = window.setInterval(() => {
        this.duration.update(d => d + 1);
    }, 1000);
  }

  endCall() {
    this.phoneState.endCall();
  }

  ngOnDestroy() {
    if (this.timer) {
        clearInterval(this.timer);
    }
  }
}
