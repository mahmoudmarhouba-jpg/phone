import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneStateService } from '../../services/phone-state.service';
import { Wallpaper } from '../../models/phone.models';

@Component({
  selector: 'app-wallpaper-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full bg-gray-200 dark:bg-black/50 backdrop-blur-xl text-gray-900 dark:text-white">
        <!-- Header -->
        <div class="p-4 pt-12 flex items-center">
            <button (click)="phoneState.navigateBack()" class="p-2 -ml-2 text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 class="text-xl font-bold mx-auto pr-6">Wallpaper</h1>
        </div>

        <!-- Settings List -->
        <div class="p-4">
            <div class="bg-white/60 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 class="font-semibold mb-3 text-lg">Choose a new wallpaper</h3>
                <div class="grid grid-cols-2 gap-4">
                    @for(wallpaper of phoneState.wallpapers(); track wallpaper.id) {
                        <div (click)="setWallpaper(wallpaper)" class="relative rounded-xl overflow-hidden cursor-pointer aspect-[9/19] border-4 transition-all" [class.border-blue-500]="phoneState.wallpaperUrl() === wallpaper.url" [class.border-transparent]="phoneState.wallpaperUrl() !== wallpaper.url">
                            <img [src]="wallpaper.url" [alt]="wallpaper.name" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <span class="absolute bottom-2 left-2 text-sm font-semibold text-white">{{ wallpaper.name }}</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallpaperSettingsComponent {
  phoneState = inject(PhoneStateService);

  setWallpaper(wallpaper: Wallpaper) {
    this.phoneState.setWallpaper(wallpaper.url);
  }
}
