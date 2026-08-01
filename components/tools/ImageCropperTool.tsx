'use client';

import { useMemo, useState } from 'react';
import FileDropzone from '../FileDropzone';

export default function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(300);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = (files: File[]) => {
    const selectedFile = files[0] ?? null;
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setImageSrc('');
      return;
    }

    setError('');
    setFile(selectedFile);
    setImageSrc(URL.createObjectURL(selectedFile));
  };

  const cropImage = async () => {
    if (!file || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not load image'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sx = Math.max(0, image.naturalWidth / 2 - cropWidth / 2);
    const sy = Math.max(0, image.naturalHeight / 2 - cropHeight / 2);
    ctx.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const url = canvas.toDataURL('image/png');
    setPreviewUrl(url);
  };

  const downloadCrop = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `cropped-${file?.name.replace(/\.[^.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewDimensions = useMemo(() => `${cropWidth} x ${cropHeight}px`, [cropWidth, cropHeight]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Crop images to any custom size directly in the browser and download the cropped result without uploading it anywhere.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <FileDropzone label="Upload image file" accept="image/*" onFiles={handleUpload} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Width
                <input
                  type="number"
                  min={50}
                  max={2000}
                  value={cropWidth}
                  onChange={(event) => setCropWidth(Number(event.target.value))}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Height
                <input
                  type="number"
                  min={50}
                  max={2000}
                  value={cropHeight}
                  onChange={(event) => setCropHeight(Number(event.target.value))}
                  className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={cropImage}
              disabled={!file}
              className={`inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${file ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
            >
              Crop image
            </button>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Crop preview</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {previewUrl ? (
                <img src={previewUrl} alt="Cropped preview" className="h-full w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Crop result appears here after using the Crop button.</p>
              )}
            </div>
            <div className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dimensions</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{previewDimensions}</p>
              <button
                type="button"
                onClick={downloadCrop}
                disabled={!previewUrl}
                className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${previewUrl ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}
              >
                Download cropped image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
