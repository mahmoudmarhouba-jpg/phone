import { ChangeDetectionStrategy, Component, signal, OnDestroy, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBarComponent implements OnDestroy {
  currentTime = signal(new Date());
  toggleControlCenter = output<void>();
  private timer: number;

  constructor() {
    this.timer = window.setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
