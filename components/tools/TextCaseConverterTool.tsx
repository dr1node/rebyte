'use client';

import { useMemo, useState, type ChangeEvent } from 'react';

export default function TextCaseConverterTool() {
  const [text, setText] = useState('Type or paste text here to convert case.');
  const [mode, setMode] = useState<'normal' | 'upper' | 'lower' | 'title'>('normal');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (mode === 'upper') return text.toUpperCase();
    if (mode === 'lower') return text.toLowerCase();
    if (mode === 'title') return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return text;
  }, [mode, text]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;

    try {
      const fileText = await selected.text();
      if (fileText.includes('\0')) {
        throw new Error('Invalid text file');
      }
      setText(fileText);
      setFileName(selected.name);
      setError('');
    } catch (err) {
      setError('Unable to read file. Please upload a valid text file.');
      setFileName('');
    }
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ? `converted-${fileName}` : 'converted-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-3">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Upload text file</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        {fileName ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loaded file: {fileName}</p>
        ) : null}

        {error ? (
          <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}
      </div>

      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Original text</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Original', value: 'normal' },
          { label: 'UPPERCASE', value: 'upper' },
          { label: 'lowercase', value: 'lower' },
          { label: 'Title Case', value: 'title' },
        ].map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => setMode(action.value as typeof mode)}
            className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${mode === action.value ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Converted text</span>
        <textarea
          value={result}
          readOnly
          rows={10}
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>

      <button
        type="button"
        onClick={downloadResult}
        className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Download converted text
      </button>
    </div>
  );
}
