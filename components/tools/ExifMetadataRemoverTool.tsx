'use client';

import { useEffect, useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

export default function ExifMetadataRemoverTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { if (!file) { setSourceUrl(''); return; } const url = URL.createObjectURL(file); setSourceUrl(url); return () => URL.revokeObjectURL(url); }, [file]);

  const removeMetadata = async () => {
    if (!file || !sourceUrl) return;
    setProcessing(true); setError('');
    try {
      const image = new Image(); image.src = sourceUrl;
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Invalid image')); });
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
      context.drawImage(image, 0, 0);
      const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.95));
      if (!blob) throw new Error('Unable to encode image');
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `cleaned-${file.name.replace(/\.[^.]+$/, '')}.${type === 'image/png' ? 'png' : 'jpg'}`; link.click(); URL.revokeObjectURL(url);
    } catch { setError(isIndonesian ? 'Metadata gambar tidak dapat dihapus.' : 'Unable to remove image metadata.'); } finally { setProcessing(false); }
  };

  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Buat ulang gambar secara lokal untuk menghapus metadata EXIF sebelum dibagikan.' : 'Re-encode an image locally to remove EXIF metadata before sharing.'}</p></div><div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950"><FileDropzone label={isIndonesian ? 'Unggah gambar' : 'Upload image'} accept="image/*" onFiles={(files) => { setFile(files[0] ?? null); setError(''); }} />{sourceUrl ? <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900"><p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Metadata yang akan dihapus' : 'Metadata to be removed'}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{isIndonesian ? 'EXIF, profil kamera, orientasi, dan informasi tambahan akan dihapus dengan re-encode.' : 'EXIF, camera profile, orientation, and additional metadata will be removed by re-encoding.'}</p><img src={sourceUrl} alt="Uploaded preview" className="mt-4 max-h-64 w-full object-contain" /></div> : null}{error ? <p className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}<button type="button" onClick={removeMetadata} disabled={!file || processing} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{processing ? (isIndonesian ? 'Menghapus...' : 'Removing...') : (isIndonesian ? 'Hapus Metadata' : 'Remove Metadata')}</button></div></div>;
}