import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexaStoreService, AppStatus } from '../../services/nexa-store.service';
import { PhoneStateService } from '../../services/phone-state.service';
import { App } from '../../models/phone.models';

@Component({
  selector: 'app-nexa-store-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nexa-store-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NexaStoreDetailsComponent {
  nexaStore = inject(NexaStoreService);
  phoneState = inject(PhoneStateService);

  app = computed(() => this.nexaStore.selectedApp());
  appStatus = computed<AppStatus>(() => {
    const currentApp = this.app();
    if (!currentApp) return 'not_installed';
    return this.nexaStore.appStatuses().get(currentApp.id) || 'not_installed';
  });

  goBack() {
    this.nexaStore.selectAppForDetails(null);
  }

  handlePrimaryAction() {
    const currentApp = this.app();
    if (!currentApp) return;

    const status = this.appStatus();

    switch (status) {
      case 'not_installed':
        this.installApp(currentApp);
        break;
      case 'installed':
        this.phoneState.navigate(currentApp.component);
        break;
      case 'installing':
        // Cancel logic could go here
        break;
    }
  }

  installApp(app: App) {
    this.nexaStore.setAppStatus(app.id, 'installing');
    // Simulate a download
    setTimeout(() => {
      this.phoneState.installApp(app);
      // The service will set status to 'installed'
    }, 2000);
  }

  uninstallApp() {
    const currentApp = this.app();
    if (currentApp) {
      this.phoneState.uninstallApp(currentApp.id);
    }
  }
}
