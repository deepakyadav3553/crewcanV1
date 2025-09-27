import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['sendOtp', 'clearError']);
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['getTranslations']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate mobile number correctly', () => {
    component.mobileNumber.set('1234567890');
    expect(component.isValidMobile()).toBe(true);

    component.mobileNumber.set('123');
    expect(component.isValidMobile()).toBe(false);
  });

  it('should navigate back on back button click', () => {
    component.onBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should send OTP and navigate to verification', async () => {
    component.mobileNumber.set('1234567890');
    mockAuthService.sendOtp.and.returnValue(Promise.resolve({
      success: true,
      message: 'OTP sent',
      otpSent: true,
      sessionId: 'test-session'
    }));

    await component.onLogin();

    expect(mockAuthService.sendOtp).toHaveBeenCalledWith('1234567890');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/otp-verification'], {
      queryParams: {
        mobile: '1234567890',
        sessionId: 'test-session'
      }
    });
  });
});