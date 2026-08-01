'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const value = JSON.parse(input);
      setOutput(JSON.stringify(value, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON. Please check the structure and try again.');
    }
  };

  const minifyJson = () => {
    try {
      const value = JSON.parse(input);
      setOutput(JSON.stringify(value));
      setError('');
    } catch (err) {
      setError('Invalid JSON. Please check the structure and try again.');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setOutput('JSON is valid.');
      setError('');
    } catch (err) {
      setError('Invalid JSON. Please check the structure and try again.');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (files: File[]) => {
    const file = files[0] ?? null;
    if (!file) return;
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      setError('Please upload a valid JSON file.');
      return;
    }

    try {
      const text = await file.text();
      setInput(text);
      setError('');
    } catch (err) {
      setError('Unable to read the JSON file.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">JSON Input</p>
            <FileDropzone label="Upload JSON" accept="application/json,.json" onFiles={handleFileUpload} />
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={10}
            className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Output</p>
            <button
              type="button"
              onClick={downloadOutput}
              disabled={!output}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${output ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              Download JSON
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Formatted or validated JSON appears here..."
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={formatJson} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Format JSON
        </button>
        <button type="button" onClick={minifyJson} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
          Minify JSON
        </button>
        <button type="button" onClick={validateJson} className="rounded-3xl bg-sky-100 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 dark:bg-sky-900/15 dark:text-sky-200">
          Validate JSON
        </button>
        <button type="button" onClick={copyOutput} disabled={!output} className={`rounded-3xl ${output ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'} px-5 py-3 text-sm font-semibold transition`}>
          Copy Output
        </button>
      </div>
    </div>
  );
}
