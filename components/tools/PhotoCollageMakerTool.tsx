'use client';

import { useEffect, useRef, useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/downloadFile';

type Ratio = 'square' | 'landscape' | 'portrait';
type Fit = 'cover' | 'contain';
type Dimensions = { width: number; height: number };

const canvasDimensions: Record<Ratio, Dimensions> = {
  square: { width: 1200, height: 1200 },
  landscape: { width: 1600, height: 1200 },
  portrait: { width: 1200, height: 1600 },
};
const MAX_FILES = 12;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

export default function PhotoCollageMakerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [imagesReady, setImagesReady] = useState(false);
  const [ratio, setRatio] = useState<Ratio>('square');
  const [columns, setColumns] = useState<2 | 3>(2);
  const [fit, setFit] = useState<Fit>('cover');
  const [gap, setGap] = useState(16);
  const [background, setBackground] = useState('#ffffff');
  const [ready, setReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const dimensions = canvasDimensions[ratio];

  const labels = isIndonesian
    ? {
        description: 'Susun beberapa foto menjadi kolase. Pilih tata letak, jarak, dan warna latar, lalu unduh gambar PNG. Semua proses dilakukan di browser.',
        upload: 'Pilih foto untuk kolase',
        uploadHint: 'Pilih 2–12 gambar PNG, JPG, atau WebP (total maksimal 60 MB).',
        selected: 'Foto terpilih',
        remove: 'Hapus foto',
        layout: 'Bentuk kanvas',
        square: 'Persegi',
        landscape: 'Lanskap',
        portrait: 'Potret',
        columns: 'Kolom',
        fit: 'Cara menampilkan foto',
        cover: 'Penuhi kotak (potong tepi)',
        contain: 'Tampilkan seluruh foto',
        spacing: 'Jarak antar foto',
        background: 'Warna latar',
        preview: 'Pratinjau kolase',
        export: 'Unduh kolase PNG',
        exporting: 'Menyiapkan gambar...',
        needPhotos: 'Pilih setidaknya 2 foto untuk membuat kolase.',
        tooMany: 'Pilih maksimal 12 foto.',
        tooLarge: 'Ukuran gabungan foto maksimal 60 MB.',
        imageError: 'Salah satu foto tidak dapat dibuka. Coba format PNG, JPG, atau WebP.',
        canvasError: 'Browser tidak dapat membuat kolase. Coba kurangi jumlah foto.',
        exportError: 'Kolase tidak dapat diekspor. Coba lagi.',
        localNote: 'Foto tidak diunggah ke server.',
      }
    : {
        description: 'Arrange several photos into a collage. Choose a layout, spacing, and background color, then download a PNG. Everything runs in your browser.',
        upload: 'Choose photos for your collage',
        uploadHint: 'Select 2–12 PNG, JPG, or WebP images (up to 60 MB total).',
        selected: 'Selected photos',
        remove: 'Remove photo',
        layout: 'Canvas shape',
        square: 'Square',
        landscape: 'Landscape',
        portrait: 'Portrait',
        columns: 'Columns',
        fit: 'Image fitting',
        cover: 'Fill each cell (crop edges)',
        contain: 'Show each full photo',
        spacing: 'Spacing between photos',
        background: 'Background color',
        preview: 'Collage preview',
        export: 'Download collage PNG',
        exporting: 'Preparing image...',
        needPhotos: 'Choose at least 2 photos to create a collage.',
        tooMany: 'Choose no more than 12 photos.',
        tooLarge: 'The selected photos must total 60 MB or less.',
        imageError: 'One of the photos could not be opened. Try PNG, JPG, or WebP files.',
        canvasError: 'Your browser could not create the collage. Try using fewer photos.',
        exportError: 'Unable to export the collage. Please try again.',
        localNote: 'Photos are not uploaded to a server.',
      };

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];
    setImagesReady(false);

    if (!files.length) {
      imagesRef.current = [];
      return () => { active = false; };
    }

    const loadImage = (file: File) => new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image decode failed'));
      image.src = url;
    });

    const decodePhotos = async () => {
      try {
        const images = await Promise.all(files.map(loadImage));
        if (!active) return;
        imagesRef.current = images;
        setImagesReady(true);
      } catch (caughtError) {
        if (active) {
          console.error('Unable to build photo collage:', caughtError);
          imagesRef.current = [];
          setImagesReady(false);
          setReady(false);
          setError(labels.imageError);
        }
      }
    };

    void decodePhotos();
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, labels.imageError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const images = imagesRef.current;
    setReady(false);

    if (!canvas) return;
    if (!context) {
      setError(labels.canvasError);
      return;
    }
    if (!imagesReady || !images.length) {
      if (canvas && context) context.clearRect(0, 0, dimensions.width, dimensions.height);
      return;
    }

    try {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const columnCount = Math.min(columns, images.length);
      const rowCount = Math.ceil(images.length / columnCount);
      const cellWidth = (canvas.width - gap * (columnCount + 1)) / columnCount;
      const cellHeight = (canvas.height - gap * (rowCount + 1)) / rowCount;

      images.forEach((image, index) => {
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        const x = gap + column * (cellWidth + gap);
        const y = gap + row * (cellHeight + gap);
        const scale = fit === 'cover'
          ? Math.max(cellWidth / image.naturalWidth, cellHeight / image.naturalHeight)
          : Math.min(cellWidth / image.naturalWidth, cellHeight / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        const drawX = x + (cellWidth - drawWidth) / 2;
        const drawY = y + (cellHeight - drawHeight) / 2;

        context.save();
        context.beginPath();
        context.rect(x, y, cellWidth, cellHeight);
        context.clip();
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        context.restore();
      });

      setError('');
      setReady(true);
    } catch (caughtError) {
      console.error('Unable to draw photo collage:', caughtError);
      setReady(false);
      setError(labels.canvasError);
    }
  }, [background, columns, dimensions.height, dimensions.width, fit, gap, imagesReady, labels.canvasError]);

  const selectPhotos = (selected: File[]) => {
    if (selected.length < 2) {
      setError(labels.needPhotos);
      return;
    }
    if (selected.length > MAX_FILES) {
      setError(labels.tooMany);
      return;
    }
    if (selected.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      setError(labels.tooLarge);
      return;
    }
    setFiles(selected);
    setError('');
  };

  const removePhoto = (index: number) => {
    const next = files.filter((_, fileIndex) => fileIndex !== index);
    if (next.length < 2) {
      setFiles([]);
      setError(labels.needPhotos);
      return;
    }
    setFiles(next);
  };

  const downloadCollage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready || exporting) return;
    setExporting(true);
    try {
      canvas.toBlob((blob) => {
        setExporting(false);
        if (!blob) {
          setError(labels.exportError);
          return;
        }
        try {
          downloadBlob(blob, 'photo-collage.png');
          setError('');
        } catch (caughtError) {
          console.error('Unable to download photo collage:', caughtError);
          setError(labels.exportError);
        }
      }, 'image/png');
    } catch (caughtError) {
      console.error('Unable to export photo collage:', caughtError);
      setExporting(false);
      setError(labels.exportError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description} {labels.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.uploadHint} accept="image/png,image/jpeg,image/webp" multiple onFiles={selectPhotos} />

        {files.length ? <div className="mt-5">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.selected} ({files.length})</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, index) => <div key={`${file.name}-${index}`} className="flex max-w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="max-w-52 truncate text-slate-700 dark:text-slate-300">{file.name}</span>
              <button type="button" aria-label={`${labels.remove}: ${file.name}`} onClick={() => removePhoto(index)} className="rounded-full px-2 font-semibold text-rose-600 dark:text-rose-300">×</button>
            </div>)}
          </div>
        </div> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.layout}
            <select value={ratio} onChange={(event) => setRatio(event.target.value as Ratio)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <option value="square">{labels.square}</option><option value="landscape">{labels.landscape}</option><option value="portrait">{labels.portrait}</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.columns}
            <select value={columns} onChange={(event) => setColumns(Number(event.target.value) as 2 | 3)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <option value={2}>2</option><option value={3}>3</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.fit}
            <select value={fit} onChange={(event) => setFit(event.target.value as Fit)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <option value="cover">{labels.cover}</option><option value="contain">{labels.contain}</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.background}
            <span className="mt-2 flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 font-normal dark:border-slate-800 dark:bg-slate-900">
              <span className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400">{background}</span>
              <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-slate-700" />
            </span>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white sm:col-span-2">{labels.spacing}: {gap}px
            <input type="range" min="0" max="64" step="1" value={gap} onChange={(event) => setGap(Number(event.target.value))} className="mt-3 w-full accent-sky-600" />
          </label>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.preview}</p>
          <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="mx-auto block max-h-[70vh] max-w-full rounded-2xl object-contain" />
        </div>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" disabled={!ready || exporting} onClick={downloadCollage} className="mt-5 w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50">{exporting ? labels.exporting : labels.export}</button>
      </div>
    </div>
  );
}
