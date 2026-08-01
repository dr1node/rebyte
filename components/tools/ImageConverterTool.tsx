'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';

export default function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(0.92);

  const handleUpload = (files: File[]) => {
    const selectedFile = files[0] ?? null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setImageSrc('');
      setFileName('');
      return;
    }

    setFile(selectedFile);
    setImageSrc(URL.createObjectURL(selectedFile));
    setFileName(selectedFile.name);
    setError('');
  };

  const downloadImage = async () => {
    if (!file || !imageSrc) return;
    setLoading(true);

    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : `image/${outputFormat}`;
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Unable to convert the image. Please try again.');
          setLoading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
        link.download = `${fileName.replace(/\.[^.]+$/, '')}-converted.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setLoading(false);
      }, mimeType, quality);
    } catch (err) {
      setError('Unable to convert the image. Please try another file.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Convert any image file to PNG, JPG, or WebP directly in the browser without uploading it to a server.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label="Upload image file" accept="image/*" onFiles={handleUpload} />

        {fileName ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Selected file: {fileName}</p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Output format</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'png', label: 'PNG' },
                  { value: 'jpeg', label: 'JPG' },
                  { value: 'webp', label: 'WebP' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setOutputFormat(option.value as 'png' | 'jpeg' | 'webp')}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${outputFormat === option.value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">Quality</label>
              <input
                type="range"
                min={0.5}
                max={1}
                step={0.01}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600 dark:text-slate-300">Quality: {Math.round(quality * 100)}%</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <div className="mt-4 min-h-[240px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {imageSrc ? (
                <img src={imageSrc} alt="Image preview" className="h-full w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload an image file to preview it here.</p>
              )}
            </div>
            <button
              type="button"
              onClick={downloadImage}
              disabled={!file || loading}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {loading ? 'Converting…' : `Download ${outputFormat === 'jpeg' ? 'JPG' : outputFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
