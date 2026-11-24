'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export default function PingTestTool() {
  const [target, setTarget] = useState('https://example.com');
  const [status, setStatus] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const copy = language === 'id'
    ? {
        label: 'Target URL',
        placeholder: 'Masukkan domain atau URL, misalnya google.com',
        button: 'Periksa latensi',
        loading: 'Memeriksa...',
        status: 'Status',
        latency: 'Latensi',
        resolved: 'Alamat server',
        method: 'Metode',
        invalid: 'Masukkan domain atau URL yang valid.',
      }
    : {
        label: 'Target URL',
        placeholder: 'Enter a domain or URL, for example google.com',
        button: 'Check latency',
        loading: 'Checking...',
        status: 'Status',
        latency: 'Latency',
        resolved: 'Server address',
        method: 'Method',
        invalid: 'Enter a valid domain or URL.',
      };

  const handlePing = async () => {
    setStatus('');
    setTime('');
    setError('');
    if (!target.trim()) {
      setError(copy.invalid);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`/api/ping?url=${encodeURIComponent(target.trim())}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || copy.invalid);
      }

      setStatus(`${copy.status}: ${result.status}${result.statusText ? ` ${result.statusText}` : ''}`);
      setTime(
        `${copy.latency}: ${result.latency} ms\n${copy.resolved}: ${result.resolvedAddress}\n${copy.method}: ${result.method}`,
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.invalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{copy.label}</span>
        <input
          type="text"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void handlePing();
          }}
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
          placeholder={copy.placeholder}
        />
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePing}
          disabled={loading}
          className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? copy.loading : copy.button}
        </button>
      </div>

      {status ? <p className="text-sm text-slate-700 dark:text-slate-300">{status}</p> : null}
      {time ? <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{time}</p> : null}
      {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
  );
}
