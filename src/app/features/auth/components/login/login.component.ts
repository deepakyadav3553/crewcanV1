import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { LanguageService } from '../../../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { BubbleBackgroundComponent } from '../../../../shared/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, BubbleBackgroundComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private location = inject(Location);
  authService = inject(AuthService);

  mobileNumber = signal('');
  inputFocused = signal(false);
  isInputInteracted = signal(false);

  isValidMobile = computed(() => {
    return this.mobileNumber().length === 10 && /^\d{10}$/.test(this.mobileNumber());
  });

  hasError = computed(() => {
    return !!this.authService.error();
  });

  onInputChange(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      this.mobileNumber.set(value);
    }

    // Mark as interacted for better UX
    if (!this.isInputInteracted()) {
      this.isInputInteracted.set(true);
    }

    // Clear error when user starts typing
    if (this.hasError()) {
      setTimeout(() => {
        this.authService.clearError();
      }, 100);
    }
  }

  onInputFocus(): void {
    this.inputFocused.set(true);
  }

  onInputBlur(): void {
    this.inputFocused.set(false);
  }

  onBack(): void {
    // Navigate back to welcome screen using Angular Router
    this.location.back();
  }

  async onLogin(): Promise<void> {
    if (!this.isValidMobile()) return;

    const result = await this.authService.sendOtp(this.mobileNumber());

    if (result.success && result.otpSent) {
      // Navigate to OTP verification page
      this.router.navigate(['/otp-verification'], {
        queryParams: {
          mobile: this.mobileNumber(),
          sessionId: result.sessionId
        }
      });
    }
    // Error handling is managed by the auth service
  }
}