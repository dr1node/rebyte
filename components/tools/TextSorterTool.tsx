'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { copyToClipboard, downloadText } from '../../lib/browserUtils';

type SortMode = 'alphabetical' | 'numeric' | 'length' | 'reverse';

export default function TextSorterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<SortMode>('alphabetical');

  const sortText = () => {
    const lines = text.split(/\r?\n/);
    if (mode === 'reverse') { setResult(lines.reverse().join('\n')); return; }
    const sorted = [...lines].sort((left, right) => {
      if (mode === 'numeric') return (Number(left) || 0) - (Number(right) || 0);
      if (mode === 'length') return left.length - right.length || left.localeCompare(right);
      return left.localeCompare(right, undefined, { sensitivity: 'base', numeric: true });
    });
    setResult(sorted.join('\n'));
  };

  const copyResult = async () => { await copyToClipboard(result); };
  const downloadResult = () => { if (result) downloadText(result, 'sorted-text.txt'); };
  const modes: Array<[SortMode, string]> = [['alphabetical', isIndonesian ? 'Alfabet' : 'Alphabetical'], ['numeric', isIndonesian ? 'Numerik' : 'Numerical'], ['length', isIndonesian ? 'Panjang' : 'By length'], ['reverse', isIndonesian ? 'Terbalik' : 'Reverse order']];
  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Urutkan teks berdasarkan alfabet, angka, panjang, atau urutan terbalik.' : 'Sort text alphabetically, numerically, by length, or in reverse order.'}</p></div><div className="grid gap-6 lg:grid-cols-2"><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Teks asli' : 'Original text'}<textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Hasil urutan' : 'Sorted result'}<textarea value={result} readOnly rows={12} className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{modes.map(([value, label]) => <button key={value} type="button" onClick={() => setMode(value)} className={`rounded-3xl px-4 py-3 text-sm font-semibold ${mode === value ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'}`}>{label}</button>)}</div><div className="grid gap-3 sm:grid-cols-3"><button type="button" onClick={sortText} className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">{isIndonesian ? 'Urutkan' : 'Sort'}</button><button type="button" onClick={copyResult} disabled={!result} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{isIndonesian ? 'Salin' : 'Copy'}</button><button type="button" onClick={downloadResult} disabled={!result} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{isIndonesian ? 'Unduh' : 'Download'}</button></div></div>;
}