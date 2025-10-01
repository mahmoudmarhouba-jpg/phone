import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { NexaStoreService, StoreApp } from '../../services/nexa-store.service';
import { App } from '../../models/phone.models';

interface UpdatableApp {
  app: App;
  storeVersion: string;
  needsUpdate: boolean;
}

@Component({
  selector: 'app-nexa-store-updates',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './nexa-store-updates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NexaStoreUpdatesComponent {
  phoneState = inject(PhoneStateService);
  nexaStore = inject(NexaStoreService);

  installedApps = computed<UpdatableApp[]>(() => {
    const installed = this.phoneState.allApps();
    const storeApps = new Map(this.nexaStore.availableApps().map(app => [app.id, app]));

    return installed
      .filter(app => storeApps.has(app.id)) // Only show apps that exist in the store
      .map(app => {
        const storeApp = storeApps.get(app.id)!;
        // Simple version comparison. A more robust solution would use semver.
        const needsUpdate = storeApp.version > (app.version || '0.0.0');
        return {
          app,
          storeVersion: storeApp.version,
          needsUpdate,
        };
      })
      .sort((a, b) => (b.needsUpdate ? 1 : 0) - (a.needsUpdate ? 1 : 0)); // Sort apps needing updates to the top
  });
  
  viewDetails(appId: string) {
    this.nexaStore.selectAppForDetails(appId);
  }

  openApp(app: App) {
    this.phoneState.navigate(app.component);
  }

  updateApp(app: App) {
    console.log('Updating app:', app.name);
    // Add update logic here
  }
}
