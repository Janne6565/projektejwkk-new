import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Optional

import enCommon from './en/common';
import deCommon from './de/common';
import laCommon from './la/common';
import sgaCommon from './sga/common';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { common: enCommon },
      de: { common: deCommon },
      la: { common: laCommon },
      sga: { common: sgaCommon },
    },
    supportedLngs: ['en', 'de', 'la', 'sga'],
    // Pin the initial language so the first client render is deterministically
    // English, matching the server-rendered HTML (avoids hydration mismatch).
    // Detection runs post-hydration in providers.tsx. LanguageDetector stays
    // registered so changeLanguage still caches the choice to localStorage.
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'], // Default namespace
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next;
