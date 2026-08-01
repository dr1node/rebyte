'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export default function TimestampConverterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [mode, setMode] = useState<'timestamp' | 'date'>('timestamp');
  const [timestamp, setTimestamp] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 16));
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    setError('');
    if (mode === 'timestamp') {
      const parsed = Number(timestamp);
      if (!Number.isFinite(parsed)) { setError(isIndonesian ? 'Masukkan timestamp yang valid.' : 'Enter a valid timestamp.'); return; }
      const date = new Date(parsed * 1000);
      if (Number.isNaN(date.getTime())) { setError(isIndonesian ? 'Timestamp berada di luar rentang yang didukung.' : 'This timestamp is outside the supported range.'); return; }
      setResult(date.toLocaleString(isIndonesian ? 'id-ID' : 'en-US', { dateStyle: 'full', timeStyle: 'long' }));
    } else {
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) { setError(isIndonesian ? 'Pilih tanggal dan waktu yang valid.' : 'Choose a valid date and time.'); return; }
      setResult(String(Math.floor(date.getTime() / 1000)));
    }
  };
  const labels = isIndonesian ? { timestamp: 'Timestamp ke tanggal', date: 'Tanggal ke timestamp', inputTimestamp: 'Unix timestamp (detik)', inputDate: 'Tanggal dan waktu', convert: 'Konversi', result: 'Hasil', copy: 'Salin' } : { timestamp: 'Timestamp to date', date: 'Date to timestamp', inputTimestamp: 'Unix timestamp (seconds)', inputDate: 'Date and time', convert: 'Convert', result: 'Result', copy: 'Copy' };

  return <div className="space-y-6"><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setMode('timestamp'); setResult(''); }} className={`rounded-3xl px-4 py-3 text-sm font-semibold ${mode === 'timestamp' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'}`}>{labels.timestamp}</button><button type="button" onClick={() => { setMode('date'); setResult(''); }} className={`rounded-3xl px-4 py-3 text-sm font-semibold ${mode === 'date' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'}`}>{labels.date}</button></div><label className="block space-y-3"><span className="text-sm font-semibold text-slate-900 dark:text-white">{mode === 'timestamp' ? labels.inputTimestamp : labels.inputDate}</span><input type={mode === 'timestamp' ? 'number' : 'datetime-local'} value={mode === 'timestamp' ? timestamp : dateValue} onChange={(event) => mode === 'timestamp' ? setTimestamp(event.target.value) : setDateValue(event.target.value)} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><button type="button" onClick={convert} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">{labels.convert}</button>{error ? <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}{result ? <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.result}</p><div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 dark:bg-slate-950"><code className="break-all text-sm text-slate-900 dark:text-slate-100">{result}</code><button type="button" onClick={() => navigator.clipboard.writeText(result)} className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white">{labels.copy}</button></div></div> : null}</div>;
}