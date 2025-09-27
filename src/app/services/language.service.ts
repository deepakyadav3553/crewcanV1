import { Injectable, signal, LOCALE_ID, inject } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Translations {
  welcome: {
    title: string;
    subtitle: string;
    selectLanguage: string;
    getStarted: string;
  };
  common: {
    continue: string;
    back: string;
    save: string;
    cancel: string;
    ok: string;
    loading: string;
    error: string;
    success: string;
  };
  app: {
    title: string;
    description: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLocale = inject(LOCALE_ID);

  public readonly supportedLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳'
    }
  ];

  private readonly translations: Record<string, Translations> = {
    en: {
      welcome: {
        title: 'Welcome to CrewCan',
        subtitle: 'Set up your preferences to get started',
        selectLanguage: 'Choose Your Language',
        getStarted: 'Get Started'
      },
      common: {
        continue: 'Continue',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        ok: 'OK',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
      },
      app: {
        title: 'CrewCan V1',
        description: 'Angular + Capacitor app with dynamic status bar and UI frameworks ready!'
      }
    },
    hi: {
      welcome: {
        title: 'CrewCan में आपका स्वागत है',
        subtitle: 'शुरू करने के लिए अपनी प्राथमिकताएं सेट करें',
        selectLanguage: 'अपनी भाषा चुनें',
        getStarted: 'शुरू करें'
      },
      common: {
        continue: 'जारी रखें',
        back: 'वापस',
        save: 'सहेजें',
        cancel: 'रद्द करें',
        ok: 'ठीक है',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता'
      },
      app: {
        title: 'CrewCan V1',
        description: 'डायनामिक स्टेटस बार और UI फ्रेमवर्क के साथ Angular + Capacitor ऐप तैयार!'
      }
    }
  };

  // Current language signal
  public currentLanguage = signal<Language>(this.supportedLanguages[0]);

  // Current translations signal
  public currentTranslations = signal<Translations>(this.translations['en']);

  constructor() {
    // Initialize with stored language or default to English
    const storedLang = this.getStoredLanguage();
    if (storedLang) {
      this.setLanguage(storedLang);
    }
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    if (language && this.translations[languageCode]) {
      this.currentLanguage.set(language);
      this.currentTranslations.set(this.translations[languageCode]);
      this.storeLanguage(languageCode);

      // Update document language
      document.documentElement.lang = languageCode;

      console.log(`Language changed to: ${language.nativeName}`);
    }
  }

  /**
   * Get current language code
   */
  getCurrentLanguageCode(): string {
    return this.currentLanguage().code;
  }

  /**
   * Get translation for a specific key path
   */
  getTranslation(keyPath: string): string {
    const keys = keyPath.split('.');
    let value: any = this.currentTranslations();

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        console.warn(`Translation key not found: ${keyPath}`);
        return keyPath;
      }
    }

    return value as string;
  }

  /**
   * Get all translations for current language
   */
  getTranslations(): Translations {
    return this.currentTranslations();
  }

  /**
   * Check if language is RTL
   */
  isRTL(): boolean {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(this.getCurrentLanguageCode());
  }

  /**
   * Store language preference in localStorage
   */
  private storeLanguage(languageCode: string): void {
    try {
      localStorage.setItem('preferred-language', languageCode);
    } catch (error) {
      console.warn('Could not store language preference:', error);
    }
  }

  /**
   * Get stored language preference
   */
  private getStoredLanguage(): string | null {
    try {
      return localStorage.getItem('preferred-language');
    } catch (error) {
      console.warn('Could not retrieve language preference:', error);
      return null;
    }
  }

  /**
   * Format number according to current locale
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.getCurrentLanguageCode()).format(value);
  }

  /**
   * Format date according to current locale
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.getCurrentLanguageCode()).format(date);
  }
}