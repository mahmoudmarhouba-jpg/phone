import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZappStateService } from '../../services/zapp-state.service';

import { ZappLoginComponent } from './zapp-login/zapp-login.component';
import { ZappFeedComponent } from './zapp-feed/zapp-feed.component';
import { ZappSearchComponent } from './zapp-search/zapp-search.component';
import { ZappNotificationsComponent } from './zapp-notifications/zapp-notifications.component';
import { ZappProfileComponent } from './zapp-profile/zapp-profile.component';
import { ZappPostDetailComponent } from './zapp-post-detail/zapp-post-detail.component';
import { ZappProfileEditComponent } from './zapp-profile-edit/zapp-profile-edit.component';

@Component({
  selector: 'app-z-app',
  standalone: true,
  imports: [
    CommonModule,
    ZappLoginComponent,
    ZappFeedComponent,
    ZappSearchComponent,
    ZappNotificationsComponent,
    ZappProfileComponent,
    ZappPostDetailComponent,
    ZappProfileEditComponent,
  ],
  templateUrl: './z-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZAppComponent {
  zappState = inject(ZappStateService);
}
