'use client';

import { useEffect, useState } from 'react';
import { Download, Save } from 'lucide-react';
import { ID3Writer } from 'browser-id3-writer';
import { read } from 'jsmediatags/dist/jsmediatags.min.js';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

type MetadataFields = {
  title: string;
  artist: string;
  album: string;
  year: string;
  track: string;
  genre: string;
  comment: string;
};

type CoverArt = { bytes: Uint8Array; format: string } | null;

const emptyMetadata: MetadataFields = { title: '', artist: '', album: '', year: '', track: '', genre: '', comment: '' };

export default function Mp3MetadataEditorTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetadataFields>(emptyMetadata);
  const [coverArt, setCoverArt] = useState<CoverArt>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const [outputName, setOutputName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const handleFiles = (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setMetadata(emptyMetadata);
    setCoverArt(null);
    setOutputUrl('');
    setError('');
    setNotice('');
    setBusy(true);

    read(selectedFile, {
      onSuccess: ({ tags }) => {
        setMetadata({
          title: tags.title ?? '',
          artist: tags.artist ?? '',
          album: tags.album ?? '',
          year: tags.year ?? '',
          track: tags.track ?? '',
          genre: tags.genre ?? '',
          comment: tags.comment ?? '',
        });
        if (tags.picture) {
          setCoverArt({ bytes: new Uint8Array(tags.picture.data), format: tags.picture.format });
        }
        setNotice(isIndonesian ? 'Metadata yang terbaca telah dimuat.' : 'Readable metadata has been loaded.');
        setBusy(false);
      },
      onError: () => {
        setNotice(isIndonesian ? 'Tag lama tidak terbaca. Anda tetap dapat mengisi metadata baru.' : 'Existing tags could not be read. You can still add new metadata.');
        setBusy(false);
      },
    });
  };

  const updateField = (field: keyof MetadataFields, value: string) => {
    setMetadata((current) => ({ ...current, [field]: value }));
    setOutputUrl('');
  };

  const handleSave = async () => {
    if (!file) return;
    if (metadata.year && !/^\d{4}$/.test(metadata.year)) {
      setError(isIndonesian ? 'Tahun harus terdiri dari empat angka.' : 'Year must contain four digits.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const writer = new ID3Writer(await file.arrayBuffer());
      if (metadata.title.trim()) writer.setFrame('TIT2', metadata.title.trim());
      if (metadata.artist.trim()) writer.setFrame('TPE1', [metadata.artist.trim()]);
      if (metadata.album.trim()) writer.setFrame('TALB', metadata.album.trim());
      if (metadata.year) writer.setFrame('TYER', Number(metadata.year));
      if (metadata.track.trim()) writer.setFrame('TRCK', metadata.track.trim());
      if (metadata.genre.trim()) writer.setFrame('TCON', [metadata.genre.trim()]);
      if (metadata.comment.trim()) writer.setFrame('COMM', { description: '', language: 'eng', text: metadata.comment.trim() });
      if (coverArt) {
        writer.setFrame('APIC', { type: 3, data: coverArt.bytes.buffer, description: 'Cover' });
      }
      writer.addTag();
      const blob = writer.getBlob();
      const baseName = file.name.replace(/\.mp3$/i, '');
      setOutputName(`${baseName}-tagged.mp3`);
      setOutputUrl(URL.createObjectURL(blob));
      setNotice(isIndonesian ? 'Tag ID3 berhasil diperbarui di browser.' : 'ID3 tags updated in your browser.');
    } catch {
      setError(isIndonesian ? 'Metadata tidak dapat disimpan. Pastikan file MP3 valid.' : 'Unable to save metadata. Make sure the MP3 file is valid.');
    } finally {
      setBusy(false);
    }
  };

  const labels = isIndonesian
    ? { upload: 'Unggah MP3', hint: 'Pilih file MP3 untuk membaca atau mengedit tag ID3.', title: 'Judul', artist: 'Artis', album: 'Album', year: 'Tahun', track: 'Nomor track', genre: 'Genre', comment: 'Komentar', save: 'Simpan metadata', saving: 'Menyimpan…', download: 'Unduh MP3 bertag', preview: 'Pratinjau file', local: 'Tag ID3 diperbarui di browser. Audio Anda tidak diunggah.' }
    : { upload: 'Upload MP3', hint: 'Choose an MP3 file to read or edit its ID3 tags.', title: 'Title', artist: 'Artist', album: 'Album', year: 'Year', track: 'Track number', genre: 'Genre', comment: 'Comment', save: 'Save metadata', saving: 'Saving…', download: 'Download tagged MP3', preview: 'File preview', local: 'ID3 tags are updated in your browser. Your audio is not uploaded.' };

  const fields: { key: keyof MetadataFields; label: string; type?: string }[] = [
    { key: 'title', label: labels.title },
    { key: 'artist', label: labels.artist },
    { key: 'album', label: labels.album },
    { key: 'year', label: labels.year, type: 'text' },
    { key: 'track', label: labels.track },
    { key: 'genre', label: labels.genre },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.local}</p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.hint} accept=".mp3,audio/mpeg" onFiles={handleFiles} />
        {file ? <p className="mt-4 break-all text-sm text-slate-600 dark:text-slate-300">{labels.preview}: {file.name}</p> : null}
        {file ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map(({ key, label, type }) => (
              <label key={key} className="text-sm font-semibold text-slate-900 dark:text-white">
                {label}
                <input type={type ?? 'text'} inputMode={key === 'year' ? 'numeric' : undefined} maxLength={key === 'year' ? 4 : undefined} value={metadata[key]} onChange={(event) => updateField(key, event.target.value)} disabled={busy} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
              </label>
            ))}
            <label className="text-sm font-semibold text-slate-900 dark:text-white sm:col-span-2">
              {labels.comment}
              <textarea rows={3} value={metadata.comment} onChange={(event) => updateField('comment', event.target.value)} disabled={busy} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
            </label>
          </div>
        ) : null}
        {notice ? <p role="status" className="mt-4 text-sm text-slate-600 dark:text-slate-300">{notice}</p> : null}
        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" onClick={handleSave} disabled={!file || busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Save className="h-4 w-4" aria-hidden="true" />{busy ? labels.saving : labels.save}
        </button>
        {outputUrl ? <a href={outputUrl} download={outputName} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"><Download className="h-4 w-4" aria-hidden="true" />{labels.download}</a> : null}
      </div>
    </div>
  );
}