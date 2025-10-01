import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ZComment } from '../../../models/zapp.models';

@Component({
  selector: 'app-zapp-comment',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './zapp-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappCommentComponent {
  comment = input.required<ZComment>();
}