'use client';

import { useState } from 'react';

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const list = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(list);
    setCopied(false);
  };

  const copyUuids = async () => {
    if (!uuids.length) return;
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
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
          Generate Version 4 UUIDs for unique identifiers, short links, or random keys without leaving your browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
              UUIDs to generate
              <span className="text-slate-500 dark:text-slate-400">{count}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={generateUuids}
              className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Generate UUIDs
            </button>
            <button
              type="button"
              onClick={copyUuids}
              disabled={!uuids.length}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${uuids.length ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {copied ? 'Copied!' : 'Copy UUIDs'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100">
            {uuids.length ? (
              <div className="space-y-3">
                {uuids.map((uuid) => (
                  <p key={uuid} className="break-all font-mono text-sm leading-6 text-slate-900 dark:text-slate-100">
                    {uuid}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Click Generate UUIDs to create one or more unique identifiers.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
