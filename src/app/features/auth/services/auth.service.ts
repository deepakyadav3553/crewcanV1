import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  mobileNumber: string;
  name?: string;
  email?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  otpSent?: boolean;
  sessionId?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  });

  // Public computed properties
  isAuthenticated = computed(() => this.authState().isAuthenticated);
  currentUser = computed(() => this.authState().user);
  isLoading = computed(() => this.authState().isLoading);
  error = computed(() => this.authState().error);

  private currentSessionId: string | null = null;

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (storedUser && token) {
        const user: User = JSON.parse(storedUser);
        this.authState.set({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      this.clearAuth();
    }
  }

  async sendOtp(mobileNumber: string): Promise<LoginResponse> {
    // Validate mobile number
    if (!this.isValidMobileNumber(mobileNumber)) {
      const response: LoginResponse = {
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      };
      this.setError(response.message);
      return response;
    }

    this.setLoading(true);
    this.clearError();

    try {
      // Simulate API call to send OTP
      await this.delay(1500); // Simulate network delay

      // Generate session ID for this login attempt
      this.currentSessionId = this.generateSessionId();

      // Store OTP in localStorage for demo (in real app, this would be handled by backend)
      const otp = this.generateOtp();
      localStorage.setItem(`otp_${this.currentSessionId}`, otp);
      localStorage.setItem(`mobile_${this.currentSessionId}`, mobileNumber);

      console.log(`OTP for ${mobileNumber}: ${otp}`); // For demo purposes

      const response: LoginResponse = {
        success: true,
        message: `OTP sent successfully to ${mobileNumber}`,
        otpSent: true,
        sessionId: this.currentSessionId
      };

      this.setLoading(false);
      return response;

    } catch (error) {
      const response: LoginResponse = {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
      this.setError(response.message);
      this.setLoading(false);
      return response;
    }
  }

  async verifyOtp(otp: string, sessionId?: string): Promise<VerifyOtpResponse> {
    const currentSession = sessionId || this.currentSessionId;

    if (!currentSession) {
      const response: VerifyOtpResponse = {
        success: false,
        message: 'Invalid session. Please request OTP again.'
      };
      this.setError(response.message);
      return response;
    }

    this.setLoading(true);
    this.clearError();

    try {
      // Simulate API call delay
      await this.delay(1000);

      const storedOtp = localStorage.getItem(`otp_${currentSession}`);
      const mobileNumber = localStorage.getItem(`mobile_${currentSession}`);

      if (!storedOtp || !mobileNumber) {
        throw new Error('Session expired');
      }

      if (otp !== storedOtp) {
        const response: VerifyOtpResponse = {
          success: false,
          message: 'Invalid OTP. Please try again.'
        };
        this.setError(response.message);
        this.setLoading(false);
        return response;
      }

      // OTP verified successfully - create user session
      const user: User = {
        id: this.generateUserId(),
        mobileNumber,
        isVerified: true,
        createdAt: new Date()
      };

      const token = this.generateAuthToken();

      // Store auth data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);

      // Clean up OTP data
      localStorage.removeItem(`otp_${currentSession}`);
      localStorage.removeItem(`mobile_${currentSession}`);

      // Update auth state
      this.authState.set({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });

      this.currentSessionId = null;

      const response: VerifyOtpResponse = {
        success: true,
        message: 'Login successful!',
        user,
        token
      };

      this.setLoading(false);
      return response;

    } catch (error) {
      const response: VerifyOtpResponse = {
        success: false,
        message: 'Verification failed. Please try again.'
      };
      this.setError(response.message);
      this.setLoading(false);
      return response;
    }
  }

  async resendOtp(): Promise<LoginResponse> {
    if (!this.currentSessionId) {
      return {
        success: false,
        message: 'No active session. Please start login process again.'
      };
    }

    const mobileNumber = localStorage.getItem(`mobile_${this.currentSessionId}`);
    if (!mobileNumber) {
      return {
        success: false,
        message: 'Session expired. Please start login process again.'
      };
    }

    // Clear existing OTP
    localStorage.removeItem(`otp_${this.currentSessionId}`);

    // Send new OTP
    return this.sendOtp(mobileNumber);
  }

  logout(): void {
    this.clearAuth();
    // Redirect to welcome screen
    window.dispatchEvent(new CustomEvent('user-logout'));
  }

  private clearAuth(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    this.authState.set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
    this.currentSessionId = null;
  }

  private setLoading(loading: boolean): void {
    this.authState.update(state => ({ ...state, isLoading: loading }));
  }

  private setError(error: string): void {
    this.authState.update(state => ({ ...state, error }));
  }

  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }

  private isValidMobileNumber(mobile: string): boolean {
    return /^\d{10}$/.test(mobile);
  }

  private generateOtp(): string {
    // Return fixed OTP for development/testing purposes
    return '222222';
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSessionId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateUserId(): string {
    return 'user_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateAuthToken(): string {
    return 'token_' + Date.now().toString() + Math.random().toString(36).substr(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to check if user is logged in on app start
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Method to get current session ID (useful for OTP verification)
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }
}