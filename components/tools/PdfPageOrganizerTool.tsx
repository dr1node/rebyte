'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

type PageItem = { id: number; sourceIndex: number; rotation: number };

const downloadPdf = (bytes: Uint8Array, name: string) => {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

export default function PdfPageOrganizerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pages, setPages] = useState<PageItem[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const previewBytesRef = useRef<Uint8Array | null>(null);
  const previewUrlRef = useRef('');

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleUpload = async (files: File[]) => {
    const selected = files[0] ?? null;
    if (!selected) return;
    try {
      const pdf = await PDFDocument.load(await selected.arrayBuffer());
      setFile(selected);
      setPages(pdf.getPageIndices().map((sourceIndex) => ({ id: sourceIndex, sourceIndex, rotation: 0 })));
      previewBytesRef.current = null;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
      setPreviewUrl('');
      setError('');
    } catch {
      setFile(null);
      setPages([]);
      setError(isIndonesian ? 'PDF tidak dapat dibaca. Silakan pilih file lain.' : 'Unable to read this PDF. Please choose another file.');
    }
  };

  const updatePage = (id: number, action: 'rotate' | 'duplicate' | 'delete') => {
    setPages((current) => {
      const index = current.findIndex((page) => page.id === id);
      if (index < 0) return current;
      if (action === 'rotate') return current.map((page) => page.id === id ? { ...page, rotation: (page.rotation + 90) % 360 } : page);
      if (action === 'delete') return current.length > 1 ? current.filter((page) => page.id !== id) : current;
      const copy = { ...current[index], id: Math.max(...current.map((page) => page.id), -1) + 1 };
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
  };

  const movePage = (fromId: number, toId: number) => {
    setPages((current) => {
      const from = current.findIndex((page) => page.id === fromId);
      const to = current.findIndex((page) => page.id === toId);
      if (from < 0 || to < 0 || from === to) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const previewPdf = async () => {
    if (!file || !pages.length) return;
    setProcessing(true);
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const output = await PDFDocument.create();
      for (const item of pages) {
        const [page] = await output.copyPages(source, [item.sourceIndex]);
        page.setRotation(degrees(page.getRotation().angle + item.rotation));
        output.addPage(page);
      }
      const bytes = await output.save();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewBytesRef.current = bytes;
      previewUrlRef.current = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      setPreviewUrl(previewUrlRef.current);
      setError('');
    } catch {
      setError(isIndonesian ? 'PDF yang sudah diatur tidak dapat diekspor. Silakan coba lagi.' : 'Unable to export the organized PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadPreview = () => {
    if (!previewBytesRef.current || !file) return;
    downloadPdf(previewBytesRef.current, `organized-${file.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Atur halaman PDF secara lokal dengan menyeret, memutar, menggandakan, atau menghapus halaman.' : 'Arrange PDF pages locally by dragging them, rotating, duplicating, or deleting pages.'}</p></div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={isIndonesian ? 'Unggah file PDF' : 'Upload PDF file'} accept="application/pdf" onFiles={handleUpload} />
        {error ? <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        {pages.length ? <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, index) => <div key={page.id} draggable onDragStart={() => setDraggedId(page.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId !== null) movePage(draggedId, page.id); setDraggedId(null); }} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex min-h-28 items-center justify-center rounded-3xl bg-white text-3xl font-semibold text-slate-300 dark:bg-slate-950 dark:text-slate-700" style={{ transform: `rotate(${page.rotation}deg)` }}>{index + 1}</div>
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Halaman' : 'Page'} {index + 1}</p>
              <div className="mt-3 grid grid-cols-3 gap-2"><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); updatePage(page.id, 'rotate'); }} className="rounded-3xl bg-white px-2 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">{isIndonesian ? 'Putar' : 'Rotate'}</button><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); updatePage(page.id, 'duplicate'); }} className="rounded-3xl bg-white px-2 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">{isIndonesian ? 'Gandakan' : 'Duplicate'}</button><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); updatePage(page.id, 'delete'); }} disabled={pages.length === 1} className="rounded-3xl bg-white px-2 py-2 text-xs font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-950">{isIndonesian ? 'Hapus' : 'Delete'}</button></div>
            </div>)}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={previewPdf} disabled={processing} className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">{processing ? (isIndonesian ? 'Membuat pratinjau...' : 'Preparing preview...') : (isIndonesian ? 'Pratinjau' : 'Preview')}</button><button type="button" onClick={downloadPreview} disabled={!previewBytesRef.current} className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{isIndonesian ? 'Unduh PDF' : 'Download PDF'}</button></div>
        </> : <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{isIndonesian ? 'Unggah PDF untuk mengatur halamannya.' : 'Upload a PDF to organize its pages.'}</p>}
      </div>
      {previewUrl ? <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Pratinjau PDF' : 'PDF preview'}</p><object data={previewUrl} type="application/pdf" title={isIndonesian ? 'Pratinjau PDF' : 'PDF preview'} className="mt-4 h-[480px] w-full rounded-3xl bg-white dark:bg-slate-950"><p className="p-6 text-sm text-slate-500 dark:text-slate-400">{isIndonesian ? 'Browser tidak mendukung pratinjau PDF.' : 'Your browser does not support PDF preview.'}</p></object></div> : null}
    </div>
  );
}