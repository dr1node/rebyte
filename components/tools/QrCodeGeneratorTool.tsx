'use client';

import { useMemo, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGeneratorTool() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const generateCode = async () => {
    if (!text.trim()) {
      setError('Enter text or a link first.');
      setUrl('');
      return;
    }

    setError('');
    try {
      const qr = await QRCode.toDataURL(text, { width: size, margin: 2 });
      setUrl(qr);
    } catch {
      setError('Failed to generate QR code. Please try again.');
    }
  };

  const downloadImage = () => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const errorMessage = useMemo(() => {
    if (text.length > 1024) return 'Text is too long for a QR code.';
    return error;
  }, [text, error]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Generate customizable QR codes for URLs, text, and contact information directly in your browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              QR code content
              <textarea
                rows={5}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Enter a link, text, or contact data"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Size
              <input
                type="range"
                min={128}
                max={512}
                step={64}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="mt-3 w-full"
              />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{size} x {size} pixels</p>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateCode}
                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Generate QR Code
              </button>
              <button
                type="button"
                onClick={downloadImage}
                disabled={!url}
                className={`rounded-3xl px-5 py-3 text-sm font-semibold text-white transition ${url ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
              >
                Download
              </button>
            </div>

            {errorMessage ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {url ? (
                <img src={url} alt="QR code preview" className="mx-auto h-full w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Generated QR code preview will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
