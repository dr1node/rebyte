'use client';

import { useState } from 'react';

const toHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export default function Sha256GeneratorTool() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!input) return;
    setLoading(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    setHash(toHex(digest));
    setLoading(false);
    setCopied(false);
  };

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Create SHA-256 hashes from text input for secure fingerprinting and verification without sending your data anywhere.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="space-y-6">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white">
            Text to hash
            <textarea
              rows={8}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={generateHash}
              disabled={!input || loading}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${input ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {loading ? 'Generating…' : 'Generate SHA-256'}
            </button>
            <button
              type="button"
              onClick={copyHash}
              disabled={!hash}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${hash ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {copied ? 'Copied!' : 'Copy hash'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">SHA-256 result</p>
            <div className="mt-4 rounded-3xl border border-slate-200/70 bg-white p-4 text-sm font-mono text-slate-900 dark:border-slate-800/70 dark:bg-slate-950 dark:text-slate-100">
              {hash || 'Your hash will appear here after generation.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
