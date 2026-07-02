'use client';

import { useState, type ChangeEvent } from 'react';
import { jsPDF } from 'jspdf';

export default function ImageToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setImageSrc('');
      setFileName('');
      return;
    }

    setFile(selectedFile);
    setImageSrc(URL.createObjectURL(selectedFile));
    setFileName(selectedFile.name);
    setError('');
  };

  const downloadPdf = async () => {
    if (!file || !imageSrc) return;
    setLoading(true);

    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / image.width, pageHeight / image.height, 1);
      const imgWidth = image.width * ratio;
      const imgHeight = image.height * ratio;
      const left = (pageWidth - imgWidth) / 2;
      const top = (pageHeight - imgHeight) / 2;
      const format = file.type === 'image/png' ? 'PNG' : 'JPEG';

      pdf.addImage(image, format, left, top, imgWidth, imgHeight);
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace(/\.[^.]+$/, '.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Unable to convert image to PDF. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Convert an image file into a PDF document. Supports JPEG, PNG, and most browser-supported image formats.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          Upload image file
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        {fileName ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Selected file: {fileName}</p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <div className="mt-4 min-h-[240px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {imageSrc ? (
                <img src={imageSrc} alt="Image preview" className="h-full w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload an image to preview it here.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">PDF options</p>
              <p>Images are scaled to fit an A4 page while preserving aspect ratio.</p>
              <p>Conversion happens locally in your browser.</p>
            </div>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!file || loading}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {loading ? 'Converting…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
