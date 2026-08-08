'use client';

import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function InstallAppButton() {
  const { language, t } = useLanguage();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [supportsInstall, setSupportsInstall] = useState(false);

  useEffect(() => {
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const secureContext = window.isSecureContext || window.location.hostname === 'localhost';
    const installCapableBrowser = /Chrome|Chromium|CriOS|Edg|OPR|SamsungBrowser/.test(navigator.userAgent) || /Android/.test(navigator.userAgent);

    setIsIOS(iosDevice);
    setIsStandalone(standalone);
    setSupportsInstall(secureContext && (installCapableBrowser || iosDevice));

    const onBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent;

      if (typeof installEvent?.prompt !== 'function') {
        return;
      }

      event.preventDefault();
      setInstallPrompt(installEvent);
      setSupportsInstall(true);
      setShowIOSInstructions(false);
    };

    const onAppInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
      setSupportsInstall(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt && typeof installPrompt.prompt === 'function') {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallPrompt(null);
          setIsStandalone(true);
          setSupportsInstall(false);
        } else {
          setInstallPrompt(null);
        }
      } catch {
        setInstallPrompt(null);
      }
      return;
    }

    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
  };

  const buttonLabel = isStandalone ? t('installAppInstalled') : t('installApp');

  if (isStandalone) {
    return null;
  }

  if (!supportsInstall && !isIOS && !installPrompt) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-sky-900/80 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus-visible:ring-offset-slate-950"
        aria-label={buttonLabel}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{buttonLabel}</span>
      </button>

      {showIOSInstructions && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">{language === 'id' ? 'iOS' : 'iOS'}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{t('installAppIosTitle')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSInstructions(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={t('installAppClose')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li>1. {language === 'id' ? 'Buka halaman ini di Safari.' : 'Open this page in Safari.'}</li>
              <li>2. {language === 'id' ? 'Ketuk ikon Share.' : 'Tap the Share icon.'}</li>
              <li>3. {language === 'id' ? 'Pilih Add to Home Screen.' : 'Choose Add to Home Screen.'}</li>
            </ol>

            <p className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300">
              {t('installAppIosText')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
