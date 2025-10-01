import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZappStateService } from '../../../services/zapp-state.service';
import { PhoneStateService } from '../../../services/phone-state.service';
import { ZappPostComponent } from '../zapp-post/zapp-post.component';

@Component({
  selector: 'app-zapp-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ZappPostComponent],
  templateUrl: './zapp-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZappSearchComponent implements OnDestroy {
  zappState = inject(ZappStateService);
  phoneState = inject(PhoneStateService);

  // Two-way bind directly to the service's signal.
  // When the user types, zappSearchTerm is updated, which triggers
  // the zappSearchResults computed signal.
  searchTerm = this.zappState.zappSearchTerm;

  searchResults = this.zappState.zappSearchResults;
  hasSearchTerm = computed(() => this.searchTerm().trim().length > 0);

  constructor() {
    // Reset search term when the search view is entered,
    // in case the user navigates away and back.
    this.searchTerm.set('');
  }

  ngOnDestroy(): void {
    // Also clear the search term when leaving the component.
    this.searchTerm.set('');
  }
}
