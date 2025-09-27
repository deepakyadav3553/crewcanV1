import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { LanguageService } from '../../services/language.service';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'setLanguage',
      'getCurrentLanguageCode',
      'getTranslations',
      'currentLanguage'
    ]);

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LanguageService, useValue: languageServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLanguageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when get started is clicked', () => {
    // Mock language selection
    mockLanguageService.currentLanguage.and.returnValue({ code: 'en', nativeName: 'English', flag: '🇺🇸' });

    component.onGetStarted();

    expect(localStorage.getItem('welcome-completed')).toBe('true');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should select language', () => {
    component.selectLanguage('en');
    expect(mockLanguageService.setLanguage).toHaveBeenCalledWith('en');
  });
});