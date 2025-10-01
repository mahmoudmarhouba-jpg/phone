import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { Wallpaper } from '../../models/phone.models';

@Component({
  selector: 'app-welcome-wizard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full bg-gray-100 text-gray-900 flex flex-col p-8 text-center">
      @switch (currentStep()) {
        @case (1) {
          <div class="flex-grow flex flex-col justify-center items-center">
            <h1 class="text-7xl font-bold">Hello.</h1>
            <p class="text-2xl mt-4 text-gray-600">Welcome to your new NeoCall.</p>
          </div>
          <button (click)="nextStep()" class="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-xl text-xl flex-shrink-0">
            Continue
          </button>
        }
        @case (2) {
          <div class="flex-grow flex flex-col overflow-hidden">
            <h2 class="text-3xl font-bold mt-12 flex-shrink-0">Choose Your Look</h2>
            <p class="text-lg mt-2 text-gray-600 mb-6 flex-shrink-0">Pick a wallpaper to get started.</p>
            <div class="grid grid-cols-2 gap-4 flex-grow overflow-y-auto">
              @for(wallpaper of phoneState.wallpapers(); track wallpaper.id) {
                <div (click)="selectWallpaper(wallpaper)" class="relative rounded-xl overflow-hidden cursor-pointer aspect-[9/19] border-4 border-transparent hover:border-blue-500 transition-all">
                  <img [src]="wallpaper.url" [alt]="wallpaper.name" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black/20"></div>
                  <span class="absolute bottom-2 left-2 text-sm font-semibold text-white">{{ wallpaper.name }}</span>
                </div>
              }
            </div>
          </div>
        }
        @case (3) {
          <div class="flex-grow flex flex-col justify-center items-center">
             <div class="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
             </div>
            <h1 class="text-5xl font-bold">You're All Set</h1>
            <p class="text-2xl mt-4 text-gray-600">Enjoy your new phone.</p>
          </div>
          <button (click)="finishSetup()" class="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-xl text-xl flex-shrink-0">
            Get Started
          </button>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeWizardComponent {
  phoneState = inject(PhoneStateService);
  setupComplete = output<void>();

  currentStep = signal(1);

  selectWallpaper(wallpaper: Wallpaper) {
    this.phoneState.setWallpaper(wallpaper.url);
    this.nextStep();
  }

  nextStep() {
    this.currentStep.update((s) => s + 1);
  }

  finishSetup() {
    this.setupComplete.emit();
  }
}