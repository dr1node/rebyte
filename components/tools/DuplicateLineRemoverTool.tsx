'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { copyToClipboard } from '../../lib/browserUtils';

export default function DuplicateLineRemoverTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const unique = text.split(/\r?\n/).filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    setResult(unique.join('\n'));
  };

  const copyResult = async () => { await copyToClipboard(result); };
  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Hapus baris duplikat dari daftar atau teks berbasis baris.' : 'Remove duplicate lines from lists or line-based text.'}</p></div><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Teks dengan satu item per baris' : 'One item per line'}<textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} placeholder="Apple\nBanana\napple" className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} />{isIndonesian ? 'Bedakan huruf besar dan kecil' : 'Treat uppercase and lowercase as different'}</label><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Hasil tanpa duplikat' : 'Result without duplicates'}<textarea value={result} readOnly rows={12} className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={removeDuplicates} className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">{isIndonesian ? 'Hapus Duplikat' : 'Remove Duplicates'}</button><button type="button" onClick={copyResult} disabled={!result} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Salin Hasil' : 'Copy Result'}</button></div></div>;
}