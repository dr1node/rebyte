import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageProvider } from '../lib/LanguageContext';
import { Analytics } from '@vercel/analytics/next';
import PwaRegister from '../components/PwaRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://rebyte.my.id'),
  title: {
    default: 'ReByte — Free Online Utility Tools',
    template: '%s | ReByte',
  },
  description:
    'ReByte offers fast, browser-based utility tools for PDF, image, text, developer, and productivity workflows without sign-up or data storage.',
  applicationName: 'ReByte',
  authors: [{ name: 'ReByte' }],
  creator: 'ReByte',
  publisher: 'ReByte',
  keywords: [
    'online tools',
    'free utility tools',
    'pdf tools',
    'image tools',
    'developer tools',
    'text tools',
    'browser utilities',
    'ReByte',
  ],
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ReByte',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    siteName: 'ReByte',
    title: 'ReByte — Free Online Utility Tools',
    description:
      'Fast, private, and browser-first utilities for editing files, text, PDFs, and developer tasks.',
    type: 'website',
    locale: 'en_US',
    url: 'https://rebyte.my.id',
    images: [
      {
        url: '/favicon.png',
        width: 192,
        height: 192,
        alt: 'ReByte free online utility tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rebyte',
    creator: '@rebyte',
    title: 'ReByte — Free Online Utility Tools',
    description:
      'Fast, private, and browser-first utilities for editing files, text, PDFs, and developer tasks.',
    images: ['/favicon.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ReByte',
              url: 'https://rebyte.my.id',
              description: 'Free Online Utility Tools'
            }),
          }}
        />
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
          <PwaRegister />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
