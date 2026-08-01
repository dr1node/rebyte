'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileDropzone from '../FileDropzone';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(1)} ${units[index]}`;
};

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState('');
  const [error, setError] = useState('');
  const [merging, setMerging] = useState(false);

  const handleUpload = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter((file) => file.type === 'application/pdf');

    if (!pdfFiles.length) {
      setError('Please choose one or more PDF files.');
      setFiles([]);
      return;
    }

    setError('');
    setFiles(pdfFiles);
    setMergedUrl('');
  };

  const handleMerge = async () => {
    if (!files.length) return;
    setMerging(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      setError('Unable to merge the selected PDF files. Please try again.');
    } finally {
      setMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedUrl) return;
    const link = document.createElement('a');
    link.href = mergedUrl;
    link.download = 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Merge multiple PDFs into one combined file directly in your browser without sending data to a server.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
          <FileDropzone label="Upload PDF files" accept="application/pdf" multiple onFiles={handleUpload} />

          {error ? (
            <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Selected files</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {files.length ? (
                  files.map((file) => (
                    <div key={file.name} className="rounded-3xl bg-white p-3 dark:bg-slate-950">
                      <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                      <p>{formatBytes(file.size)}</p>
                    </div>
                  ))
                ) : (
                  <p>No PDF files selected yet.</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleMerge}
              disabled={!files.length || merging}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${files.length ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {merging ? 'Merging…' : 'Merge PDFs'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Result</p>
          <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Files count</p>
              <p className="mt-2">{files.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Preview</p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">After merge, download your combined PDF.</p>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!mergedUrl}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${mergedUrl ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              Download merged PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
