'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { queueRequest, syncQueuedRequests } from '../lib/offlineQueue';

async function sendPageView(pathname: string) {
  const payload = {
    type: 'page_view',
    url: pathname,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };

  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Analytics request failed.');
    }
  } catch {
    await queueRequest('analytics', payload);
  }
}

export default function PwaRegister() {
  const pathname = usePathname();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => console.warn('PWA service worker registration failed:', error));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      void syncQueuedRequests();
    };

    window.addEventListener('online', handleOnline);
    void syncQueuedRequests();

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    void sendPageView(pathname);
  }, [pathname]);

  return null;
}
