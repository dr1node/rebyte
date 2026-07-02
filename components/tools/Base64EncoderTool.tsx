'use client';

import { useState } from 'react';

const encodeText = (text: string) => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeText = (text: string) => {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

export default function Base64EncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleTransform = () => {
    try {
      setError('');
      const result = mode === 'encode' ? encodeText(input) : decodeText(input);
      setOutput(result);
    } catch (err) {
      setError('Invalid Base64 input. Please make sure the string is correct.');
      setOutput('');
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
          Encode and decode text with Base64 directly in your browser. Use this for safe data transfer, embedding, or quick conversion.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
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
              Input text
              <textarea
                rows={8}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <button
              type="button"
              onClick={handleTransform}
              className="inline-flex rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {mode === 'encode' ? 'Encode text' : 'Decode Base64'}
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
              rows={8}
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
