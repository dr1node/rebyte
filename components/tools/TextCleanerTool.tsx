'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { copyToClipboard } from '../../lib/browserUtils';

type CleaningOptions = { trimLines: boolean; collapseSpaces: boolean; removeEmptyLines: boolean; normalizeLineEndings: boolean; removeNonPrintable: boolean };

export default function TextCleanerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [options, setOptions] = useState<CleaningOptions>({ trimLines: true, collapseSpaces: true, removeEmptyLines: false, normalizeLineEndings: true, removeNonPrintable: true });

  const cleanText = () => {
    let cleaned = text;
    if (options.normalizeLineEndings) cleaned = cleaned.replace(/\r\n?/g, '\n');
    if (options.removeNonPrintable) cleaned = Array.from(cleaned).filter((character) => {
      const code = character.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    }).join('');
    let lines = cleaned.split('\n');
    if (options.trimLines) lines = lines.map((line) => line.trim());
    if (options.collapseSpaces) lines = lines.map((line) => line.replace(/[ \t]{2,}/g, ' '));
    if (options.removeEmptyLines) lines = lines.filter((line) => line.length > 0);
    setResult(lines.join('\n'));
  };

  const copyResult = async () => { await copyToClipboard(result); };
  const optionsList: Array<[keyof CleaningOptions, string, string]> = [['trimLines', isIndonesian ? 'Hapus spasi di awal/akhir baris' : 'Trim line spaces', ''], ['collapseSpaces', isIndonesian ? 'Ringkas spasi berlebih' : 'Collapse extra spaces', ''], ['removeEmptyLines', isIndonesian ? 'Hapus baris kosong' : 'Remove empty lines', ''], ['normalizeLineEndings', isIndonesian ? 'Samakan akhir baris' : 'Normalize line endings', ''], ['removeNonPrintable', isIndonesian ? 'Hapus karakter tidak terlihat' : 'Remove non-printable characters', '']];
  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Bersihkan teks dari masalah formatting umum langsung di browser.' : 'Clean common text formatting issues directly in your browser.'}</p></div><div className="grid gap-6 lg:grid-cols-2"><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Teks asli' : 'Original text'}<textarea value={text} onChange={(event) => setText(event.target.value)} rows={14} placeholder={isIndonesian ? 'Tempel atau ketik teks...' : 'Paste or type text...'} className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><label className="block text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Hasil bersih' : 'Cleaned result'}<textarea value={result} readOnly rows={14} className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label></div><div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-900"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Opsi pembersihan' : 'Cleaning options'}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{optionsList.map(([key, label]) => <label key={key} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={options[key]} onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.checked }))} />{label}</label>)}</div></div><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={cleanText} className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">{isIndonesian ? 'Bersihkan Teks' : 'Clean Text'}</button><button type="button" onClick={copyResult} disabled={!result} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Salin Hasil' : 'Copy Result'}</button></div></div>;
}