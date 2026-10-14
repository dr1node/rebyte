'use client';

import { useEffect, useState } from 'react';
import { Download, Scissors } from 'lucide-react';
import FileDropzone from '../FileDropzone';
import { decodeAudioFile, encodeAudioAsMp3, formatAudioTime } from '../../lib/audioUtils';
import { useLanguage } from '../../lib/LanguageContext';

export default function Mp3CutterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState('0');
  const [endTime, setEndTime] = useState('0');
  const [sourceUrl, setSourceUrl] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputName, setOutputName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const handleFiles = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    setBusy(true);
    setError('');
    setFile(selectedFile);
    setAudioBuffer(null);
    setSourceUrl('');
    setOutputUrl('');

    try {
      const decoded = await decodeAudioFile(selectedFile);
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime('0');
      setEndTime(decoded.duration.toFixed(2));
      setSourceUrl(URL.createObjectURL(selectedFile));
    } catch {
      setFile(null);
      setError(isIndonesian ? 'File MP3 tidak dapat dibaca oleh browser ini.' : 'This MP3 file could not be decoded by your browser.');
    } finally {
      setBusy(false);
    }
  };

  const handleCut = async () => {
    const start = Number(startTime);
    const end = Number(endTime);
    if (!audioBuffer || !file) return;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start || end > duration) {
      setError(isIndonesian ? 'Pastikan waktu mulai dan selesai berada dalam durasi audio.' : 'Choose a valid start and end time within the audio duration.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const blob = await encodeAudioAsMp3(audioBuffer, start, end);
      setOutputName(`${file.name.replace(/\.mp3$/i, '')}-cut.mp3`);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (cutError) {
      const isChannelError = cutError instanceof Error && cutError.message.includes('mono or stereo');
      setError(isChannelError
        ? (isIndonesian ? 'Ekspor MP3 hanya mendukung audio mono atau stereo.' : 'MP3 export supports mono or stereo audio.')
        : (isIndonesian ? 'Audio tidak dapat dipotong. Coba file lain.' : 'Unable to cut this audio. Try another file.'));
    } finally {
      setBusy(false);
    }
  };

  const labels = isIndonesian
    ? { upload: 'Unggah MP3', hint: 'Pilih file MP3 untuk dipotong.', source: 'Audio sumber', start: 'Mulai (detik)', end: 'Selesai (detik)', duration: 'Durasi', cut: 'Potong MP3', cutting: 'Memproses…', result: 'Hasil potongan', download: 'Unduh MP3' }
    : { upload: 'Upload MP3', hint: 'Choose an MP3 file to trim.', source: 'Source audio', start: 'Start (seconds)', end: 'End (seconds)', duration: 'Duration', cut: 'Cut MP3', cutting: 'Processing…', result: 'Trimmed audio', download: 'Download MP3' };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          {isIndonesian ? 'Atur titik mulai dan selesai lalu ekspor potongan sebagai MP3. Seluruh pemrosesan dilakukan secara lokal.' : 'Set a start and end point, then export the selection as an MP3. Processing stays on your device.'}
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.hint} accept=".mp3,audio/mpeg" onFiles={handleFiles} />
        {file ? <p className="mt-4 break-all text-sm text-slate-600 dark:text-slate-300">{file.name}</p> : null}
        {sourceUrl ? (
          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">{labels.source}</span>
              <span className="text-slate-500 dark:text-slate-400">{labels.duration}: {formatAudioTime(duration)}</span>
            </div>
            <audio controls src={sourceUrl} className="w-full" />
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.start}
            <input type="number" min="0" max={duration} step="0.1" value={startTime} onChange={(event) => setStartTime(event.target.value)} disabled={!audioBuffer || busy} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.end}
            <input type="number" min="0" max={duration} step="0.1" value={endTime} onChange={(event) => setEndTime(event.target.value)} disabled={!audioBuffer || busy} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
        </div>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" onClick={handleCut} disabled={!audioBuffer || busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Scissors className="h-4 w-4" aria-hidden="true" />{busy ? labels.cutting : labels.cut}
        </button>
        {outputUrl ? (
          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.result}</p>
            <audio controls src={outputUrl} className="w-full" />
            <a href={outputUrl} download={outputName} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              <Download className="h-4 w-4" aria-hidden="true" />{labels.download}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}