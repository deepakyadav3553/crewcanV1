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
        <div class="logo-wrapper animate-slide-up">
          <img src="logo.svg" alt="CrewCan Logo" class="logo" />
        </div>
        <h1 class="animate-slide-up delay-200">{{ t().welcome.title }}</h1>
        <p class="subtitle animate-slide-up delay-400">{{ t().welcome.subtitle }}</p>

        <!-- Enhanced Progress Steps -->
        <div class="progress-container animate-slide-up delay-600">
          <div class="progress-steps">
            <div class="step active">
              <span class="step-number">1</span>
            </div>
            <div class="progress-line" [class.active]="canProceed()"></div>
            <div class="step" [class.active]="canProceed()">
              <span class="step-number">2</span>
            </div>
          </div>
          <div class="progress-labels">
            <span class="label active">Language</span>
            <span class="label" [class.active]="canProceed()">Ready</span>
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="scroll-content">

        <!-- Enhanced Language Selection Card -->
        <div class="card fade-in-up animate-delay-800">
          <div class="card-header">
            <div class="icon-badge pulse">
              <span class="icon">🌐</span>
            </div>
            <div class="header-text">
              <h2>{{ t().welcome.selectLanguage }}</h2>
              <p class="description">Choose your preferred language to personalize your experience</p>
            </div>
          </div>

          <div class="language-grid">
            @for (language of supportedLanguages; track language.code; let i = $index) {
              <button
                class="language-card hover-lift"
                [class.selected]="currentLanguage().code === language.code"
                [style.animation-delay]="(i * 100) + 'ms'"
                (click)="selectLanguage(language.code)"
              >
                <div class="card-background"></div>
                <div class="flag animate-bounce-in">{{ language.flag }}</div>
                <div class="language-name">{{ language.nativeName }}</div>
                @if (currentLanguage().code === language.code) {
                  <div class="check-mark animate-scale-in">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                }
                <div class="selection-ripple"></div>
              </button>
            }
          </div>
        </div>

      </div>

      <!-- Bottom CTA -->
      <div class="bottom-cta">
        <button
          class="continue-button enhanced-button"
          [disabled]="!canProceed()"
          [class.ready]="canProceed()"
          (click)="onGetStarted()"
        >
          <div class="button-content">
            <span class="button-text">{{ t().welcome.getStarted }}</span>
            <span class="button-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </span>
          </div>
          <div class="button-shimmer"></div>
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
      padding: 32px 20px 40px;
      color: #1e293b;
      position: relative;
      z-index: 1;
    }

    .logo-wrapper {
      margin-bottom: 20px;
    }

    .logo {
      width: 220px;
      height: auto;
      max-height: 90px;
      display: block;
      margin: 0 auto;
      filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.2));
      transition: transform 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      margin: 24px 0 12px;
      letter-spacing: -0.8px;
      background: linear-gradient(45deg, #1e293b, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 18px;
      opacity: 0.8;
      margin: 0 0 32px;
      font-weight: 500;
      letter-spacing: 0.2px;
      line-height: 1.4;
      color: #64748b;
    }

    /* Enhanced Progress Steps */
    .progress-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .progress-steps {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .step {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.1);
      border: 2px solid rgba(59, 130, 246, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .step.active {
      background: #3b82f6;
      border-color: #3b82f6;
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }

    .step-number {
      font-size: 14px;
      font-weight: 700;
      color: #64748b;
    }

    .step.active .step-number {
      color: white;
    }

    .progress-line {
      width: 60px;
      height: 3px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 2px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .progress-line.active {
      background: #3b82f6;
    }

    .progress-line.active::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 1.5s ease-in-out;
    }

    @keyframes shimmer {
      to { left: 100%; }
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      width: 140px;
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      opacity: 0.9;
    }

    .label.active {
      color: #3b82f6;
      opacity: 1;
      font-weight: 600;
    }

    /* Scrollable Content */
    .scroll-content {
      flex: 1;
      padding: 0 20px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      position: relative;
      z-index: 1;
    }

    /* Enhanced Cards */
    .card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      margin-bottom: 24px;
      padding: 28px;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.12);
    }

    /* Modern Animations */
    .fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
    }

    .animate-slide-up {
      animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
    }

    .animate-delay-800 { animation-delay: 0.8s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-600 { animation-delay: 0.6s; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-bounce-in {
      animation: bounceIn 0.6s ease;
    }

    @keyframes bounceIn {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }

    .animate-scale-in {
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Card Headers */
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .icon-badge {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }

    .icon-badge.pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .icon {
      font-size: 28px;
    }

    .header-text h2 {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 6px;
      color: #1a1a1a;
      letter-spacing: -0.3px;
    }

    .description {
      font-size: 15px;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }

    /* Enhanced Language Selection */
    .language-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .language-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      text-align: center;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05);
    }

    .language-card .card-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .language-card.hover-lift:hover .card-background {
      opacity: 1;
    }

    .language-card.hover-lift:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
    }

    .language-card.selected {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-color: #3b82f6;
      color: white;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    }

    .language-card.selected .card-background {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      opacity: 1;
    }

    .flag {
      font-size: 28px;
      margin-bottom: 10px;
      transition: transform 0.3s ease;
    }

    .language-card:hover .flag {
      transform: scale(1.1);
    }

    .language-name {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      position: relative;
      z-index: 1;
      color: #334155;
    }

    .language-card.selected .language-name {
      color: white;
    }

    .check-mark {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
      z-index: 2;
    }

    .check-mark svg {
      width: 14px;
      height: 14px;
      stroke-width: 3;
    }

    .selection-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.4s ease;
    }

    .language-card.selected .selection-ripple {
      width: 100px;
      height: 100px;
      opacity: 0;
    }


    /* Enhanced Bottom CTA */
    .bottom-cta {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    .continue-button {
      width: 100%;
      background: white;
      color: #3b82f6;
      border: none;
      border-radius: 20px;
      padding: 20px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }

    .continue-button.enhanced-button:hover .button-content {
      transform: translateX(4px);
    }

    .button-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .continue-button.ready:hover .button-shimmer {
      left: 100%;
    }

    .continue-button.enhanced-button:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(59, 130, 246, 0.25);
      background: linear-gradient(135deg, #ffffff, #f8fafc);
    }

    .continue-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      filter: grayscale(0.3);
    }

    .continue-button:disabled .button-content {
      transform: none;
    }

    .button-arrow {
      display: flex;
      align-items: center;
      transition: transform 0.3s ease;
    }

    .button-arrow svg {
      width: 20px;
      height: 20px;
      stroke-width: 2.5;
    }

    .continue-button.enhanced-button:hover:not(:disabled) .button-arrow {
      transform: translateX(3px);
    }

    .button-text {
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .helper-text {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 0;
    }

    /* Enhanced Mobile Responsive */
    @media (max-width: 480px) {
      .scroll-content {
        padding: 0 16px;
      }

      .card {
        padding: 24px;
        margin-bottom: 20px;
        border-radius: 20px;
      }

      .header {
        padding: 24px 16px 32px;
      }

      .logo {
        width: 180px;
        max-height: 70px;
      }

      h1 {
        font-size: 28px;
        margin: 20px 0 10px;
      }

      .subtitle {
        font-size: 16px;
        margin-bottom: 28px;
      }

      .progress-container {
        gap: 10px;
      }

      .step {
        width: 36px;
        height: 36px;
      }

      .step-number {
        font-size: 13px;
      }

      .progress-line {
        width: 50px;
      }

      .progress-labels {
        width: 120px;
        font-size: 11px;
      }

      .language-grid {
        gap: 12px;
      }

      .language-card {
        padding: 16px;
        min-height: 80px;
        border-radius: 16px;
      }

      .flag {
        font-size: 24px;
      }

      .language-name {
        font-size: 14px;
      }

      .check-mark {
        width: 22px;
        height: 22px;
        top: 8px;
        right: 8px;
      }

      .check-mark svg {
        width: 12px;
        height: 12px;
      }

      .bottom-cta {
        padding: 20px 16px;
      }

      .continue-button {
        padding: 18px;
        border-radius: 18px;
      }

      .icon-badge {
        width: 52px;
        height: 52px;
        margin-right: 16px;
      }

      .icon {
        font-size: 26px;
      }

      .header-text h2 {
        font-size: 20px;
      }

      .description {
        font-size: 14px;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .welcome-container {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
      }

      .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .header-text h2 {
        color: white;
      }

      .description {
        color: rgba(255, 255, 255, 0.8);
      }

      .language-card {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .language-card:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(102, 126, 234, 0.6);
      }

      .continue-button {
        background: rgba(255, 255, 255, 0.9);
        color: #1e1b4b;
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