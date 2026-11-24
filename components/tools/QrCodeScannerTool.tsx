'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Copy, Image as ImageIcon } from 'lucide-react';
import jsQR from 'jsqr';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_SCAN_DIMENSION = 1200;

function findQrCode(imageData: ImageData) {
  return jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
}

export default function QrCodeScannerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [mode, setMode] = useState<'image' | 'camera'>('image');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const labels = useMemo(() => isIndonesian
    ? {
        description: 'Pindai QR dari gambar atau kamera perangkat. Dekode dilakukan lokal di browser; gambar dan video tidak diunggah.',
        imageMode: 'Dari gambar',
        cameraMode: 'Dari kamera',
        upload: 'Unggah gambar QR',
        uploadHint: 'Pilih PNG, JPEG, atau WebP (maksimum 20 MB).',
        cameraStart: 'Mulai kamera',
        cameraStop: 'Hentikan kamera',
        cameraReady: 'Arahkan kamera ke kode QR.',
        result: 'Hasil QR',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        noQr: 'Kode QR tidak ditemukan pada gambar.',
        imageError: 'Tidak dapat membaca gambar. Coba file gambar lain.',
        imageTooLarge: 'Ukuran gambar maksimum adalah 20 MB.',
        cameraUnsupported: 'Browser ini tidak mendukung akses kamera.',
        secureRequired: 'Akses kamera memerlukan HTTPS atau localhost.',
        cameraDenied: 'Kamera tidak dapat dibuka. Periksa izin browser dan pastikan kamera tersedia.',
        canvasError: 'Browser tidak dapat memproses gambar ini.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        localNote: 'Pemindaian berjalan sepenuhnya di browser.',
      }
    : {
        description: 'Scan a QR code from an image or your device camera. Decoding runs locally in your browser; images and video are never uploaded.',
        imageMode: 'From image',
        cameraMode: 'From camera',
        upload: 'Upload QR image',
        uploadHint: 'Choose a PNG, JPEG, or WebP image (up to 20 MB).',
        cameraStart: 'Start camera',
        cameraStop: 'Stop camera',
        cameraReady: 'Point the camera at a QR code.',
        result: 'QR result',
        copy: 'Copy result',
        copied: 'Copied',
        noQr: 'No QR code was found in the image.',
        imageError: 'Unable to read this image. Try another image file.',
        imageTooLarge: 'The maximum image size is 20 MB.',
        cameraUnsupported: 'This browser does not support camera access.',
        secureRequired: 'Camera access requires HTTPS or localhost.',
        cameraDenied: 'Unable to start the camera. Check browser permissions and camera availability.',
        canvasError: 'Your browser could not process this image.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        localNote: 'Scanning runs entirely in your browser.',
      }, [isIndonesian]);

  useEffect(() => {
    if (!cameraActive) return undefined;
    const videoElement = videoRef.current;
    let cancelled = false;
    let stream: MediaStream | null = null;
    let scanTimer: number | undefined;

    const scanFrame = () => {
      if (cancelled) return;
      const video = videoElement;
      if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
        const scale = Math.min(1, MAX_SCAN_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const qr = findQrCode(context.getImageData(0, 0, canvas.width, canvas.height));
          if (qr) {
            setResult(qr.data);
            setError('');
            setCopied(false);
            setCameraActive(false);
            return;
          }
        }
      }
      scanTimer = window.setTimeout(scanFrame, 180);
    };

    const startCamera = async () => {
      if (!window.isSecureContext) {
        setError(labels.secureRequired);
        setCameraActive(false);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(labels.cameraUnsupported);
        setCameraActive(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoElement;
        if (!video) {
          setError(labels.cameraUnsupported);
          setCameraActive(false);
          return;
        }
        video.srcObject = stream;
        await video.play();
        scanFrame();
      } catch {
        setError(labels.cameraDenied);
        setCameraActive(false);
      }
    };

    void startCamera();
    return () => {
      cancelled = true;
      if (scanTimer !== undefined) window.clearTimeout(scanTimer);
      stream?.getTracks().forEach((track) => track.stop());
      if (videoElement) videoElement.srcObject = null;
    };
  }, [cameraActive, labels]);

  const scanImage = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setResult('');
    setError('');
    setCopied(false);
    if (file.size > MAX_IMAGE_SIZE) {
      setError(labels.imageTooLarge);
      return;
    }

    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_SCAN_DIMENSION / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        setError(labels.canvasError);
        return;
      }
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const qr = findQrCode(context.getImageData(0, 0, canvas.width, canvas.height));
      if (!qr) {
        setError(labels.noQr);
        return;
      }
      setResult(qr.data);
    } catch {
      setError(labels.imageError);
    } finally {
      bitmap?.close();
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setError('');
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(labels.copyError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{labels.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label={isIndonesian ? 'Sumber pemindaian' : 'Scan source'}>
          {(['image', 'camera'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setCameraActive(false);
                setError('');
              }}
              aria-pressed={mode === value}
              className={`inline-flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                mode === value
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              {value === 'image' ? <ImageIcon className="h-4 w-4" aria-hidden="true" /> : <Camera className="h-4 w-4" aria-hidden="true" />}
              {value === 'image' ? labels.imageMode : labels.cameraMode}
            </button>
          ))}
        </div>

        {mode === 'image' ? (
          <FileDropzone
            accept="image/*"
            label={labels.upload}
            hint={labels.uploadHint}
            onFiles={(files) => void scanImage(files)}
          />
        ) : (
          <div className="space-y-4">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  className="max-h-[28rem] w-full rounded-3xl bg-slate-950 object-contain"
                  aria-label={labels.cameraReady}
                />
                <p className="text-sm text-slate-600 dark:text-slate-300">{labels.cameraReady}</p>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setError('');
                setResult('');
                setCopied(false);
                setCameraActive((active) => !active);
              }}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {cameraActive ? labels.cameraStop : labels.cameraStart}
            </button>
          </div>
        )}

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        {result ? (
          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.result}</p>
            <pre className="mt-3 whitespace-pre-wrap break-all rounded-2xl bg-white p-4 font-mono text-sm leading-6 text-slate-800 dark:bg-slate-950 dark:text-slate-200">{result}</pre>
            <button
              type="button"
              onClick={() => void copyResult()}
              className="mt-4 inline-flex items-center gap-2 rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? labels.copied : labels.copy}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
