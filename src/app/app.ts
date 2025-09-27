import { Component, signal, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { WelcomeComponent } from './welcome.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WelcomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('crewcanV1');
  protected readonly showWelcome = signal(true);

  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    // Check if welcome has been completed
    const welcomeCompleted = localStorage.getItem('welcome-completed');
    if (welcomeCompleted === 'true') {
      this.showWelcome.set(false);
    }

    // Listen for welcome completion event
    window.addEventListener('welcome-completed', () => {
      this.showWelcome.set(false);
    });
  }

  ngOnDestroy(): void {
    this.themeService.destroy();
    window.removeEventListener('welcome-completed', () => {});
  }

  // Get current translations
  getTranslations() {
    return this.languageService.getTranslations();
  }
}
