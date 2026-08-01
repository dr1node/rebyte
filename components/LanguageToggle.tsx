'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();
  const nextLanguage = language === 'en' ? t('indonesian') : t('english');

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`${t('switchLanguage')}: ${nextLanguage}`}
      title={`${t('switchLanguage')}: ${nextLanguage}`}
      className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-slate-800 dark:hover:text-sky-300 dark:focus-visible:ring-offset-slate-950"
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'ID'}</span>
      <span className="sr-only">{nextLanguage}</span>
    </button>
  );
}
