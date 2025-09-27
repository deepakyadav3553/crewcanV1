import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bubble-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-background.component.html',
  styleUrl: './bubble-background.component.scss'
})
export class BubbleBackgroundComponent {
  @Input() density: 'light' | 'medium' | 'heavy' = 'medium';
  @Input() color: 'blue' | 'purple' | 'green' = 'blue';
  @Input() speed: 'slow' | 'normal' | 'fast' = 'normal';

  get bubbleCount(): number {
    switch (this.density) {
      case 'light': return 4;
      case 'medium': return 6;
      case 'heavy': return 8;
      default: return 6;
    }
  }

  get bubbles(): number[] {
    return Array.from({ length: this.bubbleCount }, (_, i) => i + 1);
  }
}