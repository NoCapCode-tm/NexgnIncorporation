import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Load translations using http (fetches from public/locales)
  .use(HttpBackend)
  // Detect user language automatically from browser settings
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // If a translation is missing, use English
    supportedLngs: ['en', 'es', 'hi'],
    debug: false, // Set to true if you need to debug translation loading
    
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
    
    backend: {
      // The path where your JSON files are stored
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;