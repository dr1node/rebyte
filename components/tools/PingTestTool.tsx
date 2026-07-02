'use client';

import { useState } from 'react';

export default function PingTestTool() {
  const [target, setTarget] = useState('https://example.com');
  const [status, setStatus] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePing = async () => {
    setStatus('');
    setTime('');
    setError('');
    setLoading(true);

    try {
      const url = target.startsWith('http') ? target : `https://${target}`;
      const start = performance.now();
      const response = await fetch(url, { method: 'HEAD' });
      const duration = Math.round(performance.now() - start);
      setStatus(`Status: ${response.status} ${response.statusText}`);
      setTime(`Latency: ${duration} ms`);
    } catch (err) {
      setError('Unable to reach the target. Make sure the address is valid and the server accepts browser requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Target URL</span>
        <input
          type="text"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
          placeholder="Enter a URL or hostname to test, for example https://example.com"
        />
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePing}
          disabled={loading}
          className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? 'Checking...' : 'Check latency'}
        </button>
      </div>

      {status ? <p className="text-sm text-slate-700 dark:text-slate-300">{status}</p> : null}
      {time ? <p className="text-sm text-slate-700 dark:text-slate-300">{time}</p> : null}
      {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
  );
}
