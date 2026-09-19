'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { copyToClipboard } from '../../lib/browserUtils';

type MetadataEntry = { label: string; value: string };

const readExif = async (file: File): Promise<MetadataEntry[]> => {
  const entries: MetadataEntry[] = [];
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = imageUrl;
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Invalid image')); });
    entries.push({ label: 'Dimensions', value: `${image.naturalWidth} x ${image.naturalHeight} px` });
  } finally { URL.revokeObjectURL(imageUrl); }

  entries.push({ label: 'File type', value: file.type || 'Unknown' }, { label: 'File size', value: `${(file.size / 1024).toFixed(1)} KB` });
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') return entries;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer);
  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) { offset += 1; continue; }
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2, false);
    if (marker === 0xe1 && view.getUint32(offset + 4, false) === 0x45786966) {
      const tiff = offset + 10;
      const little = view.getUint16(tiff, false) === 0x4949;
      const read16 = (position: number) => view.getUint16(position, little);
      const read32 = (position: number) => view.getUint32(position, little);
      const typeSizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
      const names: Record<number, string> = { 0x010f: 'Camera make', 0x0110: 'Camera model', 0x0112: 'Orientation', 0x0132: 'Date modified', 0x9003: 'Date taken', 0x011a: 'X resolution', 0x011b: 'Y resolution' };
      const ifd = tiff + read32(tiff + 4);
      const count = read16(ifd);
      for (let index = 0; index < count; index += 1) {
        const entry = ifd + 2 + index * 12;
        const tag = read16(entry);
        if (!names[tag]) continue;
        const type = read16(entry + 2);
        const amount = read32(entry + 4);
        const size = (typeSizes[type] ?? 1) * amount;
        const valueOffset = size <= 4 ? entry + 8 : tiff + read32(entry + 8);
        let value = '';
        if (type === 2) { for (let position = 0; position < amount - 1; position += 1) value += String.fromCharCode(view.getUint8(valueOffset + position)); }
        else if (type === 3) value = String(read16(valueOffset));
        else if (type === 4) value = String(read32(valueOffset));
        else value = `EXIF type ${type}`;
        if (value) entries.push({ label: names[tag], value });
      }
      break;
    }
    offset += Math.max(length, 2);
  }
  return entries;
};

export default function ExifMetadataViewerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [entries, setEntries] = useState<MetadataEntry[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true); setError(''); setFileName(file.name);
    try { setEntries(await readExif(file)); } catch { setEntries([]); setError(isIndonesian ? 'Metadata gambar tidak dapat dibaca.' : 'Unable to read image metadata.'); } finally { setLoading(false); }
  };

  const copyValue = async (value: string) => { await copyToClipboard(value); };
  return <div className="space-y-6"><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm text-slate-700 dark:text-slate-300">{isIndonesian ? 'Lihat metadata gambar secara lokal tanpa mengunggahnya ke server.' : 'View image metadata locally without uploading it to a server.'}</p></div><div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950"><FileDropzone label={isIndonesian ? 'Unggah gambar' : 'Upload image'} accept="image/*" onFiles={handleUpload} />{error ? <p className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}{fileName ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{fileName}</p> : null}{loading ? <p className="mt-6 text-sm text-slate-500">{isIndonesian ? 'Mendeteksi metadata...' : 'Detecting metadata...'}</p> : null}{entries.length ? <div className="mt-6 space-y-3">{entries.map((entry) => <div key={entry.label} className="flex flex-col gap-2 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-900"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.label}</p><p className="mt-1 break-all text-sm text-slate-900 dark:text-slate-100">{entry.value}</p></div><button type="button" onClick={() => copyValue(entry.value)} className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">{isIndonesian ? 'Salin' : 'Copy'}</button></div>)}</div> : null}</div></div>;
}