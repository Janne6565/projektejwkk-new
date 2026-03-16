import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Optional

import enCommon from './en/common.ts';
import deCommon from './de/common.ts';
import laCommon from './la/common.ts';
import sgaCommon from './sga/common.ts';

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
