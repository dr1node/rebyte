'use client';

import { useState } from 'react';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

type ConversionMode = 'text-to-binary' | 'binary-to-text';

export default function BinaryTranslatorTool() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<ConversionMode>('text-to-binary');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const isIndonesian = language === 'id';

  const handleModeChange = (nextMode: ConversionMode) => {
    setMode(nextMode);
    setInput('');
    setOutput('');
    setError('');
    setCopied(false);
  };

  const handleConvert = () => {
    setError('');
    setOutput('');
    setCopied(false);

    if (mode === 'text-to-binary') {
      const bytes = new TextEncoder().encode(input);
      setOutput(Array.from(bytes, (byte) => byte.toString(2).padStart(8, '0')).join(' '));
      return;
    }

    const bits = input.replace(/\s/g, '');
    if (!/^[01]*$/.test(bits)) {
      setError(isIndonesian ? 'Input hanya boleh berisi 0, 1, dan spasi.' : 'Input can contain only 0, 1, and whitespace.');
      return;
    }
    if (bits.length % 8 !== 0) {
      setError(isIndonesian ? 'Jumlah bit harus kelipatan 8.' : 'The number of bits must be a multiple of 8.');
      return;
    }

    const bytes = new Uint8Array(bits.length / 8);
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Number.parseInt(bits.slice(index * 8, index * 8 + 8), 2);
    }

    try {
      setOutput(new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes));
    } catch {
      setError(isIndonesian ? 'Byte tidak membentuk teks UTF-8 yang valid.' : 'These bytes do not form valid UTF-8 text.');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError('');
    } catch {
      setError(isIndonesian ? 'Tidak dapat menyalin. Periksa izin clipboard browser.' : 'Unable to copy. Check your browser clipboard permissions.');
    }
  };

  const labels = isIndonesian
    ? {
        textToBinary: 'Teks ke biner',
        binaryToText: 'Biner ke teks',
        inputText: mode === 'text-to-binary' ? 'Teks' : 'Biner',
        outputText: mode === 'text-to-binary' ? 'Hasil biner (UTF-8)' : 'Hasil teks (UTF-8)',
        textPlaceholder: 'Ketik atau tempel teks di sini',
        binaryPlaceholder: 'Contoh: 01001000 01101001',
        convert: 'Konversi',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        offlineNote: 'Konversi berjalan sepenuhnya di browser. Data tidak dikirim ke server.',
      }
    : {
        textToBinary: 'Text to binary',
        binaryToText: 'Binary to text',
        inputText: mode === 'text-to-binary' ? 'Text' : 'Binary',
        outputText: mode === 'text-to-binary' ? 'Binary output (UTF-8)' : 'Text output (UTF-8)',
        textPlaceholder: 'Type or paste text here',
        binaryPlaceholder: 'Example: 01001000 01101001',
        convert: 'Convert',
        copy: 'Copy result',
        copied: 'Copied',
        offlineNote: 'Conversion runs entirely in your browser. No data is sent to a server.',
      };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.offlineNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 grid grid-cols-2 gap-3" role="group" aria-label={isIndonesian ? 'Arah konversi' : 'Conversion direction'}>
          {(['text-to-binary', 'binary-to-text'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => handleModeChange(value)}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${mode === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
            >
              {value === 'text-to-binary' ? labels.textToBinary : labels.binaryToText}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white">
            {labels.inputText}
            <textarea
              rows={9}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setOutput('');
                setError('');
                setCopied(false);
              }}
              placeholder={mode === 'text-to-binary' ? labels.textPlaceholder : labels.binaryPlaceholder}
              spellCheck={false}
              className="mt-3 w-full resize-y rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm font-normal text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900 dark:text-white">
            {labels.outputText}
            <textarea
              rows={9}
              value={output}
              readOnly
              aria-live="polite"
              className="mt-3 w-full resize-y rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm font-normal text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleConvert}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            {labels.convert}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-sky-500"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      </div>
    </div>
  );
}