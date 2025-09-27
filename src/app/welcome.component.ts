import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LanguageService, Language } from './services/language.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <div class="welcome-container">
      <!-- Status Bar Safe Area -->
      <div class="status-safe-area"></div>

      <!-- Header -->
      <div class="header">
        <div class="logo-wrapper">
          <img src="logo.svg" alt="CrewCan Logo" class="logo" />
        </div>
        <h1>{{ t().welcome.title }}</h1>
        <p class="subtitle">{{ t().welcome.subtitle }}</p>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step active"></div>
          <div class="step" [class.active]="canProceed()"></div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="scroll-content">

        <!-- Language Selection Card -->
        <div class="card fade-in">
          <div class="card-header">
            <div class="icon-badge">
              <span class="icon">🌐</span>
            </div>
            <div class="header-text">
              <h2>{{ t().welcome.selectLanguage }}</h2>
              <p class="description">Choose your preferred language</p>
            </div>
          </div>

          <div class="language-grid">
            @for (language of supportedLanguages; track language.code) {
              <button
                class="language-card"
                [class.selected]="currentLanguage().code === language.code"
                (click)="selectLanguage(language.code)"
              >
                <div class="flag">{{ language.flag }}</div>
                <div class="language-name">{{ language.nativeName }}</div>
                @if (currentLanguage().code === language.code) {
                  <div class="check-mark">✓</div>
                }
              </button>
            }
          </div>
        </div>

      </div>

      <!-- Bottom CTA -->
      <div class="bottom-cta">
        <button
          class="continue-button"
          [disabled]="!canProceed()"
          (click)="onGetStarted()"
        >
          <span>{{ t().welcome.getStarted }}</span>
          <span class="button-arrow">→</span>
        </button>

        @if (!canProceed()) {
          <p class="helper-text">
            {{ getCurrentLanguageCode() === 'hi'
              ? 'जारी रखने के लिए भाषा चुनें'
              : 'Select language to continue' }}
          </p>
        }
      </div>

      <!-- Bottom Safe Area -->
      <div class="bottom-safe-area"></div>
    </div>
  `,
  styles: [`
    /* Root Container */
    .welcome-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    }

    /* Safe Areas */
    .status-safe-area {
      height: env(safe-area-inset-top);
      min-height: 20px;
    }

    .bottom-safe-area {
      height: env(safe-area-inset-bottom);
      min-height: 20px;
    }

    /* Header Section */
    .header {
      text-align: center;
      padding: 24px 20px 32px;
      color: white;
    }

    .logo-wrapper {
      margin-bottom: 20px;
    }

    .logo {
      width: 200px;
      height: auto;
      max-height: 80px;
      display: block;
      margin: 0 auto;
      filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.1));
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 24px;
      font-weight: 400;
    }

    /* Progress Steps */
    .progress-steps {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .step {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .step.active {
      background: white;
      transform: scale(1.3);
    }

    /* Scrollable Content */
    .scroll-content {
      flex: 1;
      padding: 0 20px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Cards */
    .card {
      background: white;
      border-radius: 20px;
      margin-bottom: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .fade-in {
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Card Headers */
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .icon-badge {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .icon {
      font-size: 24px;
    }

    .header-text h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 4px;
      color: #1a1a1a;
    }

    .description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    /* Language Selection */
    .language-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .language-card {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      text-align: center;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .language-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      border-color: #667eea;
    }

    .language-card.selected {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .flag {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .language-name {
      font-size: 14px;
      font-weight: 500;
    }

    .check-mark {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #667eea;
      font-weight: bold;
    }


    /* Bottom CTA */
    .bottom-cta {
      padding: 20px;
    }

    .continue-button {
      width: 100%;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 16px;
      padding: 18px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .continue-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .continue-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .button-arrow {
      font-size: 18px;
      transition: transform 0.2s ease;
    }

    .continue-button:hover:not(:disabled) .button-arrow {
      transform: translateX(2px);
    }

    .helper-text {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 0;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .scroll-content {
        padding: 0 16px;
      }

      .card {
        padding: 20px;
        margin-bottom: 16px;
      }

      .header {
        padding: 20px 16px 28px;
      }

      .logo {
        width: 160px;
        max-height: 60px;
      }

      h1 {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }

      .language-grid {
        gap: 8px;
      }

      .language-card {
        padding: 12px;
        min-height: 70px;
      }

      .flag {
        font-size: 20px;
      }

      .language-name {
        font-size: 12px;
      }

      .bottom-cta {
        padding: 16px;
      }
    }
  `]
})
export class WelcomeComponent {
  private languageService = inject(LanguageService);

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

      // Emit event or navigate to main app
      console.log('Welcome completed!');
      console.log('Selected Language:', this.currentLanguage().nativeName);

      // You can emit an event here to parent component or use router
      // For now, we'll just hide the welcome screen
      this.markWelcomeComplete();
    }
  }

  private markWelcomeComplete(): void {
    // This will trigger the parent component to hide welcome screen
    window.dispatchEvent(new CustomEvent('welcome-completed'));
  }
}