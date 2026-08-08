'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'id';

const LANGUAGE_STORAGE_KEY = 'rebyte-language';

const translations = {
  en: {
    home: 'Home',
    tools: 'Tools',
    about: 'About',
    search: 'Search',
    searchTools: 'Search tools, categories, or descriptions',
    openSearch: 'Open search',
    openMenu: 'Open navigation menu',
    closeSearch: 'Close search',
    noToolsFound: 'No tools found for this search.',
    switchLanguage: 'Switch language',
    english: 'English',
    indonesian: 'Indonesia',
    categories: 'Categories',
    links: 'Links',
    developer: 'Developer',
    visitPortfolio: 'Visit Portfolio',
    privacy: 'Privacy',
    terms: 'Terms',
    language: 'Language',
    freeOnlineTools: 'Free Online Tools',
    heroTitle: 'Fast, privacy-friendly tools for developers, students, and everyone.',
    heroDescription: 'A modern suite of utility tools built for performance, accessibility, and scalability without databases or login.',
    searchResults: 'Search results',
    showingResults: 'Showing results',
    noToolsMatch: 'No tools match your search. Try a different keyword or category.',
    popularTools: 'Popular tools',
    popularToolsTitle: 'Top tools our users rely on',
    viewAllTools: 'View all tools',
    faq: 'FAQ',
    questionsAnswered: 'Questions answered',
    allToolsFreeQuestion: 'Are all tools free to use?',
    allToolsFreeAnswer: 'Yes, all utilities are intended for free use and do not require login.',
    dataStoredQuestion: 'Is my data stored?',
    dataStoredAnswer: 'No, all processing happens in the browser and data is not stored on a server.',
    categorySearchQuestion: 'Can I search tools by category?',
    categorySearchAnswer: 'Yes, search filters by name, category, and description.',
    allCategories: 'All categories',
    openTool: 'Open',
    popular: 'Popular',
    feedback: 'Feedback',
    feedbackTitle: 'Help us make ReByte better',
    feedbackDescription: 'Share a quick rating or tell us what would make these tools more useful for you.',
    feedbackPrivacy: 'Your email is optional. Feedback is handled securely through Google Forms.',
    feedbackFormTitle: 'ReByte feedback form',
    feedbackRating: 'Overall rating',
    feedbackChooseRating: 'Choose a rating from 1 to 5',
    feedbackMessage: 'Your feedback',
    feedbackMessagePlaceholder: 'Tell us what you think or what we could improve...',
    feedbackEmail: 'Email (optional)',
    feedbackEmailPlaceholder: 'you@example.com',
    feedbackSubmit: 'Send feedback',
    feedbackSending: 'Sending...',
    feedbackSuccess: 'Thank you. Your feedback has been sent.',
    feedbackError: 'Please choose a rating and enter your feedback before sending.',
    feedbackOffline: 'Saved offline. It will be sent automatically when you are back online.',
    feedbackOfflineStatus: 'You are offline. Your feedback is queued and will sync once your connection is restored.',
    installApp: 'Install app',
    installAppInstalled: 'Installed',
    installAppIosTitle: 'Install on iPhone/iPad',
    installAppIosText: 'To add ReByte to your home screen, tap Share and choose Add to Home Screen.',
    installAppClose: 'Close install instructions',
  },
  id: {
    home: 'Beranda',
    tools: 'Alat',
    about: 'Tentang',
    search: 'Cari',
    searchTools: 'Cari alat, kategori, atau deskripsi',
    openSearch: 'Buka pencarian',
    openMenu: 'Buka menu navigasi',
    closeSearch: 'Tutup pencarian',
    noToolsFound: 'Tidak ada alat yang ditemukan.',
    switchLanguage: 'Ganti bahasa',
    english: 'English',
    indonesian: 'Indonesia',
    categories: 'Kategori',
    links: 'Tautan',
    developer: 'Pengembang',
    visitPortfolio: 'Kunjungi Portofolio',
    privacy: 'Privasi',
    terms: 'Ketentuan',
    language: 'Bahasa',
    freeOnlineTools: 'Alat Online Gratis',
    heroTitle: 'Alat cepat dan ramah privasi untuk developer, pelajar, dan semua orang.',
    heroDescription: 'Kumpulan alat utilitas modern yang dibuat untuk performa, aksesibilitas, dan skalabilitas tanpa database atau login.',
    searchResults: 'Hasil pencarian',
    showingResults: 'Menampilkan hasil',
    noToolsMatch: 'Tidak ada alat yang cocok. Coba kata kunci atau kategori lain.',
    popularTools: 'Alat populer',
    popularToolsTitle: 'Alat terbaik yang sering digunakan',
    viewAllTools: 'Lihat semua alat',
    faq: 'FAQ',
    questionsAnswered: 'Pertanyaan terjawab',
    allToolsFreeQuestion: 'Apakah semua alat gratis digunakan?',
    allToolsFreeAnswer: 'Ya, semua alat dapat digunakan secara gratis dan tidak memerlukan login.',
    dataStoredQuestion: 'Apakah data saya disimpan?',
    dataStoredAnswer: 'Tidak, semua pemrosesan dilakukan di browser dan data tidak disimpan di server.',
    categorySearchQuestion: 'Apakah saya bisa mencari alat berdasarkan kategori?',
    categorySearchAnswer: 'Ya, pencarian menggunakan nama, kategori, dan deskripsi alat.',
    allCategories: 'Semua kategori',
    openTool: 'Buka',
    popular: 'Populer',
    feedback: 'Masukan',
    feedbackTitle: 'Bantu kami membuat ReByte lebih baik',
    feedbackDescription: 'Berikan rating singkat atau ceritakan apa yang dapat membuat alat-alat ini lebih bermanfaat untuk Anda.',
    feedbackPrivacy: 'Email bersifat opsional. Masukan diproses secara aman melalui Google Forms.',
    feedbackFormTitle: 'Formulir masukan ReByte',
    feedbackRating: 'Rating keseluruhan',
    feedbackChooseRating: 'Pilih rating dari 1 sampai 5',
    feedbackMessage: 'Masukan Anda',
    feedbackMessagePlaceholder: 'Ceritakan pendapat Anda atau apa yang dapat kami tingkatkan...',
    feedbackEmail: 'Email (opsional)',
    feedbackEmailPlaceholder: 'anda@contoh.com',
    feedbackSubmit: 'Kirim masukan',
    feedbackSending: 'Mengirim...',
    feedbackSuccess: 'Terima kasih. Masukan Anda telah terkirim.',
    feedbackError: 'Pilih rating dan isi masukan Anda sebelum mengirim.',
    feedbackOffline: 'Tersimpan offline. Akan dikirim otomatis saat koneksi kembali.',
    feedbackOfflineStatus: 'Anda sedang offline. Masukan Anda disimpan di antrean dan akan dikirim saat koneksi pulih.',
    installApp: 'Pasang aplikasi',
    installAppInstalled: 'Terpasang',
    installAppIosTitle: 'Pasang di iPhone/iPad',
    installAppIosText: 'Untuk menambahkan ReByte ke layar beranda, ketuk ikon Share lalu pilih Add to Home Screen.',
    installAppClose: 'Tutup instruksi pemasangan',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  // eslint-disable-next-line no-unused-vars
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  // eslint-disable-next-line no-unused-vars
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.dataset.language === 'id' ? 'id' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    document.documentElement.dataset.language = nextLanguage;

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (_) {
      // The language remains active for this session when storage is unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'id' ? 'id' : 'en';
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === 'en' ? 'id' : 'en'),
      t: (key) => translations[language][key],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
