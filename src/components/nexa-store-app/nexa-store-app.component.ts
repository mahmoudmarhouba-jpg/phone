import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { NexaStoreService } from '../../services/nexa-store.service';
import { NexaStoreTodayComponent } from '../nexa-store-today/nexa-store-today.component';
import { NexaStoreDetailsComponent } from '../nexa-store-details/nexa-store-details.component';
import { NexaStoreUpdatesComponent } from '../nexa-store-updates/nexa-store-updates.component';

@Component({
  selector: 'app-nexa-store-app',
  standalone: true,
  imports: [CommonModule, NexaStoreTodayComponent, NexaStoreDetailsComponent, NexaStoreUpdatesComponent],
  templateUrl: './nexa-store-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NexaStoreAppComponent {
  phoneState = inject(PhoneStateService);
  nexaStore = inject(NexaStoreService);

  activeTab = this.nexaStore.selectedApp.name;

  isDetailsView = computed(() => !!this.nexaStore.selectedApp());

  currentView: 'today' | 'search' | 'updates' = 'today';

  setView(view: 'today' | 'search' | 'updates') {
    this.currentView = view;
  }
}
