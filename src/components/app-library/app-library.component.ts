import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhoneStateService } from '../../services/phone-state.service';
import { App } from '../../models/phone.models';

interface AppCategory {
  name: string;
  apps: App[];
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-library.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLibraryComponent {
  phoneState = inject(PhoneStateService);
  
  searchTerm = signal('');

  // Fuzzy search logic
  private fuzzyMatch(term: string, text: string): boolean {
    term = term.toLowerCase();
    text = text.toLowerCase();
    let termIndex = 0;
    for (let i = 0; i < text.length && termIndex < term.length; i++) {
      if (text[i] === term[termIndex]) {
        termIndex++;
      }
    }
    return termIndex === term.length;
  }

  private allAppsExceptLibrary = computed(() => {
    return this.phoneState.allApps().filter(app => app.id !== 'app-library');
  });
  
  filteredApps = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.allAppsExceptLibrary();
    }
    return this.allAppsExceptLibrary().filter(app => this.fuzzyMatch(term, app.name));
  });

  categorizedApps = computed<AppCategory[]>(() => {
    const categories = new Map<string, App[]>();
    this.filteredApps().forEach(app => {
      const categoryName = app.category || 'Other';
      if (!categories.has(categoryName)) {
        categories.set(categoryName, []);
      }
      categories.get(categoryName)!.push(app);
    });
    
    return Array.from(categories.entries())
      .map(([name, apps]) => ({ name, apps }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // Swipe back to home screen logic
  private isDragging = false;
  private dragStartX = 0;
  private readonly swipeThreshold = 50; // Min pixels for a swipe

  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.dragStartX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    event.preventDefault();
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const dragEndX = (event instanceof MouseEvent) ? event.clientX : event.changedTouches[0].clientX;
    const deltaX = dragEndX - this.dragStartX;

    if (deltaX > this.swipeThreshold) { // Swiped right
      this.phoneState.navigateBack(); // Go back to home screen
    }
  }

  onAppClick(app: App): void {
    this.phoneState.navigate(app.component);
  }
}
