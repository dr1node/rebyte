import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'ReByte — Free Online Utility Tools',
  description: 'Fast, privacy-friendly online tools for developers, students, and everyone.',
  metadataBase: new URL('https://rebyte.example'),
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
      <body className="min-h-screen bg-transparent text-slate-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
