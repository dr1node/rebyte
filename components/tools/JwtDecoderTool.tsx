'use client';

import { useState } from 'react';

const decodeJwt = (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format.');
  }

  const decodeSegment = (segment: string) => {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;
    const padded = padding ? normalized + '='.repeat(4 - padding) : normalized;
    const decoded = atob(padded);
    try {
      return decodeURIComponent(
        decoded
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
    } catch {
      return decoded;
    }
  };

  return {
    header: JSON.parse(decodeSegment(parts[0])),
    payload: JSON.parse(decodeSegment(parts[1])),
    signature: parts[2],
  };
};

export default function JwtDecoderTool() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header?: unknown; payload?: unknown; signature?: string }>({});
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    setDecoded({});

    try {
      const result = decodeJwt(token.trim());
      setDecoded(result);
    } catch (err) {
      setError('Unable to decode JWT. Please provide a valid token.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Decode JWT tokens instantly in the browser without sending data to a server.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              JWT token
              <textarea
                rows={8}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Paste a JWT token here"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <button
              type="button"
              onClick={handleDecode}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Decode JWT
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Decoded output</p>
            <div className="mt-4 space-y-4 rounded-3xl bg-white p-4 text-sm text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              <details className="rounded-3xl border border-slate-200/80 p-4 dark:border-slate-800">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white">Header</summary>
                <pre className="mt-3 overflow-x-auto text-xs text-slate-600 dark:text-slate-300">{decoded.header ? JSON.stringify(decoded.header, null, 2) : 'No header decoded.'}</pre>
              </details>
              <details className="rounded-3xl border border-slate-200/80 p-4 dark:border-slate-800">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white">Payload</summary>
                <pre className="mt-3 overflow-x-auto text-xs text-slate-600 dark:text-slate-300">{decoded.payload ? JSON.stringify(decoded.payload, null, 2) : 'No payload decoded.'}</pre>
              </details>
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">Signature</p>
                <p className="mt-2 break-all text-xs text-slate-600 dark:text-slate-300">{decoded.signature || 'No signature available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
