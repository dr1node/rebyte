'use client';

import { useMemo, useState } from 'react';

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~',
};

const generatePassword = (length: number, options: { lower: boolean; upper: boolean; numbers: boolean; symbols: boolean }) => {
  let availableChars = '';
  if (options.lower) availableChars += CHARSETS.lower;
  if (options.upper) availableChars += CHARSETS.upper;
  if (options.numbers) availableChars += CHARSETS.numbers;
  if (options.symbols) availableChars += CHARSETS.symbols;

  if (!availableChars) return '';

  return Array.from({ length }, () => availableChars[Math.floor(Math.random() * availableChars.length)]).join('');
};

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const password = useMemo(
    () => generatePassword(length, {
      lower: includeLower,
      upper: includeUpper,
      numbers: includeNumbers,
      symbols: includeSymbols,
    }),
    [length, includeLower, includeUpper, includeNumbers, includeSymbols]
  );

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
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
          Generate strong passwords instantly with length and character options for secure account creation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
                Password length
                <span className="text-slate-500 dark:text-slate-400">{length}</span>
              </label>
              <input
                type="range"
                min={8}
                max={32}
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Lowercase', checked: includeLower, onChange: () => setIncludeLower((prev) => !prev) },
                { label: 'Uppercase', checked: includeUpper, onChange: () => setIncludeUpper((prev) => !prev) },
                { label: 'Numbers', checked: includeNumbers, onChange: () => setIncludeNumbers((prev) => !prev) },
                { label: 'Symbols', checked: includeSymbols, onChange: () => setIncludeSymbols((prev) => !prev) },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={option.onChange}
                  className={`rounded-3xl border px-4 py-4 text-left text-sm font-semibold transition ${option.checked ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Output</p>
          <div className="mt-4 rounded-3xl border border-slate-200/80 bg-white p-4 text-sm text-slate-900 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100">
            <p className="break-words font-mono text-base leading-7">{password}</p>
          </div>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${password ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {copied ? 'Copied!' : 'Copy password'}
            </button>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Keep this password safe and use it for strong logins, account creation, or temporary access codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
