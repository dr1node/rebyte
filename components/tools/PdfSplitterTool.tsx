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

const parsePageRange = (range: string, totalPages: number) => {
  const pages = new Set<number>();
  range
    .split(',')
    .map((segment) => segment.trim())
    .forEach((segment) => {
      if (!segment) return;
      if (segment.includes('-')) {
        const [start, end] = segment.split('-').map((value) => Number(value.trim()));
        if (!Number.isNaN(start) && !Number.isNaN(end) && start > 0 && end >= start) {
          for (let page = start; page <= Math.min(end, totalPages); page += 1) {
            pages.add(page);
          }
        }
      } else {
        const page = Number(segment);
        if (!Number.isNaN(page) && page > 0 && page <= totalPages) {
          pages.add(page);
        }
      }
    });
  return Array.from(pages).sort((a, b) => a - b);
};

export default function PdfSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [outputFiles, setOutputFiles] = useState<Array<{ name: string; url: string; size: number }>>([]);
  const [error, setError] = useState('');
  const [splitting, setSplitting] = useState(false);

  const handleUpload = (files: File[]) => {
    const selectedFile = files[0] ?? null;
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
    setOutputFiles([]);
  };

  const handleSplit = async () => {
    if (!file) return;
    setSplitting(true);
    setError('');
    setOutputFiles([]);

    try {
      const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
      const totalPages = sourcePdf.getPageCount();
      const pagesToSplit = pageRange.trim()
        ? parsePageRange(pageRange, totalPages)
        : Array.from({ length: totalPages }, (_, index) => index + 1);

      if (!pagesToSplit.length) {
        setError('Please enter a valid page range or leave the field blank to split all pages.');
        setSplitting(false);
        return;
      }

      const generated: Array<{ name: string; url: string; size: number }> = [];
      for (const pageNumber of pagesToSplit) {
        const pageIndex = pageNumber - 1;
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        generated.push({
          name: `split-${file.name.replace(/\.[^.]+$/, '')}-page-${pageNumber}.pdf`,
          url,
          size: pdfBytes.byteLength,
        });
      }

      setOutputFiles(generated);
    } catch (err) {
      setError('Unable to split the PDF. Please try another file or range.');
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Extract selected pages from a PDF or split it into multiple single-page documents in the browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <FileDropzone label="Upload PDF file" accept="application/pdf" onFiles={handleUpload} />

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Page range
              <input
                type="text"
                value={pageRange}
                onChange={(event) => setPageRange(event.target.value)}
                placeholder="e.g. 1-3,5 or leave blank to split all pages"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <button
              type="button"
              onClick={handleSplit}
              disabled={!file || splitting}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {splitting ? 'Splitting…' : 'Split PDF'}
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Output preview</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Select a page range and click Split PDF. Each selected page becomes its own downloadable PDF file.
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Example range formats:</p>
              <ul className="list-disc pl-5">
                <li>1-3</li>
                <li>2,4,6</li>
                <li>1-3,5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {outputFiles.length > 0 ? (
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Download split files</p>
          <div className="mt-4 grid gap-4">
            {outputFiles.map((item) => (
              <div key={item.name} className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{formatBytes(item.size)}</p>
                  </div>
                  <a
                    href={item.url}
                    download={item.name}
                    className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
