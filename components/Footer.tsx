'use client';

import Link from 'next/link';
import { categories } from '../lib/tools';
import { useLanguage } from '../lib/LanguageContext';
import LocalizedText from './LocalizedText';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const portfolioUrl = 'https://rex.is-a.dev/';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-10 shadow-[0_-10px_35px_-28px_rgba(15,23,42,0.16)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">ReByte</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            <LocalizedText en="A modern collection of free utilities for developers, students, and creators." id="Kumpulan utilitas modern dan gratis untuk developer, pelajar, dan kreator." />
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">{t('categories')}</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {categories.map((category) => (
              <Link key={category.key} href={`/tools?category=${category.key}`} className="block transition hover:text-sky-600 dark:hover:text-white">
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">{t('links')}</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/#feedback" className="block transition hover:text-sky-600 dark:hover:text-white">
              {t('feedback')}
            </Link>
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-block transition hover:text-sky-600 dark:hover:text-white">
                {link.label === 'Privacy' ? t('privacy') : link.label === 'Terms' ? t('terms') : t('about')}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">{t('developer')}</p>
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              <LocalizedText en="ReByte is independently designed and developed by Regi." id="ReByte dirancang dan dikembangkan secara mandiri oleh Regi." />
            </p>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {t('visitPortfolio')}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} ReByte. <LocalizedText en="Built for fast and privacy-friendly utility experiences." id="Dibuat untuk pengalaman utilitas yang cepat dan ramah privasi." />
      </div>
    </footer>
  );
}
