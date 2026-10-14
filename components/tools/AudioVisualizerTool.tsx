'use client';

import { useEffect, useRef, useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

export default function AudioVisualizerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    if (contextRef.current && contextRef.current.state !== 'closed') void contextRef.current.close();
  }, []);

  const handleFiles = (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    setFileName(selectedFile.name);
    setAudioUrl(URL.createObjectURL(selectedFile));
  };

  const drawFrame = () => {
    const analyser = analyserRef.current;
    const waveformCanvas = waveformRef.current;
    const spectrumCanvas = spectrumRef.current;
    if (!analyser || !waveformCanvas || !spectrumCanvas) return;

    const deviceScale = window.devicePixelRatio || 1;
    const drawWaveform = (canvas: HTMLCanvasElement) => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      if (canvas.width !== Math.floor(width * deviceScale) || canvas.height !== Math.floor(height * deviceScale)) {
        canvas.width = Math.floor(width * deviceScale);
        canvas.height = Math.floor(height * deviceScale);
      }
      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) return;
      canvasContext.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      canvasContext.fillStyle = '#101820';
      canvasContext.fillRect(0, 0, width, height);
      const samples = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(samples);
      canvasContext.beginPath();
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = '#6ee7b7';
      samples.forEach((sample, index) => {
        const x = (index / (samples.length - 1)) * width;
        const y = (sample / 255) * height;
        if (index === 0) canvasContext.moveTo(x, y);
        else canvasContext.lineTo(x, y);
      });
      canvasContext.stroke();
    };

    drawWaveform(waveformCanvas);
    const width = Math.max(1, spectrumCanvas.clientWidth);
    const height = Math.max(1, spectrumCanvas.clientHeight);
    if (spectrumCanvas.width !== Math.floor(width * deviceScale) || spectrumCanvas.height !== Math.floor(height * deviceScale)) {
      spectrumCanvas.width = Math.floor(width * deviceScale);
      spectrumCanvas.height = Math.floor(height * deviceScale);
    }
    const spectrumContext = spectrumCanvas.getContext('2d');
    if (spectrumContext) {
      spectrumContext.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      spectrumContext.fillStyle = '#101820';
      spectrumContext.fillRect(0, 0, width, height);
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencies);
      const barCount = 72;
      const barWidth = width / barCount;
      for (let index = 0; index < barCount; index += 1) {
        const sampleIndex = Math.floor((index / barCount) * frequencies.length);
        const barHeight = (frequencies[sampleIndex] / 255) * (height - 8);
        const hue = 155 - (index / barCount) * 125;
        spectrumContext.fillStyle = `hsl(${hue} 78% 62%)`;
        spectrumContext.fillRect(index * barWidth + 1, height - barHeight, Math.max(1, barWidth - 2), barHeight);
      }
    }

    animationRef.current = requestAnimationFrame(drawFrame);
  };

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!contextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      contextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }

    await contextRef.current.resume();
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    drawFrame();
  };

  const handlePause = () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  };

  const labels = isIndonesian
    ? { upload: 'Unggah audio', hint: 'Pilih file WAV atau MP3 untuk divisualisasikan.', player: 'Pemutar audio', waveform: 'Waveform', spectrum: 'Spektrum frekuensi', waiting: 'Putar audio untuk melihat visualisasi real-time.' }
    : { upload: 'Upload audio', hint: 'Choose a WAV or MP3 file to visualize.', player: 'Audio player', waveform: 'Waveform', spectrum: 'Frequency spectrum', waiting: 'Play the audio to see live visualizations.' };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          {isIndonesian ? 'Pilih file audio lalu putar untuk melihat gelombang dan spektrum frekuensi yang merespons suara secara langsung.' : 'Choose an audio file and play it to see wave and frequency views respond to the sound in real time.'}
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.hint} accept=".wav,.mp3,audio/wav,audio/x-wav,audio/mpeg" onFiles={handleFiles} />
        {fileName ? <p className="mt-4 break-all text-sm font-semibold text-slate-900 dark:text-white">{fileName}</p> : null}
        {audioUrl ? (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.player}</p>
            <audio ref={audioRef} controls src={audioUrl} onPlay={handlePlay} onPause={handlePause} onEnded={handlePause} className="w-full" />
          </div>
        ) : null}
        <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">{labels.waveform}</p>
        <canvas ref={waveformRef} role="img" aria-label={labels.waveform} className="mt-3 h-32 w-full rounded-2xl bg-[#101820]" />
        <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">{labels.spectrum}</p>
        <canvas ref={spectrumRef} role="img" aria-label={labels.spectrum} className="mt-3 h-40 w-full rounded-2xl bg-[#101820]" />
        {!audioUrl ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{labels.waiting}</p> : null}
      </div>
    </div>
  );
}