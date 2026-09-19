'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

type Position = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
const positionLabels: Record<Position, string> = { 'top-left': 'Top left', 'top-right': 'Top right', center: 'Center', 'bottom-left': 'Bottom left', 'bottom-right': 'Bottom right' };

export default function PdfWatermarkTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [text, setText] = useState('CONFIDENTIAL');
  const [position, setPosition] = useState<Position>('center');
  const [size, setSize] = useState(42);
  const [rotation, setRotation] = useState(-35);
  const [opacity, setOpacity] = useState(0.28);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const previewBytesRef = useRef<Uint8Array | null>(null);
  const previewUrlRef = useRef('');

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const addWatermark = async () => {
    if (!file || !text.trim()) { setError(isIndonesian ? 'Unggah PDF dan masukkan teks watermark terlebih dahulu.' : 'Upload a PDF and enter watermark text first.'); return; }
    setProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      for (const page of pdf.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const margin = 36;
        const x = position === 'top-left' || position === 'bottom-left' ? margin : position === 'top-right' || position === 'bottom-right' ? width - textWidth - margin : (width - textWidth) / 2;
        const y = position === 'top-left' || position === 'top-right' ? height - size - margin : position === 'bottom-left' || position === 'bottom-right' ? margin : (height - size) / 2;
        page.drawText(text, { x, y, size, font, color: rgb(0.2, 0.2, 0.2), opacity, rotate: degrees(rotation) });
      }
      const bytes = await pdf.save();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewBytesRef.current = bytes;
      previewUrlRef.current = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      setPreviewUrl(previewUrlRef.current);
      setError('');
    } catch { setError(isIndonesian ? 'Watermark tidak dapat ditambahkan ke PDF. Silakan coba lagi.' : 'Unable to add a watermark to this PDF. Please try again.'); } finally { setProcessing(false); }
  };

  const downloadPreview = () => {
    if (!previewBytesRef.current || !file) return;
    const url = URL.createObjectURL(new Blob([previewBytesRef.current], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `watermarked-${file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="space-y-6">
    <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Tambahkan watermark teks ke setiap halaman dan sesuaikan posisi, ukuran, rotasi, serta transparansinya.' : 'Add a text watermark to every page and customize its placement, size, rotation, and opacity.'}</p></div>
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950"><FileDropzone label={isIndonesian ? 'Unggah file PDF' : 'Upload PDF file'} accept="application/pdf" onFiles={(files) => { setFile(files[0] ?? null); previewBytesRef.current = null; if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); previewUrlRef.current = ''; setPreviewUrl(''); setError(''); }} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900 dark:text-white sm:col-span-2">{isIndonesian ? 'Teks watermark' : 'Watermark text'}<input value={text} onChange={(event) => setText(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
        <label className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Posisi' : 'Position'}<select value={position} onChange={(event) => setPosition(event.target.value as Position)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white">{Object.entries(positionLabels).map(([value, label]) => <option key={value} value={value}>{isIndonesian ? ({ 'top-left': 'Kiri atas', 'top-right': 'Kanan atas', center: 'Tengah', 'bottom-left': 'Kiri bawah', 'bottom-right': 'Kanan bawah' } as Record<string, string>)[value] : label}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Size: {size}px<input type="range" min="12" max="96" value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-3 w-full" /></label>
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Rotation: {rotation}°<input type="range" min="-180" max="180" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="mt-3 w-full" /></label>
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Opacity: {Math.round(opacity * 100)}%<input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="mt-3 w-full" /></label>
      </div>
      {error ? <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={addWatermark} disabled={!file || processing} className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">{processing ? (isIndonesian ? 'Membuat pratinjau...' : 'Preparing preview...') : (isIndonesian ? 'Tambahkan Watermark & Pratinjau' : 'Add Watermark & Preview')}</button><button type="button" onClick={downloadPreview} disabled={!previewBytesRef.current} className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Unduh PDF' : 'Download PDF'}</button></div>
    </div>
    {previewUrl ? <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Pratinjau PDF' : 'PDF preview'}</p><object data={previewUrl} type="application/pdf" title={isIndonesian ? 'Pratinjau PDF' : 'PDF preview'} className="mt-4 h-[480px] w-full rounded-3xl bg-white dark:bg-slate-950"><p className="p-6 text-sm text-slate-500 dark:text-slate-400">{isIndonesian ? 'Browser tidak mendukung pratinjau PDF.' : 'Your browser does not support PDF preview.'}</p></object></div> : null}
  </div>;
}