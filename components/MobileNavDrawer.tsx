'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Home, Info, ShieldCheck, Wrench, X } from 'lucide-react';
import logoImage from '../img/ReByte navbar logo.png';
import { useLanguage } from '../lib/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import InstallAppButton from './InstallAppButton';

const menuItems = [
  { key: 'home', href: '/', Icon: Home },
  { key: 'tools', href: '/tools', Icon: Wrench },
  { key: 'about', href: '/about', Icon: Info },
  { key: 'privacy', href: '/privacy', Icon: ShieldCheck },
  { key: 'terms', href: '/terms', Icon: FileText },
] as const;

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setMounted(true);
  }, [open]);

  const handleClose = () => {
    onClose();
    setTimeout(() => setMounted(false), 250);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        aria-label="Close navigation menu"
        onClick={handleClose}
      />
      <aside
        className={`relative ml-auto flex h-full max-h-screen min-h-0 w-full max-w-xs flex-col overflow-y-auto overscroll-contain border-l border-slate-200/70 bg-white px-6 py-6 shadow-soft transition-transform duration-300 dark:border-slate-800/70 dark:bg-slate-950 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 items-center justify-center sm:h-10">
              <Image
                src={logoImage}
                alt="ReByte logo"
                width={320}
                height={100}
                sizes="152px"
                className="h-full w-auto max-w-[152px] object-contain sm:max-w-[190px]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-2">
            <InstallAppButton />
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {menuItems.map(({ href, Icon, key }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={handleClose}
                className={`flex items-center gap-3 rounded-3xl border px-4 py-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${
                  isActive
                    ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300'
                    : 'border-transparent text-slate-900 hover:border-slate-200 hover:bg-slate-50 dark:text-white dark:hover:border-slate-800 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} aria-hidden="true" />
                {t(key)}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
