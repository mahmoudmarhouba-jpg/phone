import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneStateService } from './services/phone-state.service';
import { NuiService } from './services/nui.service';
import { PhoneShellComponent } from './components/phone-shell/phone-shell.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (phoneState.isPhoneVisible()) {
      <!-- Outer container for perspective effect -->
      <div class="scale-[.95] [perspective:1200px] select-none">
        <!-- The phone body -->
        <div
          class="w-[390px] h-[844px] transition-transform duration-700 ease-in-out transform-gpu [transform-style:preserve-3d]"
        >
          <!-- Phone Bezel/Frame -->
          <div class="absolute inset-0 bg-zinc-900 rounded-[60px] shadow-2xl p-4">
            <!-- Side buttons & ports for realism -->
            <button
              (click)="toggleSilentMode()"
              class="absolute left-[-3px] top-[112px] w-[4px] h-8 bg-zinc-700 rounded-l-sm hover:bg-zinc-600 transition-colors"
              aria-label="Toggle Silent Mode"
            ></button>
            <!-- Silent Switch -->
            <button
              (click)="volumeUp()"
              class="absolute left-[-3px] top-[160px] w-[4px] h-8 bg-zinc-700 rounded-l-sm hover:bg-zinc-600 transition-colors"
              aria-label="Volume Up"
            ></button>
            <!-- Volume Up -->
            <button
              (click)="volumeDown()"
              class="absolute left-[-3px] top-[200px] w-[4px] h-8 bg-zinc-700 rounded-l-sm hover:bg-zinc-600 transition-colors"
              aria-label="Volume Down"
            ></button>
            <!-- Volume Down -->

            <button
              (click)="powerButtonPress()"
              class="absolute right-[-3px] top-[180px] w-[4px] h-24 bg-zinc-700 rounded-r-sm hover:bg-zinc-600 transition-colors"
              aria-label="Power Button"
            ></button>
            <!-- Power Button -->

            <!-- The screen itself -->
            <div class="w-full h-full bg-black overflow-hidden rounded-[44px]">
              <app-phone-shell />
            </div>
          </div>
        </div>
      </div>
    }
  `,
  imports: [CommonModule, PhoneShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  phoneState = inject(PhoneStateService);
  nuiService = inject(NuiService);

  constructor() {
    // Listen for visibility changes from the client script
    this.nuiService.messages$
      .pipe(filter((message) => message.action === 'setVisible'))
      .subscribe((message) => {
        this.phoneState.togglePhoneVisibility(message.payload);
      });
  }

  /**
   * Handles the power button press, mimicking real phone logic:
   * - If screen is on and unlocked, lock it.
   * - If screen is on and locked, turn it off.
   */
  powerButtonPress() {
    if (!this.phoneState.isLocked()) {
      this.phoneState.lockPhone();
    } else {
      // This will trigger the effect in PhoneStateService to post 'closePhone'
      this.phoneState.togglePhoneVisibility(false);
    }
  }

  volumeUp() {
    this.phoneState.adjustVolume(10);
  }

  volumeDown() {
    this.phoneState.adjustVolume(-10);
  }

  toggleSilentMode() {
    this.phoneState.toggleSilentMode();
  }
}
