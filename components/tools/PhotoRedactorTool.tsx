'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/downloadFile';

type Point = { x: number; y: number };
type RedactionStroke = {
  points: Point[];
  radius: number;
  mode: 'blur' | 'solid';
  color: string;
};
type ImageSize = { width: number; height: number };

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 12_000_000;

function drawStrokePath(context: CanvasRenderingContext2D, stroke: RedactionStroke) {
  if (!stroke.points.length) return;
  context.beginPath();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = stroke.radius * 2;
  context.moveTo(stroke.points[0].x, stroke.points[0].y);
  if (stroke.points.length === 1) {
    context.lineTo(stroke.points[0].x, stroke.points[0].y);
  } else {
    stroke.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  }
  context.stroke();
}

export default function PhotoRedactorTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const pointerDownRef = useRef(false);
  const draftStrokeRef = useRef<RedactionStroke | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [strokes, setStrokes] = useState<RedactionStroke[]>([]);
  const [mode, setMode] = useState<'blur' | 'solid'>('blur');
  const [brushSize, setBrushSize] = useState(28);
  const [solidColor, setSolidColor] = useState('#111827');
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const labels = isIndonesian
    ? {
        description: 'Sapu pada gambar untuk memburamkan atau menutup informasi pribadi. Semuanya diproses di browser. Untuk data sangat sensitif, gunakan penutup solid.',
        upload: 'Unggah foto',
        uploadHint: 'Format PNG, JPG, atau WebP, maksimal 20 MB.',
        blur: 'Blur',
        solid: 'Tutup solid',
        brush: 'Ukuran kuas',
        color: 'Warna penutup',
        clear: 'Hapus semua sapuan',
        export: 'Ekspor PNG',
        exporting: 'Menyiapkan gambar...',
        instructions: 'Sapu area yang ingin disamarkan pada foto.',
        flattenNote: 'Ekspor berupa PNG yang sudah diratakan; piksel asli pada area tertutup tidak disertakan.',
        fileTooLarge: 'Ukuran gambar maksimal 20 MB.',
        imageTooLarge: 'Gambar terlalu besar untuk diproses dengan aman (maksimal 12 megapiksel).',
        loadError: 'Gambar tidak dapat dibuka. Coba file PNG, JPG, atau WebP lain.',
        canvasError: 'Browser tidak dapat menyiapkan area gambar. Coba browser lain atau gambar lebih kecil.',
        exportError: 'Gambar tidak dapat diekspor. Coba kurangi ukuran gambar.',
        noImage: 'Unggah gambar untuk mulai menyamarkan.',
      }
    : {
        description: 'Brush over a photo to blur or cover private information. Everything runs in your browser. Use a solid cover for highly sensitive data.',
        upload: 'Upload a photo',
        uploadHint: 'PNG, JPG, or WebP up to 20 MB.',
        blur: 'Blur',
        solid: 'Solid cover',
        brush: 'Brush size',
        color: 'Cover color',
        clear: 'Clear all strokes',
        export: 'Export PNG',
        exporting: 'Preparing image...',
        instructions: 'Brush over the parts of the photo you want to hide.',
        flattenNote: 'The exported PNG is flattened; original pixels under covered areas are not included.',
        fileTooLarge: 'The image must be 20 MB or smaller.',
        imageTooLarge: 'This image is too large to process safely (maximum 12 megapixels).',
        loadError: 'The image could not be opened. Try another PNG, JPG, or WebP file.',
        canvasError: 'Your browser could not prepare the image canvas. Try another browser or a smaller image.',
        exportError: 'Unable to export the image. Try reducing its dimensions.',
        noImage: 'Upload an image to start redacting.',
      };

  useEffect(() => {
    if (!file) {
      imageRef.current = null;
      setImageSize(null);
      return;
    }

    let active = true;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      if (image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS) {
        imageRef.current = null;
        setImageSize(null);
        setError(labels.imageTooLarge);
        return;
      }
      imageRef.current = image;
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setStrokes([]);
      setError('');
    };
    image.onerror = () => {
      if (active) {
        imageRef.current = null;
        setImageSize(null);
        setError(labels.loadError);
      }
    };
    image.src = url;
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [file, labels.imageTooLarge, labels.loadError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const size = imageSize;
    const context = canvas?.getContext('2d');
    if (!canvas || !image || !size) return;
    if (!context) {
      setError(labels.canvasError);
      return;
    }

    try {
      canvas.width = size.width;
      canvas.height = size.height;
      context.clearRect(0, 0, size.width, size.height);
      context.drawImage(image, 0, 0, size.width, size.height);

      const activeStrokes = strokes;
      const blurStrokes = activeStrokes.filter((stroke) => stroke.mode === 'blur');
      if (blurStrokes.length) {
        const blurred = document.createElement('canvas');
        blurred.width = size.width;
        blurred.height = size.height;
        const blurredContext = blurred.getContext('2d');
        if (!blurredContext) throw new Error('Canvas context unavailable');
        blurredContext.filter = 'blur(18px)';
        blurredContext.drawImage(image, 0, 0, size.width, size.height);
        blurredContext.filter = 'none';

        const mask = document.createElement('canvas');
        mask.width = size.width;
        mask.height = size.height;
        const maskContext = mask.getContext('2d');
        const overlay = document.createElement('canvas');
        overlay.width = size.width;
        overlay.height = size.height;
        const overlayContext = overlay.getContext('2d');
        if (!maskContext || !overlayContext) throw new Error('Canvas context unavailable');

        blurStrokes.forEach((stroke) => {
          maskContext.clearRect(0, 0, size.width, size.height);
          maskContext.strokeStyle = '#fff';
          drawStrokePath(maskContext, stroke);
          overlayContext.clearRect(0, 0, size.width, size.height);
          overlayContext.globalCompositeOperation = 'source-over';
          overlayContext.drawImage(blurred, 0, 0);
          overlayContext.globalCompositeOperation = 'destination-in';
          overlayContext.drawImage(mask, 0, 0);
          overlayContext.globalCompositeOperation = 'source-over';
          context.drawImage(overlay, 0, 0);
        });
      }

      activeStrokes.filter((stroke) => stroke.mode === 'solid').forEach((stroke) => {
        context.strokeStyle = stroke.color;
        context.fillStyle = stroke.color;
        drawStrokePath(context, stroke);
      });
    } catch {
      setError(labels.canvasError);
    }
  }, [imageSize, labels.canvasError, strokes]);

  const selectImage = (files: File[]) => {
    const selected = files[0] ?? null;
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      setError(labels.fileTooLarge);
      return;
    }
    setFile(selected);
    setStrokes([]);
    draftStrokeRef.current = null;
    pointerDownRef.current = false;
    setError('');
  };

  const getPoint = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width, (event.clientX - bounds.left) * canvas.width / bounds.width)),
      y: Math.max(0, Math.min(canvas.height, (event.clientY - bounds.top) * canvas.height / bounds.height)),
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!imageSize) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDownRef.current = true;
    const stroke: RedactionStroke = { points: [getPoint(event)], radius: brushSize, mode, color: solidColor };
    draftStrokeRef.current = stroke;
    const context = event.currentTarget.getContext('2d');
    if (context) {
      context.save();
      context.strokeStyle = mode === 'solid' ? solidColor : 'rgba(15, 23, 42, 0.35)';
      context.globalAlpha = mode === 'solid' ? 1 : 0.65;
      drawStrokePath(context, stroke);
      context.restore();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const stroke = draftStrokeRef.current;
    if (!pointerDownRef.current || !stroke) return;
    const point = getPoint(event);
    const previous = stroke.points[stroke.points.length - 1];
    stroke.points.push(point);
    const context = event.currentTarget.getContext('2d');
    if (!context) return;
    context.save();
    context.beginPath();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = stroke.radius * 2;
    context.strokeStyle = stroke.mode === 'solid' ? stroke.color : 'rgba(15, 23, 42, 0.35)';
    context.globalAlpha = stroke.mode === 'solid' ? 1 : 0.65;
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
  };

  const finishStroke = () => {
    pointerDownRef.current = false;
    const stroke = draftStrokeRef.current;
    draftStrokeRef.current = null;
    if (stroke) setStrokes((current) => [...current, stroke]);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !strokes.length || exporting) return;
    setExporting(true);
    try {
      canvas.toBlob((blob) => {
        setExporting(false);
        if (!blob) {
          setError(labels.exportError);
          return;
        }
        try {
          downloadBlob(blob, `${file?.name.replace(/\.[^.]+$/, '') || 'image'}-redacted.png`);
          setError('');
        } catch (caughtError) {
          console.error('Unable to download redacted photo:', caughtError);
          setError(labels.exportError);
        }
      }, 'image/png');
    } catch (caughtError) {
      console.error('Unable to export redacted photo:', caughtError);
      setExporting(false);
      setError(labels.exportError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={labels.upload} hint={labels.uploadHint} accept="image/png,image/jpeg,image/webp" onFiles={selectImage} />
        {imageSize ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{file?.name} · {imageSize.width} × {imageSize.height}px</p> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{isIndonesian ? 'Mode sapuan' : 'Brush mode'}</p>
            <div className="mt-2 flex gap-3" role="group" aria-label={isIndonesian ? 'Mode sapuan' : 'Brush mode'}>
              {(['blur', 'solid'] as const).map((value) => (
                <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${mode === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300'}`}>
                  {value === 'blur' ? labels.blur : labels.solid}
                </button>
              ))}
            </div>
          </div>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.brush}: {brushSize}px
            <input type="range" min="8" max="120" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} className="mt-3 w-full accent-sky-600" />
          </label>
          {mode === 'solid' ? <label className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">{labels.color}<input type="color" value={solidColor} onChange={(event) => setSolidColor(event.target.value)} className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-slate-700" /></label> : null}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.instructions}</p>
          {imageSize ? <canvas
            ref={canvasRef}
            width={imageSize.width}
            height={imageSize.height}
            aria-label={isIndonesian ? 'Kanvas penyamaran gambar' : 'Image redaction canvas'}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            className="mx-auto block max-h-[70vh] max-w-full touch-none cursor-crosshair rounded-2xl bg-white object-contain"
          /> : <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">{labels.noImage}</p>}
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{labels.flattenNote}</p>
        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" disabled={!strokes.length} onClick={() => { setStrokes([]); draftStrokeRef.current = null; pointerDownRef.current = false; setError(''); }} className="rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">{labels.clear}</button>
          <button type="button" disabled={!imageSize || !strokes.length || exporting} onClick={exportImage} className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50">{exporting ? labels.exporting : labels.export}</button>
        </div>
      </div>
    </div>
  );
}
