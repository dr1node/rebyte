'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

type GeneratorMode = 'gradient' | 'shadow';
type GradientType = 'linear' | 'radial';
type NumberSetter = Dispatch<SetStateAction<number>>;

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
}

export default function CssGradientShadowGeneratorTool() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<GeneratorMode>('gradient');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [startColor, setStartColor] = useState('#0ea5e9');
  const [endColor, setEndColor] = useState('#6366f1');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(12);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#0f172a');
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const gradient = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${startColor}, ${endColor})`
    : `radial-gradient(circle, ${startColor}, ${endColor})`;
  const shadow = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(shadowColor, opacity / 100)}`;
  const cssOutput = mode === 'gradient' ? `background: ${gradient};` : `box-shadow: ${shadow};`;

  const labels = language === 'id'
    ? {
        description: 'Buat CSS gradient dan box-shadow dengan pratinjau langsung. Semua pengaturan berjalan lokal di browser.',
        gradient: 'Gradient',
        shadow: 'Box shadow',
        type: 'Jenis gradient',
        linear: 'Linear',
        radial: 'Radial',
        angle: 'Sudut',
        firstColor: 'Warna awal',
        secondColor: 'Warna akhir',
        horizontal: 'Offset horizontal',
        vertical: 'Offset vertikal',
        blur: 'Blur',
        spread: 'Spread',
        shadowColor: 'Warna bayangan',
        opacity: 'Opasitas',
        inset: 'Bayangan ke dalam (inset)',
        preview: 'Pratinjau',
        css: 'CSS',
        copy: 'Salin CSS',
        copied: 'Tersalin',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
      }
    : {
        description: 'Create CSS gradients and box shadows with a live preview. All settings run locally in your browser.',
        gradient: 'Gradient',
        shadow: 'Box shadow',
        type: 'Gradient type',
        linear: 'Linear',
        radial: 'Radial',
        angle: 'Angle',
        firstColor: 'Start color',
        secondColor: 'End color',
        horizontal: 'Horizontal offset',
        vertical: 'Vertical offset',
        blur: 'Blur',
        spread: 'Spread',
        shadowColor: 'Shadow color',
        opacity: 'Opacity',
        inset: 'Inset shadow',
        preview: 'Preview',
        css: 'CSS',
        copy: 'Copy CSS',
        copied: 'Copied',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
      };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      setCopied(true);
      setError('');
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(labels.copyError);
    }
  };

  const rangeControl = (
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: NumberSetter,
    suffix = 'px',
  ) => (
    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
      <span className="flex items-center justify-between gap-3">
        {label}
        <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value));
          setCopied(false);
          setError('');
        }}
        className="mt-3 w-full accent-sky-600"
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label={language === 'id' ? 'Jenis generator' : 'Generator type'}>
          {(['gradient', 'shadow'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError('');
                setCopied(false);
              }}
              aria-pressed={mode === value}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                mode === value
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              {value === 'gradient' ? labels.gradient : labels.shadow}
            </button>
          ))}
        </div>

        {mode === 'gradient' ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {labels.type}
              <select
                value={gradientType}
                onChange={(event) => setGradientType(event.target.value as GradientType)}
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="linear">{labels.linear}</option>
                <option value="radial">{labels.radial}</option>
              </select>
            </label>
            {gradientType === 'linear' ? rangeControl(labels.angle, angle, 0, 360, setAngle, '°') : null}
            {[
              { label: labels.firstColor, value: startColor, setValue: setStartColor },
              { label: labels.secondColor, value: endColor, setValue: setEndColor },
            ].map((color) => (
              <label key={color.label} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                {color.label}
                <span className="flex items-center gap-3 font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                  {color.value}
                  <input
                    type="color"
                    value={color.value}
                    onChange={(event) => {
                      color.setValue(event.target.value);
                      setCopied(false);
                      setError('');
                    }}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-slate-700"
                  />
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {rangeControl(labels.horizontal, offsetX, -50, 50, setOffsetX)}
            {rangeControl(labels.vertical, offsetY, -50, 50, setOffsetY)}
            {rangeControl(labels.blur, blur, 0, 100, setBlur)}
            {rangeControl(labels.spread, spread, -50, 50, setSpread)}
            {rangeControl(labels.opacity, opacity, 0, 100, setOpacity, '%')}
            <label className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              {labels.shadowColor}
              <input
                type="color"
                value={shadowColor}
                onChange={(event) => {
                  setShadowColor(event.target.value);
                  setCopied(false);
                  setError('');
                }}
                className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-slate-700"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={inset}
                onChange={(event) => {
                  setInset(event.target.checked);
                  setCopied(false);
                  setError('');
                }}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              {labels.inset}
            </label>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.preview}</p>
            <div className="mt-3 flex min-h-52 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 p-8 dark:border-slate-700 dark:bg-slate-200">
              <div
                className="h-32 w-full max-w-sm rounded-3xl"
                style={mode === 'gradient' ? { background: gradient } : { background: '#ffffff', boxShadow: shadow }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.css}</p>
            <pre className="mt-3 min-h-52 overflow-x-auto whitespace-pre-wrap break-all rounded-3xl border border-slate-200/80 bg-slate-50 p-5 font-mono text-sm leading-6 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">{cssOutput}</pre>
            <button type="button" onClick={() => void copyCss()} className="mt-3 rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              {copied ? labels.copied : labels.copy}
            </button>
            {error ? <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
