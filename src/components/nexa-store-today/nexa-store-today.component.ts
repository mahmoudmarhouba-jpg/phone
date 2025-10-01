import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NexaStoreService, StoreApp } from '../../services/nexa-store.service';

@Component({
  selector: 'app-nexa-store-today',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './nexa-store-today.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NexaStoreTodayComponent {
  nexaStore = inject(NexaStoreService);
  currentDate = new Date();

  viewDetails(appId: string) {
    this.nexaStore.selectAppForDetails(appId);
  }

  getAppById(appId: string): StoreApp | undefined {
    return this.nexaStore.availableApps().find(app => app.id === appId);
  }
}
