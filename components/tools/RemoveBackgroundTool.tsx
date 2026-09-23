'use client';

import { useEffect, useRef, useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

const MAX_IMAGE_EDGE = 1280;
const MAX_IMAGE_PIXELS = 1_500_000;

type Mask = { data: ArrayLike<number>; width: number; height: number };
type ToolCopy = {
  intro: string;
  upload: string;
  hint: string;
  preparing: string;
  loadingWebGpu: string;
  loadingWasm: string;
  loadingModel: string;
  firstLoadTitle: string;
  firstLoadDescription: string;
  firstLoadWarning: string;
  removing: string;
  done: string;
  error: string;
  original: string;
  result: string;
  originalHint: string;
  resultHint: string;
  download: string;
};

const copyByLanguage: Record<'en' | 'id', ToolCopy> = {
  en: {
    intro: 'Remove backgrounds privately in your browser. Your photo is never uploaded to this website.',
    upload: 'Upload image',
    hint: 'JPG, PNG, or WebP optimized to a maximum 1280px working size',
    preparing: 'Preparing image...',
    loadingWebGpu: 'Loading AI model with WebGPU...',
    loadingWasm: 'Loading AI model with WASM...',
    loadingModel: 'Loading AI model...',
    firstLoadTitle: 'First-time setup may take a little longer',
    firstLoadDescription: 'The AI model is being downloaded and prepared in your browser. It will be cached for future use.',
    firstLoadWarning: 'Please keep this tab open until the process is complete.',
    removing: 'Removing background...',
    done: 'Background removed.',
    error: 'Could not remove the background. Try a smaller JPG, PNG, or WebP image.',
    original: 'Original',
    result: 'Transparent result',
    originalHint: 'Upload an image to preview it here.',
    resultHint: 'Your transparent PNG will appear here.',
    download: 'Download transparent PNG',
  },
  id: {
    intro: 'Hapus background secara privat di browser. Foto Anda tidak pernah diunggah ke website ini.',
    upload: 'Unggah gambar',
    hint: 'JPG, PNG, atau WebP dioptimalkan hingga ukuran kerja maksimal 1280px',
    preparing: 'Menyiapkan gambar...',
    loadingWebGpu: 'Memuat model AI dengan WebGPU...',
    loadingWasm: 'Memuat model AI dengan WASM...',
    loadingModel: 'Memuat model AI...',
    firstLoadTitle: 'Proses pertama mungkin memakan waktu lebih lama',
    firstLoadDescription: 'Model AI sedang diunduh dan disiapkan di browser Anda. Model akan disimpan di cache untuk penggunaan berikutnya.',
    firstLoadWarning: 'Jangan tutup tab ini sebelum proses selesai.',
    removing: 'Menghapus background...',
    done: 'Background berhasil dihapus.',
    error: 'Background tidak dapat dihapus. Coba gambar JPG, PNG, atau WebP yang lebih kecil.',
    original: 'Asli',
    result: 'Hasil transparan',
    originalHint: 'Unggah gambar untuk melihat pratinjau.',
    resultHint: 'PNG transparan akan muncul di sini.',
    download: 'Unduh PNG transparan',
  },
};

const loadImage = (file: File) => new Promise<HTMLImageElement>((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(url);
    resolve(image);
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Could not load image'));
  };
  image.src = url;
});

const resizeMask = (mask: Mask, width: number, height: number) => {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = mask.width;
  maskCanvas.height = mask.height;
  const maskContext = maskCanvas.getContext('2d');
  if (!maskContext) throw new Error('Mask canvas is not available');

  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < mask.width * mask.height; index += 1) {
    const value = Number(mask.data[index]);
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  const range = maximum - minimum;
  const pixels = new Uint8ClampedArray(mask.width * mask.height * 4);
  for (let index = 0; index < mask.width * mask.height; index += 1) {
    const normalized = range > 0 ? (Number(mask.data[index]) - minimum) / range : 0;
    const value = Math.round(Math.max(0, Math.min(1, normalized)) * 255);
    pixels[index * 4] = value;
    pixels[index * 4 + 1] = value;
    pixels[index * 4 + 2] = value;
    pixels[index * 4 + 3] = 255;
  }
  maskContext.putImageData(new ImageData(pixels, mask.width, mask.height), 0, 0);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = width;
  resizedCanvas.height = height;
  const resizedContext = resizedCanvas.getContext('2d');
  if (!resizedContext) throw new Error('Resized mask canvas is not available');
  resizedContext.imageSmoothingEnabled = true;
  resizedContext.imageSmoothingQuality = 'high';
  resizedContext.drawImage(maskCanvas, 0, 0, width, height);
  return resizedContext.getImageData(0, 0, width, height).data;
};

const applyMaskAndExport = async (canvas: HTMLCanvasElement, mask: Mask) => {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const alpha = resizeMask(mask, canvas.width, canvas.height);
  for (let index = 0; index < canvas.width * canvas.height; index += 1) imageData.data[index * 4 + 3] = alpha[index * 4];
  context.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create PNG'))), 'image/png');
  });
};

// eslint-disable-next-line no-unused-vars
const processInWorker = (worker: Worker, image: Blob, onStatus: (message: string) => void) => new Promise<Mask>((resolve, reject) => {
  const handleMessage = (event: MessageEvent<{ type: string; message?: string; result?: { data: ArrayBuffer; width: number; height: number } }>) => {
    if (event.data.type === 'status' && event.data.message) {
      onStatus(event.data.message);
      return;
    }
    worker.removeEventListener('message', handleMessage);
    worker.removeEventListener('error', handleError);
    if (event.data.type === 'result' && event.data.result) {
      resolve({ data: new Float32Array(event.data.result.data), width: event.data.result.width, height: event.data.result.height });
    } else {
      reject(new Error('Background removal worker failed'));
    }
  };
  const handleError = () => {
    worker.removeEventListener('message', handleMessage);
    worker.removeEventListener('error', handleError);
    reject(new Error('Background removal worker failed'));
  };
  worker.addEventListener('message', handleMessage);
  worker.addEventListener('error', handleError);
  worker.postMessage({ type: 'process', image });
});

export default function RemoveBackgroundTool() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language === 'id' ? 'id' : 'en'];
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const processId = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('./removeBackground.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [originalUrl, resultUrl]);

  const handleUpload = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    const currentProcess = processId.current + 1;
    processId.current = currentProcess;
    setFile(selectedFile);
    setError('');
    setResultUrl('');
    setProcessing(true);
    setStatus(copy.preparing);
    setOriginalUrl(URL.createObjectURL(selectedFile));

    try {
      const image = await loadImage(selectedFile);
      if (processId.current !== currentProcess) return;
      const edgeScale = MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight);
      const pixelScale = Math.sqrt(MAX_IMAGE_PIXELS / (image.naturalWidth * image.naturalHeight));
      const scale = Math.min(1, edgeScale, pixelScale);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is not available');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, width, height);

      const worker = workerRef.current;
      if (!worker) throw new Error('Background removal worker is unavailable');
      const workingImage = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not prepare image'))), 'image/jpeg', 0.9);
      });
      const mask = await processInWorker(worker, workingImage, (message) => {
        if (message.startsWith('Loading AI model with WebGPU')) {
          setLoadingModel(true);
          setStatus(copy.loadingWebGpu);
        } else if (message.startsWith('Loading AI model with WASM')) {
          setLoadingModel(true);
          setStatus(copy.loadingWasm);
        } else if (message.startsWith('Loading AI model')) {
          setLoadingModel(true);
          setStatus(copy.loadingModel);
        } else if (message === 'Removing background...') {
          setLoadingModel(false);
          setStatus(copy.removing);
        }
        else setStatus(message);
      });
      if (processId.current !== currentProcess) return;
      const result = await applyMaskAndExport(canvas, mask);
      if (processId.current !== currentProcess) return;
      setResultUrl(URL.createObjectURL(result));
      setLoadingModel(false);
      setStatus(copy.done);
    } catch (processingError) {
      if (processId.current !== currentProcess) return;
      setError(copy.error);
      setLoadingModel(false);
      setStatus('');
    } finally {
      if (processId.current === currentProcess) setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${file.name.replace(/\.[^.]+$/, '')}-no-background.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">{copy.intro}</p>
      </div>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <FileDropzone label={copy.upload} hint={copy.hint} accept="image/jpeg,image/png,image/webp" onFiles={handleUpload} />
        {status ? <p className="mt-4 rounded-3xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200" role="status">{status}</p> : null}
        {loadingModel ? (
          <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100" role="note">
            <p className="font-semibold">{copy.firstLoadTitle}</p>
            <p className="mt-1 leading-6">{copy.firstLoadDescription}</p>
            <p className="mt-2 font-medium">{copy.firstLoadWarning}</p>
          </div>
        ) : null}
        {error ? <p className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200" role="alert">{error}</p> : null}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{copy.original}</p>
            <div className="mt-3 flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
              {originalUrl ? <img src={originalUrl} alt={copy.original} className="max-h-[420px] max-w-full object-contain" /> : <p className="text-sm text-slate-500 dark:text-slate-400">{copy.originalHint}</p>}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{copy.result}</p>
            <div className="mt-3 flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
              {resultUrl ? <img src={resultUrl} alt={copy.result} className="max-h-[420px] max-w-full object-contain" /> : <p className="text-sm text-slate-500 dark:text-slate-400">{copy.resultHint}</p>}
            </div>
            <button type="button" onClick={downloadResult} disabled={!resultUrl || processing} className={`mt-4 w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${resultUrl && !processing ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-300 text-slate-500'}`}>{copy.download}</button>
          </div>
        </div>
      </div>
    </div>
  );
}