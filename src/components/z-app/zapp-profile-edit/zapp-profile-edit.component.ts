import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZappStateService } from '../../../services/zapp-state.service';

@Component({
  selector: 'app-zapp-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zapp-profile-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappProfileEditComponent implements OnInit {
  zappState = inject(ZappStateService);

  user = this.zappState.currentUser;

  displayName = signal('');
  bio = signal('');

  ngOnInit() {
    this.displayName.set(this.user()?.displayName || '');
    this.bio.set(this.user()?.bio || '');
  }

  cancel() {
    this.zappState.setZappView('profile');
  }

  save() {
    this.zappState.updateUserProfile({
      displayName: this.displayName(),
      bio: this.bio(),
    });
    this.zappState.setZappView('profile');
  }
}
