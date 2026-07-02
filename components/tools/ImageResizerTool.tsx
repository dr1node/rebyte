'use client';

import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';

export default function ImageResizerTool() {
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [imageSrc, setImageSrc] = useState('https://via.placeholder.com/800x600');
  const [imageName, setImageName] = useState('image.png');
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(800);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(600);

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setError('');
    setImageSrc(objectUrl);
    setImageName(file.name);
    setFileUrl(objectUrl);
  };

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    const widthValue = target.naturalWidth;
    const heightValue = target.naturalHeight;

    setNaturalWidth(widthValue);
    setNaturalHeight(heightValue);
    setWidth(String(widthValue));
    setHeight(String(heightValue));
  };

  const downloadImage = async () => {
    try {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = Number(width) || image.naturalWidth;
      canvas.height = Number(height) || image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resized-${imageName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      setError('Unable to resize and download the image. Please try another file.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload Image</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Use any photo file from your device.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Select file
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          </div>
          {imageName ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Selected: {imageName}</p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Width</span>
            <input
              type="number"
              value={width}
              onChange={(event) => setWidth(event.target.value)}
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
            />
          </label>
          <label className="space-y-3">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Height</span>
            <input
              type="number"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p>
      ) : null}

      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Original: {naturalWidth} x {naturalHeight} px
            </p>
          </div>
          <button
            type="button"
            onClick={downloadImage}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Download Resized Image
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-3xl bg-white dark:bg-slate-800">
          <img
            src={imageSrc}
            onLoad={handleImageLoad}
            alt="Resized preview"
            className="block object-contain"
            style={{
              width: `${Number(width) || naturalWidth}px`,
              height: `${Number(height) || naturalHeight}px`,
              maxWidth: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
