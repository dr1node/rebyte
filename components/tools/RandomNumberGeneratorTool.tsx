'use client';

import { useState } from 'react';

export default function RandomNumberGeneratorTool() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setResults([]);

    const minValue = Number(min);
    const maxValue = Number(max);
    const countValue = Number(count);

    if (Number.isNaN(minValue) || Number.isNaN(maxValue) || Number.isNaN(countValue)) {
      setError('Please enter valid numbers for range and quantity.');
      return;
    }

    if (minValue > maxValue) {
      setError('Minimum value must be less than or equal to maximum value.');
      return;
    }

    if (countValue < 1 || countValue > 100) {
      setError('Generate between 1 and 100 random numbers.');
      return;
    }

    const generated: number[] = [];
    for (let i = 0; i < countValue; i += 1) {
      const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      generated.push(randomValue);
    }

    setResults(generated);
  };

  const copyResults = async () => {
    if (!results.length) return;
    try {
      await navigator.clipboard.writeText(results.join(', '));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Generate random numbers within a custom range instantly in the browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Min value
                <input
                  type="number"
                  value={min}
                  onChange={(event) => setMin(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Max value
                <input
                  type="number"
                  value={max}
                  onChange={(event) => setMax(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Count
                <input
                  type="number"
                  value={count}
                  onChange={(event) => setCount(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={generate}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Generate numbers
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Result</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {results.length ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Generated values:</p>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {results.join(', ')}
                  </div>
                  <button
                    type="button"
                    onClick={copyResults}
                    className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Copy results
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Your generated numbers will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
