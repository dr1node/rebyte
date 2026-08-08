'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function InstallAppButton() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowButton(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already installed, hide it
    window.addEventListener('appinstalled', () => {
      setShowButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert(language === 'id' ? "Untuk menginstal di iPhone/iPad, tekan tombol Share (Bagikan) lalu pilih 'Add to Home Screen' (Tambahkan ke Layar Utama)." : "To install on iPhone/iPad, tap the Share button and select 'Add to Home Screen'.");
      return;
    }

    if (!deferredPrompt) {
      alert(language === 'id' ? 'Instalasi otomatis tidak didukung di browser ini. Silakan gunakan fitur Add to Home Screen dari menu browser.' : 'Automatic installation is not supported in this browser. Please use the Add to Home Screen feature from the browser menu.');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowButton(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('PWA prompt error:', err);
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-medium text-sky-600 transition hover:bg-sky-100 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-sky-900/50 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20 dark:focus-visible:ring-offset-slate-950"
      aria-label="Install App"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === 'id' ? 'Install App' : 'Install App'}
      </span>
    </button>
  );
}
