import { Injectable, signal } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface LocationOption {
  id: string;
  name: string;
  translations: {
    [key: string]: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public currentLanguage = signal<Language>({
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  });

  private availableLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳'
    },
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳'
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳'
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳'
    }
  ];

  private translations: { [key: string]: { [key: string]: any } } = {
    en: {
      'location.select': 'Select Location',
      'location.current': 'Current Location',
      'location.recent': 'Recent Locations',
      'search.placeholder': 'Search for services, electrician, plumber...',
      'services.cook': 'Hire Professional Cook',
      'services.contacts': 'Viewed Contacts',
      'services.verify': 'Verify My Worker',
      'services.electrician': 'Electrician',
      'services.plumber': 'Plumber',
      'services.cleaner': 'House Cleaning',
      'services.mechanic': 'Mechanic',
      'services.gardener': 'Gardener',
      'job.title': 'I am looking for a job',
      'job.subtitle': 'Find work opportunities',
      'job.button': 'Click Here',
      'partner.title': 'Are you a maid agency? Partner with us',
      'language.change': 'Change Language',
      'notifications.title': 'Notifications',
      'welcome': {
        'title': 'Welcome to CrewCan',
        'subtitle': 'Find the right professionals for any job',
        'description': 'Connect with skilled workers in your area for all your service needs',
        'selectUserType': 'I am a...',
        'userTypeHint': 'Choose your role to get started',
        'employee': 'Service Provider',
        'employer': 'Service Seeker',
        'selectLanguage': 'Select Language',
        'languageHint': 'Choose your preferred language',
        'getStarted': 'Get Started'
      }
    },
    hi: {
      'location.select': 'स्थान चुनें',
      'location.current': 'वर्तमान स्थान',
      'location.recent': 'हाल के स्थान',
      'search.placeholder': 'सेवाओं की खोज करें, इलेक्ट्रीशियन, प्लंबर...',
      'services.cook': 'पेशेवर रसोइया किराए पर लें',
      'services.contacts': 'देखे गए संपर्क',
      'services.verify': 'मेरे कार्यकर्ता को सत्यापित करें',
      'services.electrician': 'इलेक्ट्रीशियन',
      'services.plumber': 'प्लंबर',
      'services.cleaner': 'घर की सफाई',
      'services.mechanic': 'मैकेनिक',
      'services.gardener': 'माली',
      'job.title': 'मुझे नौकरी चाहिए',
      'job.subtitle': 'काम के अवसर खोजें',
      'job.button': 'यहाँ क्लिक करें',
      'partner.title': 'क्या आप मेड एजेंसी हैं? हमारे साथ साझेदारी करें',
      'language.change': 'भाषा बदलें',
      'notifications.title': 'सूचनाएं',
      'welcome': {
        'title': 'CrewCan में आपका स्वागत है',
        'subtitle': 'किसी भी काम के लिए सही पेशेवर खोजें',
        'description': 'अपनी सभी सेवा आवश्यकताओं के लिए अपने क्षेत्र के कुशल कामगारों से जुड़ें',
        'selectUserType': 'मैं हूँ...',
        'userTypeHint': 'शुरू करने के लिए अपनी भूमिका चुनें',
        'employee': 'सेवा प्रदाता',
        'employer': 'सेवा साधक',
        'selectLanguage': 'भाषा चुनें',
        'languageHint': 'अपनी पसंदीदा भाषा चुनें',
        'getStarted': 'शुरू करें'
      }
    },
    kn: {
      'location.select': 'ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'location.current': 'ಪ್ರಸ್ತುತ ಸ್ಥಳ',
      'location.recent': 'ಇತ್ತೀಚಿನ ಸ್ಥಳಗಳು',
      'search.placeholder': 'ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ, ಎಲೆಕ್ಟ್ರೀಷಿಯನ್, ಪ್ಲಂಬರ್...',
      'services.cook': 'ವೃತ್ತಿಪರ ಅಡುಗೆಯವರನ್ನು ನೇಮಿಸಿ',
      'services.contacts': 'ನೋಡಿದ ಸಂಪರ್ಕಗಳು',
      'services.verify': 'ನನ್ನ ಕೆಲಸಗಾರನನ್ನು ಪರಿಶೀಲಿಸಿ',
      'services.electrician': 'ಎಲೆಕ್ಟ್ರೀಷಿಯನ್',
      'services.plumber': 'ಪ್ಲಂಬರ್',
      'services.cleaner': 'ಮನೆ ಶುಚಿಗೊಳಿಸುವಿಕೆ',
      'services.mechanic': 'ಮೆಕ್ಯಾನಿಕ್',
      'services.gardener': 'ತೋಟಗಾರ',
      'job.title': 'ನನಗೆ ಕೆಲಸ ಬೇಕು',
      'job.subtitle': 'ಕೆಲಸದ ಅವಕಾಶಗಳನ್ನು ಹುಡುಕಿ',
      'job.button': 'ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ',
      'partner.title': 'ನೀವು ಮೇಡ್ ಏಜೆನ್ಸಿಯೇ? ನಮ್ಮೊಂದಿಗೆ ಪಾಲುದಾರರಾಗಿ',
      'language.change': 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
      'notifications.title': 'ಅಧಿಸೂಚನೆಗಳು',
      'welcome': {
        'title': 'CrewCan ಗೆ ಸ್ವಾಗತ',
        'subtitle': 'ಯಾವುದೇ ಕೆಲಸಕ್ಕೆ ಸರಿಯಾದ ವೃತ್ತಿಪರರನ್ನು ಹುಡುಕಿ',
        'description': 'ನಿಮ್ಮ ಎಲ್ಲಾ ಸೇವಾ ಅಗತ್ಯಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರದೇಶದ ನುರಿತ ಕಾರ್ಮಿಕರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ',
        'selectUserType': 'ನಾನು...',
        'userTypeHint': 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆರಿಸಿ',
        'employee': 'ಸೇವಾ ಪೂರೈಕೆದಾರ',
        'employer': 'ಸೇವಾ ಅನ್ವೇಷಕ',
        'selectLanguage': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        'languageHint': 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
        'getStarted': 'ಪ್ರಾರಂಭಿಸಿ'
      }
    },
    te: {
      'location.select': 'స్థానాన్ని ఎంచుకోండి',
      'location.current': 'ప్రస్తుత స్థానం',
      'location.recent': 'ఇటీవలి స్థానాలు',
      'search.placeholder': 'సేవలను వెతకండి, ఎలక్ట్రీషియన్, ప్లంబర్...',
      'services.cook': 'వృత్తిపరమైన వంటవాడిని నియమించండి',
      'services.contacts': 'చూసిన పరిచయాలు',
      'services.verify': 'నా కార్మికుడిని ధృవీకరించండి',
      'services.electrician': 'ఎలక్ట్రీషియన్',
      'services.plumber': 'ప్లంబర్',
      'services.cleaner': 'ఇంటి శుభ్రత',
      'services.mechanic': 'మెకానిక్',
      'services.gardener': 'తోటమాలి',
      'job.title': 'నాకు ఉద్యోగం కావాలి',
      'job.subtitle': 'పని అవకాశాలను కనుగొనండి',
      'job.button': 'ఇక్కడ క్లిక్ చేయండి',
      'partner.title': 'మీరు మెయిడ్ ఏజెన్సీ ఉన్నారా? మాతో భాగస్వామ్యం చేయండి',
      'language.change': 'భాష మార్చండి',
      'notifications.title': 'నోటిఫికేషన్లు',
      'welcome': {
        'title': 'CrewCan కు స్వాగతం',
        'subtitle': 'ఏదైనా పని కోసం సరైన నిపుణులను కనుగొనండి',
        'description': 'మీ అన్ని సేవా అవసరాలకు మీ ప్రాంతంలోని నైపుణ్యం గల కార్మికులతో కనెక్ట్ అవ్వండి',
        'selectUserType': 'నేను...',
        'userTypeHint': 'ప్రారంభించడానికి మీ పాత్రను ఎంచుకోండి',
        'employee': 'సేవా ప్రదాత',
        'employer': 'సేవా అన్వేషకుడు',
        'selectLanguage': 'భాషను ఎంచుకోండి',
        'languageHint': 'మీ ఇష్టమైన భాషను ఎంచుకోండి',
        'getStarted': 'ప్రారంభించండి'
      }
    },
    ta: {
      'location.select': 'இடத்தைத் தேர்ந்தெடுக்கவும்',
      'location.current': 'தற்போதைய இடம்',
      'location.recent': 'சமீபத்திய இடங்கள்',
      'search.placeholder': 'சேவைகளைத் தேடுங்கள், மின்சாரம், குழாய்...',
      'services.cook': 'தொழில்முறை சமையல்காரரை வேலைக்கு அமர்த்துங்கள்',
      'services.contacts': 'பார்த்த தொடர்புகள்',
      'services.verify': 'எனது தொழிலாளியைச் சரிபார்க்கவும்',
      'services.electrician': 'மின்சாரம்',
      'services.plumber': 'குழாய்',
      'services.cleaner': 'வீட்டு சுத்தம்',
      'services.mechanic': 'மெக்கானிக்',
      'services.gardener': 'தோட்டக்காரர்',
      'job.title': 'எனக்கு வேலை வேண்டும்',
      'job.subtitle': 'வேலை வாய்ப்புகளைக் கண்டறியுங்கள்',
      'job.button': 'இங்கே கிளிக் செய்யுங்கள்',
      'partner.title': 'நீங்கள் பணிப்பெண் ஏஜென்சியா? எங்களுடன் கூட்டு சேருங்கள்',
      'language.change': 'மொழியை மாற்றவும்',
      'notifications.title': 'அறிவிப்புகள்',
      'welcome': {
        'title': 'CrewCan இல் உங்களை வரவேற்கிறோம்',
        'subtitle': 'எந்த வேலைக்கும் சரியான நிபுணர்களைக் கண்டறியுங்கள்',
        'description': 'உங்கள் அனைத்து சேவை தேவைகளுக்கும் உங்கள் பகுதியில் உள்ள திறமையான தொழிலாளர்களுடன் இணைகிறது',
        'selectUserType': 'நான்...',
        'userTypeHint': 'தொடங்க உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்',
        'employee': 'சேவை வழங்குநர்',
        'employer': 'சேவை தேடுபவர்',
        'selectLanguage': 'மொழியைத் தேர்ந்தெடுக்கவும்',
        'languageHint': 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
        'getStarted': 'தொடங்குங்கள்'
      }
    }
  };

  private popularLocations: LocationOption[] = [
    {
      id: 'downtown',
      name: 'Downtown',
      translations: {
        en: 'Downtown City Center',
        hi: 'शहर केंद्र',
        kn: 'ನಗರ ಕೇಂದ್ರ',
        te: 'నగర కేంద్రం',
        ta: 'நகர மையம்'
      },
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 'koramangala',
      name: 'Koramangala',
      translations: {
        en: 'Koramangala',
        hi: 'कोरमंगला',
        kn: 'ಕೋರಮಂಗಲ',
        te: 'కోరమంగల',
        ta: 'கோரமங்கல'
      },
      coordinates: { lat: 12.9279, lng: 77.6271 }
    },
    {
      id: 'indiranagar',
      name: 'Indiranagar',
      translations: {
        en: 'Indiranagar',
        hi: 'इंदिरानगर',
        kn: 'ಇಂದಿರಾನಗರ',
        te: 'ఇందిరానగర్',
        ta: 'இந்திரானகர்'
      },
      coordinates: { lat: 12.9784, lng: 77.6408 }
    },
    {
      id: 'whitefield',
      name: 'Whitefield',
      translations: {
        en: 'Whitefield',
        hi: 'व्हाइटफील्ड',
        kn: 'ವೈಟ್‌ಫೀಲ್ಡ್',
        te: 'వైట్‌ఫీల్డ్',
        ta: 'வைட்ஃபீல்ட்'
      },
      coordinates: { lat: 12.9698, lng: 77.7500 }
    }
  ];

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return this.availableLanguages;
  }

  getPopularLocations() {
    return this.popularLocations;
  }

  setLanguage(languageCode: string) {
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage.set(language);
      localStorage.setItem('selectedLanguage', languageCode);
    }
  }

  translate(key: string): string {
    const currentLang = this.currentLanguage().code;
    return this.translations[currentLang]?.[key] || key;
  }

  getLocationName(location: LocationOption): string {
    const currentLang = this.currentLanguage().code;
    return location.translations[currentLang] || location.name;
  }

  initializeLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  // Additional methods needed by welcome component
  getTranslations() {
    const currentLang = this.currentLanguage().code;
    return this.translations[currentLang] || {};
  }

  get supportedLanguages() {
    return this.availableLanguages;
  }

  getCurrentLanguageCode(): string {
    return this.currentLanguage().code;
  }
}