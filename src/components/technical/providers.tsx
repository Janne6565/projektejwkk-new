'use client';

import { useEffect, type ReactNode } from 'react';
import i18next from 'i18next';
import '@/i18n';
import { ModalProvider } from '@/components/technical/modal-provider';

const Providers = ({ children }: { children: ReactNode }) => {
  // Server HTML renders in English (i18n init pins `lng: 'en'`), so first
  // client render matches. After hydration, apply the detected language.
  useEffect(() => {
    const detected = i18next.services.languageDetector?.detect();
    const lng = Array.isArray(detected) ? detected[0] : detected;
    if (lng && lng !== i18next.language) {
      void i18next.changeLanguage(lng);
    }
  }, []);

  return <ModalProvider>{children}</ModalProvider>;
};

export default Providers;
