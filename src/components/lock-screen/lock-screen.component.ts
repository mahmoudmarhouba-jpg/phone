import { ChangeDetectionStrategy, Component, output, signal, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockScreenComponent implements OnDestroy {
  phoneState = inject(PhoneStateService);
  unlock = output<void>();

  currentTime = signal(new Date());
  private timer: number;

  constructor() {
    this.timer = window.setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  onUnlock() {
    this.unlock.emit();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}