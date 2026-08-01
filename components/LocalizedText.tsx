'use client';

import { useLanguage } from '../lib/LanguageContext';

export default function LocalizedText({ en, id }: { en: string; id: string }) {
  const { language } = useLanguage();
  return <>{language === 'id' ? id : en}</>;
}
