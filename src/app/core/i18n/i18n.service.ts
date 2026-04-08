import { Injectable, computed, signal } from '@angular/core';

export type AppLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'mr';

const LANG_KEY = 'krishi_lang';

const DICT: Record<AppLanguage, Record<string, string>> = {
  en: {
    home: 'Home',
    marketplace: 'Marketplace',
    categories: 'Categories',
    aiSearch: 'AI Search',
    login: 'Login',
    register: 'Register',
    installApp: 'Install App',
    heroTitle: 'India\'s multilingual voice commerce platform for farmers',
    heroSub: 'Search by text or voice, discover fresh products, and connect directly with local farmers.',
    startBuying: 'Start buying',
    startSelling: 'Start selling',
  },
  hi: {
    home: 'होम',
    marketplace: 'मार्केटप्लेस',
    categories: 'श्रेणियाँ',
    aiSearch: 'एआई खोज',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    installApp: 'ऐप इंस्टॉल करें',
    heroTitle: 'भारत का बहुभाषी वॉइस कॉमर्स प्लेटफॉर्म किसानों के लिए',
    heroSub: 'टेक्स्ट या वॉइस से खोजें, ताज़ा उत्पाद देखें और किसानों से सीधे जुड़ें।',
    startBuying: 'खरीदना शुरू करें',
    startSelling: 'बेचना शुरू करें',
  },
  ta: { home: 'முகப்பு', marketplace: 'மார்க்கெட்', categories: 'வகைகள்', aiSearch: 'AI தேடல்', login: 'உள்நுழை', register: 'பதிவு', installApp: 'அப் நிறுவு', heroTitle: 'இந்திய விவசாயிகளுக்கான பல்மொழி குரல் வணிகம்', heroSub: 'குரல் அல்லது உரை மூலம் தேடி அருகிலுள்ள பசுமையான பொருட்களை காணுங்கள்.', startBuying: 'வாங்க தொடங்கு', startSelling: 'விற்க தொடங்கு' },
  te: { home: 'హోమ్', marketplace: 'మార్కెట్‌ప్లేస్', categories: 'వర్గాలు', aiSearch: 'AI శోధన', login: 'లాగిన్', register: 'రిజిస్టర్', installApp: 'యాప్ ఇన్స్టాల్', heroTitle: 'భారత రైతుల కోసం బహుభాషా వాయిస్ కామర్స్', heroSub: 'వాయిస్ లేదా టెక్స్ట్ ద్వారా తాజా ఉత్పత్తులు కనుగొనండి.', startBuying: 'కొనుగోలు ప్రారంభించండి', startSelling: 'అమ్మకం ప్రారంభించండి' },
  kn: { home: 'ಮುಖಪುಟ', marketplace: 'ಮಾರುಕಟ್ಟೆ', categories: 'ವರ್ಗಗಳು', aiSearch: 'AI ಹುಡುಕಾಟ', login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ', installApp: 'ಆಪ್ ಸ್ಥಾಪಿಸಿ', heroTitle: 'ಭಾರತದ ಬಹುಭಾಷಾ ವಾಯ್ಸ್ ಕಾಮರ್ಸ್ ರೈತರಿಗೆ', heroSub: 'ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದಿಂದ ಹುಡುಕಿ ಮತ್ತು ಹತ್ತಿರದ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ.', startBuying: 'ಖರೀದಿ ಪ್ರಾರಂಭಿಸಿ', startSelling: 'ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ' },
  ml: { home: 'ഹോം', marketplace: 'മാർക്കറ്റ്', categories: 'വിഭാഗങ്ങൾ', aiSearch: 'AI തിരച്ചിൽ', login: 'ലോഗിൻ', register: 'രജിസ്റ്റർ', installApp: 'ആപ്പ് ഇൻസ്റ്റാൾ', heroTitle: 'ഇന്ത്യൻ കർഷകർക്ക് ബഹുഭാഷാ വോയ്സ് കൊമേഴ്സ്', heroSub: 'വോയ്സ്/ടെക്സ്റ്റ് ഉപയോഗിച്ച് ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തുക.', startBuying: 'വാങ്ങൽ ആരംഭിക്കുക', startSelling: 'വിൽപ്പന ആരംഭിക്കുക' },
  bn: { home: 'হোম', marketplace: 'মার্কেটপ্লেস', categories: 'ক্যাটেগরি', aiSearch: 'এআই সার্চ', login: 'লগইন', register: 'রেজিস্টার', installApp: 'অ্যাপ ইন্সটল', heroTitle: 'ভারতের কৃষকদের জন্য বহুভাষিক ভয়েস কমার্স', heroSub: 'ভয়েস বা টেক্সট দিয়ে পণ্য খুঁজুন।', startBuying: 'কেনা শুরু', startSelling: 'বিক্রি শুরু' },
  mr: { home: 'मुख्यपृष्ठ', marketplace: 'मार्केटप्लेस', categories: 'श्रेणी', aiSearch: 'AI शोध', login: 'लॉगिन', register: 'नोंदणी', installApp: 'अॅप इन्स्टॉल', heroTitle: 'भारतीय शेतकऱ्यांसाठी बहुभाषिक व्हॉइस कॉमर्स', heroSub: 'टेक्स्ट किंवा व्हॉइसने शोधा आणि ताजी उत्पादने मिळवा.', startBuying: 'खरेदी सुरू करा', startSelling: 'विक्री सुरू करा' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageState = signal<AppLanguage>((localStorage.getItem(LANG_KEY) as AppLanguage) || 'en');
  readonly language = this.languageState.asReadonly();
  readonly dictionary = computed(() => DICT[this.languageState()]);

  setLanguage(language: AppLanguage): void {
    this.languageState.set(language);
    localStorage.setItem(LANG_KEY, language);
  }

  t(key: string): string {
    return this.dictionary()[key] ?? key;
  }
}
