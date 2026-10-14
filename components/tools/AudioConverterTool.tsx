'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import FileDropzone from '../FileDropzone';
import { decodeAudioFile, encodeAudioAsMp3, encodeAudioAsWav } from '../../lib/audioUtils';
import { useLanguage } from '../../lib/LanguageContext';

type AudioFormat = 'wav' | 'mp3';

export default function AudioConverterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [outputUrl, setOutputUrl] = useState('');
  const [outputName, setOutputName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
    setOutputUrl('');
    try {
      setAudioBuffer(await decodeAudioFile(selectedFile));
    } catch {
      setFile(null);
      setError(isIndonesian ? 'File audio tidak dapat dibaca. Gunakan WAV atau MP3 yang valid.' : 'Unable to read this audio file. Use a valid WAV or MP3.');
    } finally {
      setBusy(false);
    }
  };

  const handleConvert = async () => {
    if (!file || !audioBuffer) return;
    setBusy(true);
    setError('');
    try {
      const blob = outputFormat === 'mp3' ? await encodeAudioAsMp3(audioBuffer) : encodeAudioAsWav(audioBuffer);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      setOutputName(`${baseName}.${outputFormat}`);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (conversionError) {
      const isChannelError = conversionError instanceof Error && conversionError.message.includes('mono or stereo');
      setError(isChannelError
        ? (isIndonesian ? 'Ekspor MP3 hanya mendukung audio mono atau stereo.' : 'MP3 export supports mono or stereo audio.')
        : (isIndonesian ? 'Konversi gagal. Coba file audio lain.' : 'Conversion failed. Try another audio file.'));
    } finally {
      setBusy(false);
    }
  };

  const labels = isIndonesian
    ? { upload: 'Unggah audio', hint: 'Pilih file WAV atau MP3.', formats: 'Format output', convert: 'Konversi audio', converting: 'Mengonversi…', download: 'Unduh hasil', local: 'Audio diproses di browser; file tidak diunggah ke server.' }
    : { upload: 'Upload audio', hint: 'Choose a WAV or MP3 file.', formats: 'Output format', convert: 'Convert audio', converting: 'Converting…', download: 'Download result', local: 'Audio is processed in your browser; files are not uploaded to a server.' };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.local}</p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.hint} accept=".wav,.mp3,audio/wav,audio/x-wav,audio/mpeg" onFiles={handleFiles} />
        {file ? <p className="mt-4 break-all text-sm text-slate-600 dark:text-slate-300">{file.name}</p> : null}

        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.formats}</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['wav', 'mp3'] as const).map((format) => (
              <button key={format} type="button" aria-pressed={outputFormat === format} onClick={() => setOutputFormat(format)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${outputFormat === format ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}>
                {format}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" onClick={handleConvert} disabled={!audioBuffer || busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />{busy ? labels.converting : labels.convert}
        </button>
        {outputUrl ? (
          <a href={outputUrl} download={outputName} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
            <Download className="h-4 w-4" aria-hidden="true" />{labels.download} ({outputFormat.toUpperCase()})
          </a>
        ) : null}
      </div>
    </div>
  );
}