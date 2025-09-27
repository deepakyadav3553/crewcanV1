import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { LanguageService, Language } from '../../../../services/language.service';
import { BubbleBackgroundComponent } from '../../../../shared/components/bubble-background/bubble-background.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, BubbleBackgroundComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private languageService = inject(LanguageService);
  private router = inject(Router);

  // User type selection
  selectedUserType = signal<'employee' | 'employer' | null>(null);

  // Computed properties
  currentLanguage = computed(() => this.languageService.currentLanguage());
  t = computed(() => this.languageService.getTranslations());
  supportedLanguages = this.languageService.supportedLanguages;

  canProceed = computed(() => !!this.currentLanguage() && !!this.selectedUserType());

  getCurrentLanguageCode(): string {
    return this.languageService.getCurrentLanguageCode();
  }

  selectLanguage(languageCode: string): void {
    this.languageService.setLanguage(languageCode);
  }

  selectUserType(userType: 'employee' | 'employer'): void {
    this.selectedUserType.set(userType);
  }

  onGetStarted(): void {
    if (this.canProceed()) {
      // Store user selections
      localStorage.setItem('welcome-completed', 'true');
      localStorage.setItem('user-type', this.selectedUserType()!);

      // Navigate to login page
      this.router.navigate(['/login']);
    }
  }
}