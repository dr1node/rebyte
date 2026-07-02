'use client';

import { useState } from 'react';

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleTransform = () => {
    setError('');
    setOutput('');

    try {
      const result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      setOutput(result);
    } catch (err) {
      setError('Unable to process the URL. Please check the format and try again.');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Encode or decode URL strings safely without sending data anywhere.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {['encode', 'decode'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value as 'encode' | 'decode')}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${mode === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                >
                  {value === 'encode' ? 'Encode' : 'Decode'}
                </button>
              ))}
            </div>

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Input URL
              <textarea
                rows={6}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Enter text or URL to encode/decode"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <button
              type="button"
              onClick={handleTransform}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Output</p>
            <textarea
              rows={10}
              readOnly
              value={output}
              className="mt-3 w-full rounded-3xl border border-slate-200/70 bg-white p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${output ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              Copy output
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
