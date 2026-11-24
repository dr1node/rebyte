'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type HashAlgorithm = (typeof algorithms)[number];
type HashResult = { algorithm: HashAlgorithm; value: string };
type Mode = 'generate' | 'verify';
type Source = 'text' | 'file';

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

async function digest(algorithm: HashAlgorithm, data: Uint8Array) {
  return toHex(await crypto.subtle.digest(algorithm, data));
}

export default function HashGeneratorTool() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<Mode>('generate');
  const [source, setSource] = useState<Source>('text');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<HashResult[]>([]);
  const [candidate, setCandidate] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [verifyAlgorithm, setVerifyAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [verification, setVerification] = useState<boolean | null>(null);
  const [copiedAlgorithm, setCopiedAlgorithm] = useState<HashAlgorithm | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const copy = language === 'id'
    ? {
        description: 'Buat hash SHA-1, SHA-256, SHA-384, atau SHA-512 dari teks maupun file langsung di browser. Hash bersifat satu arah dan tidak dapat dikembalikan menjadi teks asli; Anda dapat mencocokkan kandidat teks dengan hash yang diketahui.',
        generate: 'Buat hash',
        verify: 'Verifikasi hash',
        text: 'Teks',
        file: 'File',
        textLabel: 'Teks yang akan di-hash',
        fileLabel: 'Pilih file untuk di-hash',
        fileHint: 'File diproses di browser dan tidak diunggah.',
        removeFile: 'Hapus file',
        generateButton: 'Buat semua hash',
        generating: 'Membuat hash...',
        checking: 'Memeriksa...',
        results: 'Hasil hash',
        copy: 'Salin',
        copied: 'Tersalin',
        candidateLabel: 'Teks kandidat',
        expectedLabel: 'Hash pembanding',
        algorithmLabel: 'Algoritma hash',
        verifyButton: 'Cocokkan teks dan hash',
        match: 'Hash cocok dengan teks kandidat.',
        mismatch: 'Hash tidak cocok dengan teks kandidat.',
        invalidHash: 'Hash harus berupa nilai heksadesimal dengan panjang yang sesuai algoritma.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        hashError: 'Gagal membuat hash. Pastikan browser mendukung Web Crypto.',
        fileTooLarge: 'Ukuran file maksimum untuk pemrosesan lokal adalah 100 MB.',
        emptyFile: 'Pilih file terlebih dahulu.',
        emptyHash: 'Masukkan hash yang ingin dicocokkan.',
        allLocal: 'Semua pemrosesan dilakukan lokal di browser Anda.',
      }
    : {
        description: 'Generate SHA-1, SHA-256, SHA-384, or SHA-512 hashes from text or files directly in your browser. Hashes are one-way and cannot be converted back to the original text; you can compare a text candidate against a known hash.',
        generate: 'Generate hashes',
        verify: 'Verify a hash',
        text: 'Text',
        file: 'File',
        textLabel: 'Text to hash',
        fileLabel: 'Choose a file to hash',
        fileHint: 'The file is processed in your browser and never uploaded.',
        removeFile: 'Remove file',
        generateButton: 'Generate all hashes',
        generating: 'Generating hashes...',
        checking: 'Checking...',
        results: 'Hash results',
        copy: 'Copy',
        copied: 'Copied',
        candidateLabel: 'Candidate text',
        expectedLabel: 'Hash to compare',
        algorithmLabel: 'Hash algorithm',
        verifyButton: 'Compare text and hash',
        match: 'The hash matches the candidate text.',
        mismatch: 'The hash does not match the candidate text.',
        invalidHash: 'Hash must be a hexadecimal value with the correct length for the selected algorithm.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        hashError: 'Could not generate the hash. Make sure your browser supports Web Crypto.',
        fileTooLarge: 'The maximum file size for local processing is 100 MB.',
        emptyFile: 'Choose a file first.',
        emptyHash: 'Enter the hash you want to compare.',
        allLocal: 'All processing happens locally in your browser.',
      };

  const clearResults = () => {
    setResults([]);
    setVerification(null);
    setCopiedAlgorithm('');
    setError('');
  };

  const generateHashes = async () => {
    clearResults();
    if (source === 'file' && !file) {
      setError(copy.emptyFile);
      return;
    }
    if (file && file.size > 100 * 1024 * 1024) {
      setError(copy.fileTooLarge);
      return;
    }

    setLoading(true);
    try {
      const data = source === 'file' && file
        ? new Uint8Array(await file.arrayBuffer())
        : new TextEncoder().encode(input);
      const generated = await Promise.all(
        algorithms.map(async (algorithm) => ({
          algorithm,
          value: await digest(algorithm, data),
        })),
      );
      setResults(generated);
    } catch {
      setError(copy.hashError);
    } finally {
      setLoading(false);
    }
  };

  const verifyHash = async () => {
    clearResults();
    const normalizedHash = expectedHash.trim().toLowerCase();
    const expectedLength = { 'SHA-1': 40, 'SHA-256': 64, 'SHA-384': 96, 'SHA-512': 128 }[verifyAlgorithm];
    if (!normalizedHash) {
      setError(copy.emptyHash);
      return;
    }
    if (!new RegExp(`^[a-f0-9]{${expectedLength}}$`).test(normalizedHash)) {
      setError(copy.invalidHash);
      return;
    }

    setLoading(true);
    try {
      const candidateHash = await digest(verifyAlgorithm, new TextEncoder().encode(candidate));
      setVerification(candidateHash === normalizedHash);
    } catch {
      setError(copy.hashError);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = async (result: HashResult) => {
    try {
      await navigator.clipboard.writeText(result.value);
      setCopiedAlgorithm(result.algorithm);
      setError('');
      window.setTimeout(() => setCopiedAlgorithm(''), 1500);
    } catch {
      setError(copy.copyError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{copy.description}</p>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{copy.allLocal}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="flex flex-wrap gap-3">
          {(['generate', 'verify'] as const).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => {
                setMode(nextMode);
                clearResults();
              }}
              aria-pressed={mode === nextMode}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                mode === nextMode
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              {nextMode === 'generate' ? copy.generate : copy.verify}
            </button>
          ))}
        </div>

        {mode === 'generate' ? (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              {(['text', 'file'] as const).map((nextSource) => (
                <button
                  key={nextSource}
                  type="button"
                  onClick={() => {
                    setSource(nextSource);
                    setFile(null);
                    clearResults();
                  }}
                  aria-pressed={source === nextSource}
                  className={`rounded-3xl border px-4 py-2 text-sm font-medium transition ${
                    source === nextSource
                      ? 'border-sky-500 text-sky-700 dark:border-sky-400 dark:text-sky-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  {nextSource === 'text' ? copy.text : copy.file}
                </button>
              ))}
            </div>

            {source === 'text' ? (
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                {copy.textLabel}
                <textarea
                  rows={7}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    clearResults();
                  }}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <FileDropzone
                  label={copy.fileLabel}
                  hint={copy.fileHint}
                  onFiles={(files) => {
                    setFile(files[0] ?? null);
                    clearResults();
                  }}
                />
                {file ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
                    <span className="break-all text-slate-700 dark:text-slate-300">
                      {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        clearResults();
                      }}
                      className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300"
                    >
                      {copy.removeFile}
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <button
              type="button"
              onClick={generateHashes}
              disabled={loading || (source === 'file' && !file)}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? copy.generating : copy.generateButton}
            </button>

            {results.length > 0 ? (
              <section className="space-y-4" aria-live="polite">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{copy.results}</h3>
                {results.map((result) => (
                  <div key={result.algorithm} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.algorithm}</p>
                      <button
                        type="button"
                        onClick={() => void copyHash(result)}
                        className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
                      >
                        {copiedAlgorithm === result.algorithm ? copy.copied : copy.copy}
                      </button>
                    </div>
                    <p className="mt-3 break-all font-mono text-xs leading-6 text-slate-700 dark:text-slate-300">{result.value}</p>
                  </div>
                ))}
              </section>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              {copy.algorithmLabel}
              <select
                value={verifyAlgorithm}
                onChange={(event) => {
                  const selectedAlgorithm = algorithms.find((algorithm) => algorithm === event.target.value);
                  if (selectedAlgorithm) setVerifyAlgorithm(selectedAlgorithm);
                  setVerification(null);
                  setError('');
                }}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                {algorithms.map((algorithm) => <option key={algorithm} value={algorithm}>{algorithm}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              {copy.candidateLabel}
              <textarea
                rows={5}
                value={candidate}
                onChange={(event) => {
                  setCandidate(event.target.value);
                  setVerification(null);
                  setError('');
                }}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              {copy.expectedLabel}
              <textarea
                rows={3}
                value={expectedHash}
                onChange={(event) => {
                  setExpectedHash(event.target.value);
                  setVerification(null);
                  setError('');
                }}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <button
              type="button"
              onClick={verifyHash}
              disabled={loading}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? copy.checking : copy.verifyButton}
            </button>
            {verification !== null ? (
              <p
                role="status"
                className={`rounded-3xl border p-4 text-sm font-semibold ${
                  verification
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                }`}
              >
                {verification ? copy.match : copy.mismatch}
              </p>
            ) : null}
          </div>
        )}

        {error ? (
          <p role="alert" className="mt-5 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
