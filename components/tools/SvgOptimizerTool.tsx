'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/browserUtils';

export default function SvgOptimizerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [removeEditorData, setRemoveEditorData] = useState(true);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const optimize = () => {
    if (!file) return;
    let optimized = removeComments ? source.replace(/<!--[\s\S]*?-->/g, '') : source;
    if (removeEditorData) optimized = optimized.replace(/\s(?:inkscape|sodipodi):[\w-]+="[^"]*"/gi, '').replace(/\s(?:xmlns:inkscape|xmlns:sodipodi)="[^"]*"/gi, '');
    if (collapseWhitespace) optimized = optimized.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    setResult(optimized); setError('');
  };

  const download = () => { if (result && file) downloadBlob(new Blob([result], { type: 'image/svg+xml' }), `optimized-${file.name}`); };
  const options = [
    { checked: removeComments, setChecked: setRemoveComments, label: isIndonesian ? 'Hapus komentar' : 'Remove comments' },
    { checked: collapseWhitespace, setChecked: setCollapseWhitespace, label: isIndonesian ? 'Ringkas whitespace' : 'Collapse whitespace' },
    { checked: removeEditorData, setChecked: setRemoveEditorData, label: isIndonesian ? 'Hapus data editor' : 'Remove editor data' },
  ];

  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Hapus data SVG yang tidak diperlukan secara lokal dan pertahankan hasil visualnya.' : 'Remove unnecessary SVG data locally while preserving the visual result.'}</p></div><div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950"><FileDropzone label={isIndonesian ? 'Unggah file SVG' : 'Upload SVG file'} accept="image/svg+xml,.svg" onFiles={async (files) => { const selected = files[0] ?? null; if (!selected) return; try { setFile(selected); setSource(await selected.text()); setResult(''); setError(''); } catch { setError(isIndonesian ? 'File SVG tidak dapat dibaca.' : 'Unable to read this SVG file.'); } }} />{file ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{file.name} · {(file.size / 1024).toFixed(1)} KB</p> : null}<div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Opsi optimasi' : 'Optimization options'}</p>{options.map((option) => <label key={option.label} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={option.checked} onChange={(event) => option.setChecked(event.target.checked)} />{option.label}</label>)}</div>{error ? <p className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}<div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={optimize} disabled={!file} className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Optimalkan' : 'Optimize'}</button><button type="button" onClick={download} disabled={!result} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Unduh SVG' : 'Download SVG'}</button></div>{result ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{isIndonesian ? `Ukuran hasil: ${(new Blob([result]).size / 1024).toFixed(1)} KB` : `Optimized size: ${(new Blob([result]).size / 1024).toFixed(1)} KB`}</p> : null}</div></div>;
}