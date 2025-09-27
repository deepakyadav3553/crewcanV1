import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private languageService = inject(LanguageService);
  private router = inject(Router);

  // Computed properties
  currentLanguage = computed(() => this.languageService.currentLanguage());
  t = computed(() => this.languageService.getTranslations());
  supportedLanguages = this.languageService.supportedLanguages;

  canProceed = computed(() => !!this.currentLanguage());

  getCurrentLanguageCode(): string {
    return this.languageService.getCurrentLanguageCode();
  }

  selectLanguage(languageCode: string): void {
    this.languageService.setLanguage(languageCode);
  }

  onGetStarted(): void {
    if (this.canProceed()) {
      // Mark welcome as completed
      localStorage.setItem('welcome-completed', 'true');

      // Navigate to login page
      this.router.navigate(['/login']);
    }
  }
}