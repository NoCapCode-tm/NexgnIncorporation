import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'hi'],
    debug: false,
    
    // THE FIX: Tell the detector to look at the URL path FIRST (e.g., /es/pricing)
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0, // Looks at the first segment of the URL (e.g., domain.com/es/...)
      caches: ['localStorage', 'cookie'], // Remember the user's choice for next time
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;