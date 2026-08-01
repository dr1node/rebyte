import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageProvider } from '../lib/LanguageContext';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'ReByte — Free Online Utility Tools',
  description: 'Fast, privacy-friendly online tools for developers, students, and everyone.',
  metadataBase: new URL('https://rebyte.example'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'ReByte — Free Online Utility Tools',
    description: 'Fast, privacy-friendly online tools for developers, students, and everyone.',
    type: 'website',
    url: 'https://rebyte.example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReByte — Free Online Utility Tools',
    description: 'Fast, privacy-friendly online tools for developers, students, and everyone.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var storedTheme = localStorage.getItem('rebyte-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = storedTheme === 'dark' || (storedTheme !== 'light' && prefersDark);
                  document.documentElement.classList.toggle('dark', isDark);
                  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                } catch (_) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var storedLanguage = localStorage.getItem('rebyte-language');
                  var language = storedLanguage === 'id' ? 'id' : 'en';
                  document.documentElement.dataset.language = language;
                  document.documentElement.lang = language;
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-transparent text-slate-900 antialiased dark:text-slate-100">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
