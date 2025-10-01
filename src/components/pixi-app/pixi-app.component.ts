import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiStateService } from '../../services/pixi-state.service';
import { PixiLoginComponent } from './pixi-login/pixi-login.component';
import { PixiFeedComponent } from './pixi-feed/pixi-feed.component';
import { PixiStoryViewerComponent } from './pixi-story-viewer/pixi-story-viewer.component';
import { PixiExploreComponent } from './pixi-explore/pixi-explore.component';
import { PixiCreatePostComponent } from './pixi-create-post/pixi-create-post.component';
import { PixiNotificationsComponent } from './pixi-notifications/pixi-notifications.component';
import { PixiProfileComponent } from './pixi-profile/pixi-profile.component';


@Component({
  selector: 'app-pixi-app',
  standalone: true,
  imports: [
    CommonModule,
    PixiLoginComponent,
    PixiFeedComponent,
    PixiStoryViewerComponent,
    PixiExploreComponent,
    PixiCreatePostComponent,
    PixiNotificationsComponent,
    PixiProfileComponent,
  ],
  templateUrl: './pixi-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiAppComponent {
  pixiState = inject(PixiStateService);
}
