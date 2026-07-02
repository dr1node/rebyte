'use client';

import { useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
// @ts-ignore
import JsBarcode from 'jsbarcode';

const barcodeFormats = [
  { value: 'CODE128', label: 'Code128' },
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'QR', label: 'QR Code' },
] as const;

export default function BarcodeGeneratorTool() {
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'QR'>('CODE128');
  const [value, setValue] = useState('123456789012');
  const [outputUrl, setOutputUrl] = useState('');
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const placeholder = useMemo(() => {
    if (format === 'EAN13') return 'Enter 12 or 13 digits';
    if (format === 'CODE128') return 'Enter any text or numbers';
    return 'Enter text or URL';
  }, [format]);

  const generateBarcode = async () => {
    setError('');
    setOutputUrl('');

    if (!value.trim()) {
      setError('Enter a value to generate the barcode.');
      return;
    }

    try {
      if (format === 'QR') {
        const qrDataUrl = await QRCode.toDataURL(value, {
          width: 320,
          margin: 2,
        });
        setOutputUrl(qrDataUrl);
        return;
      }

      if (format === 'EAN13' && !/^\d{12,13}$/.test(value)) {
        setError('EAN-13 requires 12 or 13 digits.');
        return;
      }

      if (svgRef.current) {
        JsBarcode(svgRef.current, value, {
          format,
          displayValue: true,
          lineColor: '#111827',
          margin: 10,
          width: 2,
          height: 100,
          fontSize: 16,
        });

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgRef.current);
        const encoded = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
        setOutputUrl(encoded);
      }
    } catch (err) {
      setError('Unable to generate barcode. Please verify the input and try again.');
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const link = document.createElement('a');
    link.href = outputUrl;
    link.download = `${format.toLowerCase()}-barcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Create Code128, EAN, or QR barcodes in the browser and download them instantly.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800/70 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Barcode type</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {barcodeFormats.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFormat(item.value)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${format === item.value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Barcode value
              <input
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={placeholder}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <button
              type="button"
              onClick={generateBarcode}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Generate barcode
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
              {outputUrl ? (
                <div className="flex h-full items-center justify-center">
                  <img src={outputUrl} alt="Generated barcode" className="max-h-[220px] max-w-full object-contain" />
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Your barcode preview appears here after generation.</p>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!outputUrl}
                className={`inline-flex flex-1 items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${outputUrl ? 'bg-sky-600 hover:bg-sky-500' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        <svg ref={svgRef} className="hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
