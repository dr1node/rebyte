'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

type Mode = 'difference' | 'age';
type DateParts = { year: number; month: number; day: number };

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value: string): { date: Date; parts: DateParts } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (
    date.getUTCFullYear() !== parts.year ||
    date.getUTCMonth() !== parts.month - 1 ||
    date.getUTCDate() !== parts.day
  ) return null;
  return { date, parts };
}

function getCalendarDuration(start: DateParts, end: DateParts) {
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    days += new Date(Date.UTC(end.year, end.month - 1, 0)).getUTCDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

export default function DateDifferenceCalculatorTool() {
  const { language } = useLanguage();
  const today = localDateValue(new Date());
  const [mode, setMode] = useState<Mode>('difference');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const labels = language === 'id'
    ? {
        description: 'Hitung selisih hari, durasi kalender, atau umur antara dua tanggal. Perhitungan dilakukan lokal di browser.',
        difference: 'Selisih tanggal',
        age: 'Hitung umur',
        ageResult: 'Umur',
        startDate: 'Tanggal awal',
        endDate: 'Tanggal akhir',
        birthDate: 'Tanggal lahir',
        asOfDate: 'Hitung umur pada tanggal',
        calculate: 'Hitung',
        result: 'Hasil',
        days: 'hari',
        weeks: 'minggu',
        years: 'tahun',
        months: 'bulan',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        invalid: 'Pilih dua tanggal yang valid.',
        futureBirth: 'Tanggal lahir tidak boleh setelah tanggal perhitungan.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        localNote: 'Tanggal tidak dikirim ke server.',
      }
    : {
        description: 'Calculate the day difference, calendar duration, or age between two dates. All calculations run locally in your browser.',
        difference: 'Date difference',
        age: 'Calculate age',
        ageResult: 'Age',
        startDate: 'Start date',
        endDate: 'End date',
        birthDate: 'Date of birth',
        asOfDate: 'Age on date',
        calculate: 'Calculate',
        result: 'Result',
        days: 'days',
        weeks: 'weeks',
        years: 'years',
        months: 'months',
        copy: 'Copy result',
        copied: 'Copied',
        invalid: 'Choose two valid dates.',
        futureBirth: 'Date of birth cannot be after the calculation date.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        localNote: 'Dates are not sent to a server.',
      };

  const calculate = () => {
    setError('');
    setResult('');
    setCopied(false);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end) {
      setError(labels.invalid);
      return;
    }

    if (mode === 'age' && start.date > end.date) {
      setError(labels.futureBirth);
      return;
    }

    const first = start.date <= end.date ? start : end;
    const last = start.date <= end.date ? end : start;
    const totalDays = Math.round((last.date.getTime() - first.date.getTime()) / 86400000);
    const duration = getCalendarDuration(first.parts, last.parts);
    const formatted = language === 'id'
      ? `${duration.years} ${labels.years}, ${duration.months} ${labels.months}, ${duration.days} ${labels.days}`
      : `${duration.years} ${labels.years}, ${duration.months} ${labels.months}, ${duration.days} ${labels.days}`;
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    setResult(
      `${mode === 'age' ? `${labels.ageResult}: ${formatted}` : `${labels.result}: ${formatted}`}\n${totalDays} ${labels.days} (${weeks} ${labels.weeks} ${remainingDays} ${labels.days})`,
    );
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setError('');
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(labels.copyError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{labels.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label={language === 'id' ? 'Mode perhitungan' : 'Calculation mode'}>
          {(['difference', 'age'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setResult('');
                setError('');
              }}
              aria-pressed={mode === value}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                mode === value
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              {value === 'difference' ? labels.difference : labels.age}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {mode === 'age' ? labels.birthDate : labels.startDate}
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setResult('');
                setError('');
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {mode === 'age' ? labels.asOfDate : labels.endDate}
            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setResult('');
                setError('');
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <button type="button" onClick={calculate} className="mt-5 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          {labels.calculate}
        </button>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        {result ? (
          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.result}</p>
            <p className="mt-3 whitespace-pre-line text-lg font-medium text-slate-800 dark:text-slate-200" aria-live="polite">{result}</p>
            <button type="button" onClick={() => void copyResult()} className="mt-4 rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
              {copied ? labels.copied : labels.copy}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
