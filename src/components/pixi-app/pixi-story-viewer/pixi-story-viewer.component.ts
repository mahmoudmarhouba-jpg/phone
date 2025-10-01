import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PixiStateService } from '../../../services/pixi-state.service';
import { PixiUser } from '../../../models/pixi.models';

@Component({
  selector: 'app-pixi-story-viewer',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pixi-story-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixiStoryViewerComponent implements OnInit, OnDestroy {
  pixiState = inject(PixiStateService);

  user = computed(() => this.pixiState.selectedStoryUser());
  stories = computed(() => this.user()?.stories || []);
  
  currentStoryIndex = signal(0);
  progress = signal(0);

  private timer: any;
  private progressInterval: any;

  ngOnInit() {
    this.startStory();
  }

  startStory() {
    const story = this.stories()[this.currentStoryIndex()];
    if (!story) {
        this.close();
        return;
    }

    this.progress.set(0);
    clearInterval(this.progressInterval);
    clearTimeout(this.timer);

    const duration = story.duration * 1000;
    const step = 100 / (duration / 50); // Update every 50ms

    this.progressInterval = setInterval(() => {
        this.progress.update(p => Math.min(100, p + step));
    }, 50);

    this.timer = setTimeout(() => {
      this.nextStory();
    }, duration);
  }

  nextStory() {
    if (this.currentStoryIndex() < this.stories().length - 1) {
      this.currentStoryIndex.update(i => i + 1);
      this.startStory();
    } else {
      this.close(); // Or go to next user's story
    }
  }

  prevStory() {
    if (this.currentStoryIndex() > 0) {
      this.currentStoryIndex.update(i => i - 1);
      this.startStory();
    } else {
        this.close(); // Or go to previous user's story
    }
  }

  handleTap(event: MouseEvent) {
    const { clientX, currentTarget } = event;
    const { width } = (currentTarget as HTMLElement).getBoundingClientRect();
    if (clientX < width / 3) {
      this.prevStory();
    } else {
      this.nextStory();
    }
  }

  close() {
    this.pixiState.closeStory();
  }

  ngOnDestroy() {
    clearInterval(this.progressInterval);
    clearTimeout(this.timer);
  }
}
