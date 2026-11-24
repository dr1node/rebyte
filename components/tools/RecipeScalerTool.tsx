'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

type MeasureGroup = 'volume' | 'weight';
type Unit = { id: string; labelEn: string; labelId: string; factor: number };

const units: Record<MeasureGroup, Unit[]> = {
  volume: [
    { id: 'tsp', labelEn: 'teaspoon (tsp)', labelId: 'sendok teh (sdt)', factor: 4.92892 },
    { id: 'tbsp', labelEn: 'tablespoon (tbsp)', labelId: 'sendok makan (sdm)', factor: 14.7868 },
    { id: 'cup', labelEn: 'US cup', labelId: 'cup (AS)', factor: 236.588 },
    { id: 'ml', labelEn: 'milliliter (ml)', labelId: 'mililiter (ml)', factor: 1 },
    { id: 'l', labelEn: 'liter (l)', labelId: 'liter (l)', factor: 1000 },
  ],
  weight: [
    { id: 'g', labelEn: 'gram (g)', labelId: 'gram (g)', factor: 1 },
    { id: 'kg', labelEn: 'kilogram (kg)', labelId: 'kilogram (kg)', factor: 1000 },
    { id: 'oz', labelEn: 'ounce (oz)', labelId: 'ounce (oz)', factor: 28.3495 },
    { id: 'lb', labelEn: 'pound (lb)', labelId: 'pound (lb)', factor: 453.592 },
  ],
};

function parseQuantity(value: string) {
  if (value.includes('/')) {
    const parts = value.trim().split(/\s+/);
    const fraction = parts.pop() ?? '';
    const [numeratorText, fractionDenominator] = fraction.split('/');
    const denominator = Number(fractionDenominator);
    if (!denominator) return Number.NaN;
    const fractionValue = Number(numeratorText) / denominator;
    return (parts.length ? Number(parts[0]) : 0) + fractionValue;
  }
  return Number(value.replace(',', '.'));
}

function formatScaledAmount(value: number, language: string) {
  return Number(value.toFixed(3)).toLocaleString(language === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 3 });
}

function scaleIngredients(text: string, factor: number, language: string) {
  const quantityPattern = /^(\s*)(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)(?=\s|$)(.*)$/;
  return text.split(/\r?\n/).map((line) => {
    const match = line.match(quantityPattern);
    if (!match) return line;
    const [, leadingSpace, quantityText, rest] = match;
    const quantity = parseQuantity(quantityText);
    if (!Number.isFinite(quantity)) return line;
    return `${leadingSpace}${formatScaledAmount(quantity * factor, language)}${rest}`;
  }).join('\n');
}

export default function RecipeScalerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [ingredients, setIngredients] = useState('200 g flour\n2 eggs\n1 cup milk\n1 tsp salt');
  const [baseServings, setBaseServings] = useState('4');
  const [targetServings, setTargetServings] = useState('2');
  const [group, setGroup] = useState<MeasureGroup>('volume');
  const [measureValue, setMeasureValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('ml');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const labels = isIndonesian
    ? {
        description: 'Sesuaikan takaran bahan berdasarkan jumlah porsi, atau konversi ukuran dapur yang umum. Perhitungan dilakukan langsung di browser.',
        servings: 'Penyesuaian porsi',
        ingredients: 'Bahan (satu bahan per baris)',
        ingredientsHint: 'Awali baris dengan jumlah agar bisa dikalikan, misalnya “1 1/2 cup susu”. Baris tanpa jumlah dibiarkan apa adanya.',
        original: 'Porsi resep',
        target: 'Porsi yang diinginkan',
        scaled: 'Takaran bahan yang disesuaikan',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        conversion: 'Konversi takaran dapur',
        volume: 'Volume',
        weight: 'Berat',
        value: 'Nilai',
        from: 'Dari',
        to: 'Ke',
        result: 'Hasil',
        measurementNote: 'Cup menggunakan ukuran US. Konversi volume dan berat dipisahkan karena berat tiap bahan berbeda.',
        required: 'Masukkan jumlah porsi yang lebih besar dari 0.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        volumeUnits: { tsp: 'sendok teh (sdt)', tbsp: 'sendok makan (sdm)', cup: 'cup (AS)', ml: 'mililiter (ml)', l: 'liter (l)' } as Record<string, string>,
        weightUnits: { g: 'gram (g)', kg: 'kilogram (kg)', oz: 'ounce (oz)', lb: 'pound (lb)' } as Record<string, string>,
      }
    : {
        description: 'Scale ingredient amounts for a different number of servings, or convert common kitchen measurements. Calculations run locally in your browser.',
        servings: 'Scale servings',
        ingredients: 'Ingredients (one item per line)',
        ingredientsHint: 'Start a line with an amount to scale it, such as “1 1/2 cups milk”. Lines without a leading amount stay unchanged.',
        original: 'Original servings',
        target: 'Desired servings',
        scaled: 'Scaled ingredients',
        copy: 'Copy result',
        copied: 'Copied',
        conversion: 'Kitchen measure conversion',
        volume: 'Volume',
        weight: 'Weight',
        value: 'Amount',
        from: 'From',
        to: 'To',
        result: 'Result',
        measurementNote: 'Cup uses the US measure. Volume and weight are separate because ingredients have different densities.',
        required: 'Enter serving counts greater than 0.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        volumeUnits: { tsp: 'teaspoon (tsp)', tbsp: 'tablespoon (tbsp)', cup: 'US cup', ml: 'milliliter (ml)', l: 'liter (l)' } as Record<string, string>,
        weightUnits: { g: 'gram (g)', kg: 'kilogram (kg)', oz: 'ounce (oz)', lb: 'pound (lb)' } as Record<string, string>,
      };

  const original = Number(baseServings);
  const target = Number(targetServings);
  const validServings = Number.isFinite(original) && original > 0 && Number.isFinite(target) && target > 0;
  const scaledIngredients = validServings ? scaleIngredients(ingredients, target / original, language) : '';
  const unitList = units[group];
  const sourceUnit = unitList.find((unit) => unit.id === fromUnit) ?? unitList[0];
  const targetUnit = unitList.find((unit) => unit.id === toUnit) ?? unitList[1];
  const parsedMeasure = Number(measureValue);
  const convertedMeasure = Number.isFinite(parsedMeasure) ? parsedMeasure * sourceUnit.factor / targetUnit.factor : Number.NaN;
  const unitLabels = group === 'volume' ? labels.volumeUnits : labels.weightUnits;
  const formatResult = (value: number) => Number(value.toFixed(3)).toLocaleString(isIndonesian ? 'id-ID' : 'en-US', { maximumFractionDigits: 3 });

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(scaledIngredients);
      setCopied(true);
      setError('');
      window.setTimeout(() => setCopied(false), 1500);
    } catch (caughtError) {
      console.error('Unable to copy scaled recipe:', caughtError);
      setError(labels.copyError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{labels.servings}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.original}<input type="number" min="1" step="any" value={baseServings} onChange={(event) => { setBaseServings(event.target.value); setCopied(false); }} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.target}<input type="number" min="1" step="any" value={targetServings} onChange={(event) => { setTargetServings(event.target.value); setCopied(false); }} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
        </div>
        <label className="mt-5 block text-sm font-semibold text-slate-900 dark:text-white">{labels.ingredients}
          <textarea rows={9} value={ingredients} onChange={(event) => { setIngredients(event.target.value); setCopied(false); }} className="mt-2 w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
        </label>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{labels.ingredientsHint}</p>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.scaled}</p>
          <pre className="mt-2 min-h-40 overflow-x-auto whitespace-pre-wrap break-words rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">{scaledIngredients}</pre>
          <button type="button" disabled={!validServings || !scaledIngredients} onClick={() => void copyResult()} className="mt-3 rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">{copied ? labels.copied : labels.copy}</button>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{labels.conversion}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.volume} / {labels.weight}
              <select value={group} onChange={(event) => { const next = event.target.value as MeasureGroup; setGroup(next); setFromUnit(next === 'volume' ? 'cup' : 'g'); setToUnit(next === 'volume' ? 'ml' : 'oz'); }} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <option value="volume">{labels.volume}</option><option value="weight">{labels.weight}</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.value}<input type="number" min="0" step="any" value={measureValue} onChange={(event) => setMeasureValue(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.from}
              <select value={sourceUnit.id} onChange={(event) => setFromUnit(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                {unitList.map((unit) => <option key={unit.id} value={unit.id}>{unitLabels[unit.id] ?? (isIndonesian ? unit.labelId : unit.labelEn)}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.to}
              <select value={targetUnit.id} onChange={(event) => setToUnit(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                {unitList.map((unit) => <option key={unit.id} value={unit.id}>{unitLabels[unit.id] ?? (isIndonesian ? unit.labelId : unit.labelEn)}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">{labels.result}: {Number.isFinite(convertedMeasure) ? `${formatResult(convertedMeasure)} ${unitLabels[targetUnit.id] ?? targetUnit.id}` : '—'}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{labels.measurementNote}</p>
        </div>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        {!validServings ? <p role="alert" className="mt-4 text-sm text-rose-600 dark:text-rose-300">{labels.required}</p> : null}
      </div>
    </div>
  );
}
