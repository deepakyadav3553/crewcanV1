import { Component, signal, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('crewcanV1');
  private themeService = inject(ThemeService);

  // ThemeService automatically initializes mobile features and starts monitoring

  ngOnDestroy(): void {
    this.themeService.destroy();
  }
}
