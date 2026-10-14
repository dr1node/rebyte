'use client';

import { useEffect, useState } from 'react';
import { Download, Volume2 } from 'lucide-react';
import FileDropzone from '../FileDropzone';
import { decodeAudioFile, encodeAudioAsMp3, encodeAudioAsWav } from '../../lib/audioUtils';
import { useLanguage } from '../../lib/LanguageContext';

type ProcessingMode = 'boost' | 'normalize';
type AudioFormat = 'wav' | 'mp3';

export default function AudioVolumeBoosterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [mode, setMode] = useState<ProcessingMode>('normalize');
  const [gainDb, setGainDb] = useState(6);
  const [format, setFormat] = useState<AudioFormat>('wav');
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

  const handleProcess = async () => {
    if (!audioBuffer || !file) return;
    setBusy(true);
    setError('');
    try {
      const context = new AudioContext();
      const processed = context.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
      let peak = 0;
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
        const source = audioBuffer.getChannelData(channel);
        for (let index = 0; index < source.length; index += 1) peak = Math.max(peak, Math.abs(source[index]));
      }
      const targetPeak = 10 ** (-1 / 20);
      const gain = mode === 'normalize'
        ? (peak > 0 ? targetPeak / peak : 1)
        : 10 ** (gainDb / 20);

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
        const source = audioBuffer.getChannelData(channel);
        const output = processed.getChannelData(channel);
        for (let index = 0; index < source.length; index += 1) {
          output[index] = Math.max(-1, Math.min(1, source[index] * gain));
        }
      }
      await context.close();

      const blob = format === 'mp3' ? await encodeAudioAsMp3(processed) : encodeAudioAsWav(processed);
      setOutputName(`${file.name.replace(/\.[^.]+$/, '')}-${mode}.${format}`);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (processingError) {
      const channelError = processingError instanceof Error && processingError.message.includes('mono or stereo');
      setError(channelError
        ? (isIndonesian ? 'Ekspor MP3 hanya mendukung audio mono atau stereo.' : 'MP3 export supports mono or stereo audio.')
        : (isIndonesian ? 'Audio tidak dapat diproses. Coba file lain.' : 'Unable to process this audio. Try another file.'));
    } finally {
      setBusy(false);
    }
  };

  const labels = isIndonesian
    ? { upload: 'Unggah audio', hint: 'Pilih file WAV atau MP3.', boost: 'Atur volume', normalize: 'Normalisasi peak', gain: 'Gain manual', target: 'Target peak: -1 dBFS', formats: 'Format ekspor', process: 'Proses audio', processing: 'Memproses…', download: 'Unduh hasil', local: 'Pemrosesan audio dilakukan di browser. Gain manual membatasi sinyal agar tidak melewati batas digital.' }
    : { upload: 'Upload audio', hint: 'Choose a WAV or MP3 file.', boost: 'Adjust volume', normalize: 'Peak normalize', gain: 'Manual gain', target: 'Peak target: -1 dBFS', formats: 'Export format', process: 'Process audio', processing: 'Processing…', download: 'Download result', local: 'Audio is processed in your browser. Manual gain limits the signal to prevent digital clipping.' };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.local}</p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.hint} accept=".wav,.mp3,audio/wav,audio/x-wav,audio/mpeg" onFiles={handleFiles} />
        {file ? <p className="mt-4 break-all text-sm text-slate-600 dark:text-slate-300">{file.name}</p> : null}

        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Mode pemrosesan' : 'Processing mode'}</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['boost', 'normalize'] as const).map((value) => (
              <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${mode === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}>
                {value === 'boost' ? labels.boost : labels.normalize}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-900">
          {mode === 'boost' ? (
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              <span className="flex items-center justify-between gap-3">{labels.gain}<span className="tabular-nums text-sky-700 dark:text-sky-300">{gainDb > 0 ? '+' : ''}{gainDb} dB</span></span>
              <input type="range" min="-12" max="18" step="1" value={gainDb} onChange={(event) => setGainDb(Number(event.target.value))} className="mt-4 w-full accent-sky-600" />
            </label>
          ) : <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.target}</p>}
        </div>

        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.formats}</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['wav', 'mp3'] as const).map((value) => (
              <button key={value} type="button" aria-pressed={format === value} onClick={() => setFormat(value)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${format === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}>
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" onClick={handleProcess} disabled={!audioBuffer || busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Volume2 className="h-4 w-4" aria-hidden="true" />{busy ? labels.processing : labels.process}
        </button>
        {outputUrl ? (
          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <audio controls src={outputUrl} className="w-full" />
            <a href={outputUrl} download={outputName} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              <Download className="h-4 w-4" aria-hidden="true" />{labels.download} ({format.toUpperCase()})
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}