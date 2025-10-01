import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneStateService } from '../../services/phone-state.service';
import { App } from '../../models/phone.models';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeScreenComponent {
  phoneState = inject(PhoneStateService);

  private longPressTimer?: number;
  private isDragging = false;
  private dragStartX = 0;
  private readonly swipeThreshold = 50; // Min pixels for a swipe

  // --- Event Handlers for Page Swiping ---

  onDragStart(event: MouseEvent | TouchEvent) {
    // Prevent starting a swipe if an app is being long-pressed or jiggle mode is active
    if (this.phoneState.isJiggleModeActive()) return;
    this.isDragging = true;
    this.dragStartX = this.getClientX(event);
    event.preventDefault(); // Prevents text selection
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const dragEndX = (event instanceof MouseEvent) ? event.clientX : event.changedTouches[0].clientX;
    const deltaX = dragEndX - this.dragStartX;
    const currentPage = this.phoneState.homeScreenPageIndex();
    const pageCount = this.phoneState.homeScreenPages().length;

    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0 && currentPage > 0) {
        // Swipe Right
        this.phoneState.setHomeScreenPage(currentPage - 1);
      } else if (deltaX < 0) {
        // Swipe Left
        if (currentPage < pageCount - 1) {
          this.phoneState.setHomeScreenPage(currentPage + 1);
        } else {
          // Swiped left on the last page, go to App Library
          this.phoneState.navigate('app-library');
        }
      }
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  // --- Event Handlers for App Icons ---

  onAppClick(app: App): void {
    // A click is a fast press, so this will fire before the long press timer.
    this.cancelPressTimer();
    if (!this.phoneState.isJiggleModeActive()) {
      this.phoneState.navigate(app.component);
    }
  }

  startPressTimer(): void {
    this.cancelPressTimer();
    this.longPressTimer = window.setTimeout(() => this.phoneState.toggleJiggleMode(true), 500);
  }

  cancelPressTimer(): void {
    clearTimeout(this.longPressTimer);
  }

  removeApp(event: MouseEvent, appId: string): void {
    event.stopPropagation();
    this.phoneState.uninstallApp(appId);
  }

  exitJiggleMode(): void {
    if (this.phoneState.isJiggleModeActive()) {
      this.phoneState.toggleJiggleMode(false);
    }
  }
}
