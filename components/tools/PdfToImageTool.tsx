'use client';

import { useState, type ChangeEvent } from 'react';
// @ts-ignore
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export default function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [imageUrls, setImageUrls] = useState<Array<{ url: string; name: string }>>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
    setImageUrls([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setImageUrls([]);

    try {
      const pdfData = await file.arrayBuffer();
      const loadingTask = getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      const generated: Array<{ url: string; name: string }> = [];

      for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
        const page = await pdf.getPage(pageIndex);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (!context) {
          throw new Error('Unable to get canvas context');
        }

        // @ts-ignore
        const renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
        const imageUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png');
        generated.push({ url: imageUrl, name: `page-${pageIndex}.${format}` });
      }

      setImageUrls(generated);
    } catch (err) {
      setError('Unable to convert PDF pages into images. Please try a different file.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Convert each PDF page into a high-quality PNG or JPG image right in your browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Upload PDF file
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Output format</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {['png', 'jpeg'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormat(value as 'png' | 'jpeg')}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${format === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              disabled={!file || processing}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {processing ? 'Converting…' : 'Convert PDF pages'}
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Each page will be converted into its own image file after conversion completes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {imageUrls.length > 0 ? (
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Download converted images</p>
          <div className="mt-4 grid gap-4">
            {imageUrls.map((item) => (
              <a
                key={item.name}
                href={item.url}
                download={item.name}
                className="rounded-3xl border border-slate-200/80 bg-white p-4 text-sm text-slate-900 transition hover:border-sky-300/40 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
