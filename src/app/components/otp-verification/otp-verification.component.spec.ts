import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { OtpVerificationComponent } from './otp-verification.component';
import { AuthService } from '../../services/auth.service';

describe('OtpVerificationComponent', () => {
  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyOtp', 'resendOtp', 'clearError']);
    mockActivatedRoute = {
      queryParams: of({ mobile: '1234567890', sessionId: 'test-session' })
    };

    await TestBed.configureTestingModule({
      imports: [OtpVerificationComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set mobile number and session ID from query params', () => {
    component.ngOnInit();
    expect(component.mobileNumber()).toBe('1234567890');
    expect(component.sessionId()).toBe('test-session');
  });

  it('should verify OTP and navigate to home on success', async () => {
    component.otpDigits.set(['1', '2', '3', '4', '5', '6']);
    mockAuthService.verifyOtp.and.returnValue(Promise.resolve({
      success: true,
      message: 'Verification successful'
    }));

    await component.onVerifyOtp();

    expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('123456', 'test-session');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate back on back button click', () => {
    component.onBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should format timer correctly', () => {
    expect(component.formatTime(90)).toBe('1:30');
    expect(component.formatTime(5)).toBe('0:05');
  });
});