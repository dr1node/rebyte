'use client';

import { useEffect, useState } from 'react';
import FileDropzone from '../FileDropzone';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'webp'>('jpeg');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setImageSrc('');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleUpload = (files: File[]) => {
    const selectedFile = files[0] ?? null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDownload = async () => {
    if (!file || !imageSrc) return;
    setLoading(true);

    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not load image'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const mimeType = outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Unable to compress the image. Please try another file.');
            setLoading(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `compressed-${file.name.replace(/\.[^.]+$/, '')}.${outputFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setLoading(false);
        },
        mimeType,
        quality
      );
    } catch (err) {
      setError('Unable to compress the image. Please try again with a different file.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Reduce image size and preserve quality with browser-based compression. Choose JPEG or WebP output for smaller downloads.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <FileDropzone label="Upload image file" accept="image/*" onFiles={handleUpload} />

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Output format</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {['jpeg', 'webp'].map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setOutputFormat(format as 'jpeg' | 'webp')}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${outputFormat === format ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Quality</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{Math.round(quality * 100)}%</p>
              </div>
              <input
                type="range"
                min={0.3}
                max={1}
                step={0.01}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-4 w-full"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {imageSrc ? (
                <img src={imageSrc} alt="Uploaded preview" className="h-full w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload an image to preview it here.</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!file || loading}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              {loading ? 'Compressing…' : 'Download compressed image'}
            </button>
          </div>
        </div>

        {file ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Original size</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{formatBytes(file.size)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Estimated output</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{formatBytes(Math.max(Math.round(file.size * quality), 1024))}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
