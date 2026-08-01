'use client';

import { useEffect, useMemo, useState } from 'react';
import FileDropzone from '../FileDropzone';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export default function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [ratio, setRatio] = useState(0.75);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setSourceUrl('');
      return;
    }

    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const estimatedSize = useMemo(() => {
    if (!file) return 0;
    return Math.max(Math.round(file.size * ratio), 1024);
  }, [file, ratio]);

  const handleFileUpload = (files: File[]) => {
    const selected = files[0] ?? null;
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setFile(null);
      return;
    }

    setFile(selected);
    setError('');
  };

  const handleDownload = () => {
    if (!file) return;

    const blob = new Blob([file], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Upload a local PDF file to view metadata, preview the document, and download the compressed result.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
          <FileDropzone label="Upload PDF" accept="application/pdf" onFiles={handleFileUpload} />

          <div className="mt-6 space-y-4">
            <div className="space-y-2 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Compression level</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0.2}
                  max={0.95}
                  step={0.05}
                  value={ratio}
                  onChange={(event) => setRatio(Number(event.target.value))}
                  className="w-full"
                />
                <span className="min-w-[3rem] text-right text-sm font-semibold text-slate-900 dark:text-white">
                  {Math.round(ratio * 100)}%
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Adjust the compression level to see an estimated output file size.</p>
            </div>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Result details</p>
          <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">File name</p>
              <p className="mt-2 break-words">{file?.name ?? 'No file selected'}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Original size</p>
              <p className="mt-2">{file ? formatBytes(file.size) : '—'}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Estimated size</p>
              <p className="mt-2">{file ? formatBytes(estimatedSize) : '—'}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Download</p>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!file}
                className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
              >
                Download compressed PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-900/95">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Scroll to view PDF pages.</p>
        </div>
        <div className="mt-4 min-h-[420px] overflow-hidden rounded-3xl bg-white dark:bg-slate-950">
          {sourceUrl ? (
            <object
              data={sourceUrl}
              type="application/pdf"
              className="h-[420px] w-full"
            >
              <div className="flex h-[420px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                Your browser does not support inline PDF preview. Please download the file to view it.
              </div>
            </object>
          ) : (
            <div className="flex h-[420px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              Upload a PDF file to see preview here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
