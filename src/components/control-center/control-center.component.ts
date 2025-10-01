import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlCenterComponent {
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}