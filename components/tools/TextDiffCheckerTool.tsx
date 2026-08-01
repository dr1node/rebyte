'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

type DiffLine = { value: string; type: 'same' | 'added' | 'removed' };

const compareLines = (original: string, changed: string): DiffLine[] => {
  const originalLines = original.split('\n');
  const changedLines = changed.split('\n');
  const matrix = Array.from({ length: originalLines.length + 1 }, () => Array<number>(changedLines.length + 1).fill(0));
  for (let originalIndex = originalLines.length - 1; originalIndex >= 0; originalIndex -= 1) for (let changedIndex = changedLines.length - 1; changedIndex >= 0; changedIndex -= 1) matrix[originalIndex][changedIndex] = originalLines[originalIndex] === changedLines[changedIndex] ? matrix[originalIndex + 1][changedIndex + 1] + 1 : Math.max(matrix[originalIndex + 1][changedIndex], matrix[originalIndex][changedIndex + 1]);
  const result: DiffLine[] = [];
  let originalIndex = 0;
  let changedIndex = 0;
  while (originalIndex < originalLines.length || changedIndex < changedLines.length) {
    if (originalIndex < originalLines.length && changedIndex < changedLines.length && originalLines[originalIndex] === changedLines[changedIndex]) { result.push({ value: originalLines[originalIndex], type: 'same' }); originalIndex += 1; changedIndex += 1; }
    else if (changedIndex < changedLines.length && (originalIndex === originalLines.length || matrix[originalIndex][changedIndex + 1] >= matrix[originalIndex + 1][changedIndex])) { result.push({ value: changedLines[changedIndex], type: 'added' }); changedIndex += 1; }
    else { result.push({ value: originalLines[originalIndex], type: 'removed' }); originalIndex += 1; }
  }
  return result;
};

export default function TextDiffCheckerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [original, setOriginal] = useState('');
  const [changed, setChanged] = useState('');
  const diff = useMemo(() => compareLines(original, changed), [original, changed]);
  const labels = isIndonesian ? { original: 'Teks awal', changed: 'Teks perubahan', result: 'Perbandingan hasil', same: 'Tidak berubah', added: 'Ditambahkan', removed: 'Dihapus' } : { original: 'Original text', changed: 'Changed text', result: 'Comparison result', same: 'Unchanged', added: 'Added', removed: 'Removed' };
  return <div className="space-y-6"><div className="grid gap-4 lg:grid-cols-2"><label className="space-y-3"><span className="text-sm font-semibold text-slate-900 dark:text-white">{labels.original}</span><textarea value={original} onChange={(event) => setOriginal(event.target.value)} rows={10} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" /></label><label className="space-y-3"><span className="text-sm font-semibold text-slate-900 dark:text-white">{labels.changed}</span><textarea value={changed} onChange={(event) => setChanged(event.target.value)} rows={10} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" /></label></div><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.result}</p><div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300"><span className="text-emerald-700 dark:text-emerald-300">+ {labels.added}</span><span className="text-rose-700 dark:text-rose-300">- {labels.removed}</span><span>{labels.same}</span></div></div><div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950">{diff.map((line, index) => <div key={`${line.type}-${index}`} className={`whitespace-pre-wrap px-3 py-1 ${line.type === 'added' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200' : line.type === 'removed' ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200' : 'text-slate-700 dark:text-slate-300'}`}><span className="mr-3 select-none opacity-60">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>{line.value || ' '}</div>)}</div></div></div>;
}