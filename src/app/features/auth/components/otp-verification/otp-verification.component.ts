import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  authService = inject(AuthService);

  mobileNumber = signal('');
  sessionId = signal('');
  otpDigits = signal(['', '', '', '', '', '']);
  timer = signal(60); // 60 seconds countdown
  private timerInterval: any;

  isOtpComplete = computed(() =>
    this.otpDigits().every(digit => digit !== '')
  );

  hasError = computed(() =>
    !!this.authService.error()
  );

  ngOnInit(): void {
    // Get mobile number and session ID from query params
    this.route.queryParams.subscribe(params => {
      this.mobileNumber.set(params['mobile'] || '');
      this.sessionId.set(params['sessionId'] || '');
    });

    this.startTimer();
    // Auto-focus first input
    setTimeout(() => {
      const firstInput = document.querySelector('.otp-digit') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onDigitInput(event: any, index: number): void {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits

    if (value.length > 1) {
      // Handle paste or multiple characters
      this.handleMultipleDigits(value, index);
      return;
    }

    // Update the current digit
    const newDigits = [...this.otpDigits()];
    newDigits[index] = value;
    this.otpDigits.set(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelectorAll('.otp-digit')[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Clear error when user starts typing
    if (this.hasError()) {
      // Clear error after a short delay
      setTimeout(() => {
        this.authService.clearError();
      }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      const prevInput = document.querySelectorAll('.otp-digit')[index - 1] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newDigits = [...this.otpDigits()];
        newDigits[index - 1] = '';
        this.otpDigits.set(newDigits);
      }
    }

    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelectorAll('.otp-digit')[index - 1] as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelectorAll('.otp-digit')[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '') || '';

    if (pastedData.length === 6) {
      const newDigits = pastedData.split('').slice(0, 6);
      this.otpDigits.set(newDigits);

      // Focus last input
      const lastInput = document.querySelectorAll('.otp-digit')[5] as HTMLInputElement;
      if (lastInput) lastInput.focus();
    }
  }

  private handleMultipleDigits(value: string, startIndex: number): void {
    const digits = value.split('').slice(0, 6 - startIndex);
    const newDigits = [...this.otpDigits()];

    digits.forEach((digit, i) => {
      if (startIndex + i < 6) {
        newDigits[startIndex + i] = digit;
      }
    });

    this.otpDigits.set(newDigits);

    // Focus next available input or last input
    const nextIndex = Math.min(startIndex + digits.length, 5);
    const nextInput = document.querySelectorAll('.otp-digit')[nextIndex] as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }

  private startTimer(): void {
    this.timer.set(60);
    this.timerInterval = setInterval(() => {
      const currentTime = this.timer();
      if (currentTime > 0) {
        this.timer.set(currentTime - 1);
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async onResendOtp(): Promise<void> {
    const result = await this.authService.resendOtp();
    if (result.success) {
      this.startTimer();
      // Clear current OTP
      this.otpDigits.set(['', '', '', '', '', '']);
      // Focus first input
      const firstInput = document.querySelector('.otp-digit') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }
  }

  async onVerifyOtp(): Promise<void> {
    if (!this.isOtpComplete()) return;

    const otp = this.otpDigits().join('');
    const result = await this.authService.verifyOtp(otp, this.sessionId());

    if (result.success) {
      // Navigate to home/dashboard
      this.router.navigate(['/home']);
    } else {
      // Clear OTP on error
      this.otpDigits.set(['', '', '', '', '', '']);
      // Focus first input
      const firstInput = document.querySelector('.otp-digit') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }
  }

  onBack(): void {
    // Navigate back to login screen
    this.location.back();
  }
}