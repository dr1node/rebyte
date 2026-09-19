'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

type Metadata = { title: string; author: string; subject: string; creator: string; producer: string; keywords: string[] };

const emptyMetadata: Metadata = { title: '', author: '', subject: '', creator: '', producer: '', keywords: [] };

export default function PdfMetadataRemoverTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Metadata>(emptyMetadata);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (files: File[]) => {
    const selected = files[0] ?? null;
    if (!selected) return;
    try {
      const pdf = await PDFDocument.load(await selected.arrayBuffer());
      setFile(selected);
      setMetadata({ title: pdf.getTitle() ?? '', author: pdf.getAuthor() ?? '', subject: pdf.getSubject() ?? '', creator: pdf.getCreator() ?? '', producer: pdf.getProducer() ?? '', keywords: (pdf.getKeywords() ?? '').split(',').map((keyword) => keyword.trim()).filter(Boolean) });
      setError('');
    } catch { setFile(null); setMetadata(emptyMetadata); setError(isIndonesian ? 'PDF tidak dapat dibaca. Silakan pilih file lain.' : 'Unable to read this PDF. Please choose another file.'); }
  };

  const removeMetadata = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setCreator(''); pdf.setProducer(''); pdf.setKeywords([]);
      const bytes = await pdf.save();
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.download = `cleaned-${file.name}`; link.click(); URL.revokeObjectURL(url);
      setError('');
    } catch { setError(isIndonesian ? 'Metadata PDF tidak dapat dihapus. Silakan coba lagi.' : 'Unable to remove metadata from this PDF. Please try again.'); } finally { setProcessing(false); }
  };

  const fields: Array<[keyof Metadata, string]> = [['title', isIndonesian ? 'Judul' : 'Title'], ['author', 'Author'], ['subject', 'Subject'], ['creator', 'Creator'], ['producer', 'Producer']];
  return <div className="space-y-6">
    <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Periksa dan hapus metadata dokumen PDF secara lokal tanpa mengunggah file.' : 'Inspect and clear common PDF document metadata locally without uploading the file.'}</p></div>
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
      <FileDropzone label={isIndonesian ? 'Unggah file PDF' : 'Upload PDF file'} accept="application/pdf" onFiles={handleUpload} />
      {error ? <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
      {file ? <div className="mt-6"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Metadata terdeteksi' : 'Detected metadata'}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{fields.map(([key, label]) => <div key={key} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 break-words text-sm text-slate-900 dark:text-slate-100">{metadata[key] || (isIndonesian ? 'Tidak ada' : 'Not set')}</p></div>)}<div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Keywords</p><p className="mt-2 break-words text-sm text-slate-900 dark:text-slate-100">{metadata.keywords.join(', ') || (isIndonesian ? 'Tidak ada' : 'Not set')}</p></div></div><button type="button" onClick={removeMetadata} disabled={processing} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">{processing ? (isIndonesian ? 'Menghapus...' : 'Removing...') : (isIndonesian ? 'Hapus Metadata' : 'Remove Metadata')}</button></div> : <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{isIndonesian ? 'Unggah PDF untuk memeriksa metadatanya.' : 'Upload a PDF to review its metadata.'}</p>}
    </div>
  </div>;
}