'use client';

import { useState } from 'react';

const safeEvaluate = (expression: string) => {
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${sanitized})`)();
};

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '(', ')',
  'C', '←', '+', '='
];

export default function CalculatorTool() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      const value = safeEvaluate(expression);
      setResult(String(value));
      setError('');
    } catch (err) {
      setResult('');
      setError('Enter a valid expression, for example 12 / 4 + 3 * 2.');
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
      setError('');
      return;
    }

    if (value === '←') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (value === '=') {
      handleCalculate();
      return;
    }

    setExpression((prev) => prev + value);
  };

  return (
    <div className="space-y-6">
      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Expression</span>
        <input
          type="text"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="e.g. 12 + 4 * 3"
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
        />
      </label>

      <div className="grid gap-2 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/70 dark:bg-slate-900/95">
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button) => (
            <button
              key={button}
              type="button"
              onClick={() => handleButtonClick(button)}
              className={`rounded-3xl px-3 py-4 text-sm font-semibold transition ${button === '=' ? 'col-span-2 bg-sky-600 text-white hover:bg-sky-500' : button === 'C' || button === '←' ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={() => {
            setExpression('');
            setResult('');
            setError('');
          }}
          className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Clear
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

      <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-500 dark:text-slate-400">Result</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{result || '0'}</p>
      </div>
    </div>
  );
}
