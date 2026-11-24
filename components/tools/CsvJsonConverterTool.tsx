'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/downloadFile';

type Direction = 'csv-to-json' | 'json-to-csv';

function parseCsv(source: string): string[][] {
  const text = source.replace(/^\uFEFF/, '');
  if (!text) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let afterQuote = false;
  let recordStarted = false;

  const finishRow = () => {
    row.push(cell);
    rows.push(row);
    row = [];
    cell = '';
    afterQuote = false;
    recordStarted = false;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        cell += character;
      }
      recordStarted = true;
      continue;
    }

    if (afterQuote) {
      if (character === ',') {
        row.push(cell);
        cell = '';
        afterQuote = false;
        recordStarted = true;
      } else if (character === '\n' || character === '\r') {
        finishRow();
        if (character === '\r' && text[index + 1] === '\n') index += 1;
      } else {
        throw new Error('Invalid character after a quoted CSV field.');
      }
      continue;
    }

    if (character === '"') {
      if (cell.length > 0) throw new Error('Unexpected quote in an unquoted CSV field.');
      quoted = true;
      recordStarted = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
      recordStarted = true;
    } else if (character === '\n' || character === '\r') {
      finishRow();
      if (character === '\r' && text[index + 1] === '\n') index += 1;
    } else {
      cell += character;
      recordStarted = true;
    }
  }

  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  if (recordStarted || row.length > 0 || cell.length > 0 || afterQuote) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function csvToJson(source: string, hasHeaders: boolean) {
  const rows = parseCsv(source);
  if (!rows.length) return '[]';

  if (!hasHeaders) return JSON.stringify(rows, null, 2);

  const rawHeaders = rows[0];
  const counts = new Map<string, number>();
  const headers = rawHeaders.map((header, index) => {
    const base = header.trim() || `column_${index + 1}`;
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);
    return count === 1 ? base : `${base}_${count}`;
  });

  const records = rows.slice(1).map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])),
  );
  return JSON.stringify(records, null, 2);
}

function escapeCsv(value: unknown) {
  const text = value === null || value === undefined
    ? ''
    : typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function jsonToCsv(source: string) {
  const value: unknown = JSON.parse(source);
  if (!Array.isArray(value)) throw new Error('JSON input must be an array of objects.');
  if (value.length === 0) return '';
  if (value.some((item) => item === null || typeof item !== 'object' || Array.isArray(item))) {
    throw new Error('Each JSON array item must be an object.');
  }

  const headers = Array.from(new Set(value.flatMap((item) => Object.keys(item))));
  if (!headers.length) return '';

  return [
    headers.map(escapeCsv).join(','),
    ...value.map((item) => headers.map((header) => escapeCsv(item[header])).join(',')),
  ].join('\r\n');
}

export default function CsvJsonConverterTool() {
  const { language } = useLanguage();
  const [direction, setDirection] = useState<Direction>('csv-to-json');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const copy = language === 'id'
    ? {
        title: 'CSV ke JSON',
        reverse: 'JSON ke CSV',
        input: direction === 'csv-to-json' ? 'Input CSV' : 'Input JSON',
        output: direction === 'csv-to-json' ? 'Hasil JSON' : 'Hasil CSV',
        placeholder: direction === 'csv-to-json' ? 'Tempel data CSV di sini...' : 'Tempel array JSON di sini...',
        upload: direction === 'csv-to-json' ? 'Unggah file CSV' : 'Unggah file JSON',
        fileHint: 'File diproses lokal di browser (maksimum 10 MB).',
        hasHeaders: 'Baris pertama berisi nama kolom',
        convert: 'Konversi',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        download: 'Unduh hasil',
        removeFile: 'Hapus file',
        emptyInput: 'Masukkan data atau pilih file terlebih dahulu.',
        fileTooLarge: 'Ukuran file maksimum adalah 10 MB.',
        invalidFile: 'Tidak dapat membaca file. Pastikan formatnya sesuai.',
        invalidCsv: 'CSV tidak valid. Periksa tanda kutip dan pemisah kolom.',
        invalidJson: 'JSON tidak valid. Periksa sintaks dan format datanya.',
        invalidShape: 'JSON harus berupa array yang berisi objek.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        downloadError: 'Tidak dapat menyiapkan file untuk diunduh.',
        localNote: 'Data tidak diunggah ke server; konversi dilakukan di perangkat Anda.',
      }
    : {
        title: 'CSV to JSON',
        reverse: 'JSON to CSV',
        input: direction === 'csv-to-json' ? 'CSV input' : 'JSON input',
        output: direction === 'csv-to-json' ? 'JSON output' : 'CSV output',
        placeholder: direction === 'csv-to-json' ? 'Paste CSV data here...' : 'Paste a JSON array here...',
        upload: direction === 'csv-to-json' ? 'Upload CSV file' : 'Upload JSON file',
        fileHint: 'Processed locally in your browser (up to 10 MB).',
        hasHeaders: 'First row contains column names',
        convert: 'Convert',
        copy: 'Copy result',
        copied: 'Copied',
        download: 'Download result',
        removeFile: 'Remove file',
        emptyInput: 'Enter data or choose a file first.',
        fileTooLarge: 'The maximum file size is 10 MB.',
        invalidFile: 'Unable to read the file. Check that its format is supported.',
        invalidCsv: 'Invalid CSV. Check the quotes and field separators.',
        invalidJson: 'Invalid JSON. Check the syntax and data format.',
        invalidShape: 'JSON input must be an array of objects.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        downloadError: 'Unable to prepare the download.',
        localNote: 'Data is not uploaded; conversion runs on your device.',
      };

  const handleDirectionChange = (nextDirection: Direction) => {
    setDirection(nextDirection);
    setInput('');
    setFile(null);
    setOutput('');
    setError('');
    setCopied(false);
  };

  const handleConvert = async () => {
    setError('');
    setOutput('');
    setCopied(false);
    if (file && file.size > 10 * 1024 * 1024) {
      setError(copy.fileTooLarge);
      return;
    }

    let source = input;
    if (file) {
      try {
        source = await file.text();
      } catch {
        setError(copy.invalidFile);
        return;
      }
    }
    if (!source && !file) {
      setError(copy.emptyInput);
      return;
    }

    try {
      setOutput(
        direction === 'csv-to-json'
          ? csvToJson(source, hasHeaders)
          : jsonToCsv(source),
      );
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '';
      if (direction === 'csv-to-json') setError(copy.invalidCsv);
      else if (message.includes('must be an array') || message.includes('must be an object')) setError(copy.invalidShape);
      else setError(copy.invalidJson);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError('');
    } catch {
      setError(copy.copyError);
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    try {
      const extension = direction === 'csv-to-json' ? 'json' : 'csv';
      const mimeType = extension === 'json' ? 'application/json' : 'text/csv;charset=utf-8';
      downloadBlob(new Blob([output], { type: mimeType }), `converted.${extension}`);
    } catch {
      setError(copy.downloadError);
    }
  };

  const accept = direction === 'csv-to-json'
    ? '.csv,text/csv,.txt,text/plain'
    : '.json,application/json,.txt,text/plain';

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{copy.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label={language === 'id' ? 'Arah konversi' : 'Conversion direction'}>
          {(['csv-to-json', 'json-to-csv'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleDirectionChange(value)}
              aria-pressed={direction === value}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                direction === value
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              {value === 'csv-to-json' ? copy.title : copy.reverse}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="csv-json-input" className="text-sm font-semibold text-slate-900 dark:text-white">{copy.input}</label>
              <FileDropzone
                accept={accept}
                label={copy.upload}
                hint={copy.fileHint}
                onFiles={(files) => {
                  setFile(files[0] ?? null);
                  setInput('');
                  setOutput('');
                  setError('');
                }}
              />
            </div>
            {file ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
                <span className="break-all text-slate-700 dark:text-slate-300">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="font-semibold text-sky-700 dark:text-sky-300">
                  {copy.removeFile}
                </button>
              </div>
            ) : null}
            <textarea
              id="csv-json-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setFile(null);
                setOutput('');
                setError('');
              }}
              rows={12}
              spellCheck={false}
              placeholder={copy.placeholder}
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
            />
            {direction === 'csv-to-json' ? (
              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasHeaders}
                  onChange={(event) => setHasHeaders(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                {copy.hasHeaders}
              </label>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{copy.output}</p>
              <button
                type="button"
                onClick={downloadOutput}
                disabled={!output}
                className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.download}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              aria-live="polite"
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              placeholder={copy.output}
            />
            <button
              type="button"
              onClick={() => void copyOutput()}
              disabled={!output}
              className="rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-sky-500"
            >
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => void handleConvert()} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            {copy.convert}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
