'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

type Rgb = { red: number; green: number; blue: number };

const hexToRgb = (hex: string): Rgb | null => {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
  return { red: parseInt(normalized.slice(0, 2), 16), green: parseInt(normalized.slice(2, 4), 16), blue: parseInt(normalized.slice(4, 6), 16) };
};

const rgbToHsl = ({ red, green, blue }: Rgb) => {
  const values = [red, green, blue].map((value) => value / 255);
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const lightness = (maximum + minimum) / 2;
  const difference = maximum - minimum;
  if (!difference) return { hue: 0, saturation: 0, lightness: Math.round(lightness * 100) };
  const saturation = difference / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;
  if (maximum === values[0]) hue = ((values[1] - values[2]) / difference) % 6;
  else if (maximum === values[1]) hue = (values[2] - values[0]) / difference + 2;
  else hue = (values[0] - values[1]) / difference + 4;
  return { hue: Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60), saturation: Math.round(saturation * 100), lightness: Math.round(lightness * 100) };
};

export default function ColorPickerConverterTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [hex, setHex] = useState('#0ea5e9');
  const rgb = useMemo(() => hexToRgb(hex) ?? { red: 14, green: 165, blue: 233 }, [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const updateHex = (value: string) => { const normalized = value.startsWith('#') ? value : `#${value}`; if (hexToRgb(normalized)) setHex(normalized.toLowerCase()); else setHex(value); };
  const copy = (value: string) => navigator.clipboard.writeText(value);
  const labels = isIndonesian ? { picker: 'Pilih warna', hex: 'Nilai HEX', formats: 'Format warna', copy: 'Salin' } : { picker: 'Pick a color', hex: 'HEX value', formats: 'Color formats', copy: 'Copy' };

  return <div className="space-y-6"><div className="grid gap-6 sm:grid-cols-[auto_1fr]"><label className="space-y-3"><span className="block text-sm font-semibold text-slate-900 dark:text-white">{labels.picker}</span><input type="color" value={hexToRgb(hex) ? hex : '#0ea5e9'} onChange={(event) => setHex(event.target.value)} className="h-28 w-28 cursor-pointer rounded-3xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900" /></label><label className="space-y-3"><span className="block text-sm font-semibold text-slate-900 dark:text-white">{labels.hex}</span><input value={hex} onChange={(event) => updateHex(event.target.value)} spellCheck={false} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 font-mono text-sm uppercase text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label></div><div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95"><p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.formats}</p><div className="mt-4 grid gap-3"><FormatRow label="HEX" value={hexToRgb(hex) ? hex.toUpperCase() : '-'} copyLabel={labels.copy} onCopy={copy} /><FormatRow label="RGB" value={`rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`} copyLabel={labels.copy} onCopy={copy} /><FormatRow label="HSL" value={`hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`} copyLabel={labels.copy} onCopy={copy} /></div></div></div>;
}

// eslint-disable-next-line no-unused-vars
function FormatRow({ label, value, copyLabel, onCopy }: { label: string; value: string; copyLabel: string; onCopy: (copyValue: string) => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"><span className="w-12 text-xs font-bold tracking-wider text-slate-500">{label}</span><code className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100">{value}</code><button type="button" onClick={() => onCopy(value)} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">{copyLabel}</button></div>;
}