'use client';

import { useMemo, useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

const categoryKeys = ['length', 'mass', 'temperature', 'area', 'speed', 'digital'] as const;
type CategoryKey = (typeof categoryKeys)[number];
type Unit = { key: string; en: string; id: string; factor: number };
type Category = { en: string; id: string; units: Unit[] };

const categories: Record<CategoryKey, Category> = {
  length: {
    en: 'Length',
    id: 'Panjang',
    units: [
      { key: 'mm', en: 'Millimeter (mm)', id: 'Milimeter (mm)', factor: 0.001 },
      { key: 'cm', en: 'Centimeter (cm)', id: 'Sentimeter (cm)', factor: 0.01 },
      { key: 'm', en: 'Meter (m)', id: 'Meter (m)', factor: 1 },
      { key: 'km', en: 'Kilometer (km)', id: 'Kilometer (km)', factor: 1000 },
      { key: 'in', en: 'Inch (in)', id: 'Inci (in)', factor: 0.0254 },
      { key: 'ft', en: 'Foot (ft)', id: 'Kaki (ft)', factor: 0.3048 },
      { key: 'yd', en: 'Yard (yd)', id: 'Yard (yd)', factor: 0.9144 },
      { key: 'mi', en: 'Mile (mi)', id: 'Mil (mi)', factor: 1609.344 },
    ],
  },
  mass: {
    en: 'Mass',
    id: 'Berat',
    units: [
      { key: 'mg', en: 'Milligram (mg)', id: 'Miligram (mg)', factor: 0.000001 },
      { key: 'g', en: 'Gram (g)', id: 'Gram (g)', factor: 0.001 },
      { key: 'kg', en: 'Kilogram (kg)', id: 'Kilogram (kg)', factor: 1 },
      { key: 't', en: 'Metric ton (t)', id: 'Ton metrik (t)', factor: 1000 },
      { key: 'oz', en: 'Ounce (oz)', id: 'Ons (oz)', factor: 0.028349523125 },
      { key: 'lb', en: 'Pound (lb)', id: 'Pon (lb)', factor: 0.45359237 },
    ],
  },
  temperature: {
    en: 'Temperature',
    id: 'Suhu',
    units: [
      { key: 'C', en: 'Celsius (°C)', id: 'Celsius (°C)', factor: 1 },
      { key: 'F', en: 'Fahrenheit (°F)', id: 'Fahrenheit (°F)', factor: 1 },
      { key: 'K', en: 'Kelvin (K)', id: 'Kelvin (K)', factor: 1 },
    ],
  },
  area: {
    en: 'Area',
    id: 'Luas',
    units: [
      { key: 'mm2', en: 'Square millimeter (mm²)', id: 'Milimeter persegi (mm²)', factor: 0.000001 },
      { key: 'cm2', en: 'Square centimeter (cm²)', id: 'Sentimeter persegi (cm²)', factor: 0.0001 },
      { key: 'm2', en: 'Square meter (m²)', id: 'Meter persegi (m²)', factor: 1 },
      { key: 'km2', en: 'Square kilometer (km²)', id: 'Kilometer persegi (km²)', factor: 1000000 },
      { key: 'ha', en: 'Hectare (ha)', id: 'Hektare (ha)', factor: 10000 },
      { key: 'acre', en: 'Acre', id: 'Acre', factor: 4046.8564224 },
      { key: 'ft2', en: 'Square foot (ft²)', id: 'Kaki persegi (ft²)', factor: 0.09290304 },
    ],
  },
  speed: {
    en: 'Speed',
    id: 'Kecepatan',
    units: [
      { key: 'mps', en: 'Meters per second (m/s)', id: 'Meter per detik (m/s)', factor: 1 },
      { key: 'kph', en: 'Kilometers per hour (km/h)', id: 'Kilometer per jam (km/j)', factor: 1 / 3.6 },
      { key: 'mph', en: 'Miles per hour (mph)', id: 'Mil per jam (mph)', factor: 0.44704 },
      { key: 'knot', en: 'Knot (kn)', id: 'Knot (kn)', factor: 0.5144444444444445 },
      { key: 'fps', en: 'Feet per second (ft/s)', id: 'Kaki per detik (ft/s)', factor: 0.3048 },
    ],
  },
  digital: {
    en: 'Digital storage',
    id: 'Penyimpanan digital',
    units: [
      { key: 'bit', en: 'Bit (b)', id: 'Bit (b)', factor: 1 },
      { key: 'byte', en: 'Byte (B)', id: 'Byte (B)', factor: 8 },
      { key: 'KB', en: 'Kilobyte (KB, decimal)', id: 'Kilobyte (KB, desimal)', factor: 8000 },
      { key: 'MB', en: 'Megabyte (MB, decimal)', id: 'Megabyte (MB, desimal)', factor: 8000000 },
      { key: 'GB', en: 'Gigabyte (GB, decimal)', id: 'Gigabyte (GB, desimal)', factor: 8000000000 },
      { key: 'TB', en: 'Terabyte (TB, decimal)', id: 'Terabyte (TB, desimal)', factor: 8000000000000 },
      { key: 'KiB', en: 'Kibibyte (KiB)', id: 'Kibibyte (KiB)', factor: 8192 },
      { key: 'MiB', en: 'Mebibyte (MiB)', id: 'Mebibyte (MiB)', factor: 8388608 },
      { key: 'GiB', en: 'Gibibyte (GiB)', id: 'Gibibyte (GiB)', factor: 8589934592 },
      { key: 'TiB', en: 'Tebibyte (TiB)', id: 'Tebibyte (TiB)', factor: 8796093022208 },
    ],
  },
};

const convertTemperature = (value: number, from: string, to: string) => {
  const celsius = from === 'F' ? (value - 32) * 5 / 9 : from === 'K' ? value - 273.15 : value;
  return to === 'F' ? celsius * 9 / 5 + 32 : to === 'K' ? celsius + 273.15 : celsius;
};

export default function UnitConverterTool() {
  const { language } = useLanguage();
  const [categoryKey, setCategoryKey] = useState<CategoryKey>('length');
  const [amount, setAmount] = useState('1');
  const [fromKey, setFromKey] = useState('m');
  const [toKey, setToKey] = useState('ft');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const category = categories[categoryKey];
  const fromUnit = category.units.find((unit) => unit.key === fromKey) ?? category.units[0];
  const toUnit = category.units.find((unit) => unit.key === toKey) ?? category.units[1];
  const numericAmount = Number(amount);
  const isValidAmount = amount.trim() !== '' && Number.isFinite(numericAmount);

  const result = useMemo(() => {
    if (!isValidAmount) return null;
    let converted: number;
    if (categoryKey === 'temperature') {
      const celsius = fromUnit.key === 'F'
        ? (numericAmount - 32) * 5 / 9
        : fromUnit.key === 'K'
          ? numericAmount - 273.15
          : numericAmount;
      if (celsius < -273.15) return null;
      converted = convertTemperature(numericAmount, fromUnit.key, toUnit.key);
    } else {
      converted = numericAmount * fromUnit.factor / toUnit.factor;
    }
    return Number.isFinite(converted) ? converted : null;
  }, [categoryKey, fromUnit, isValidAmount, numericAmount, toUnit]);

  const locale = language === 'id' ? 'id-ID' : 'en-US';
  const formattedResult = result === null
    ? ''
    : new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 }).format(result);
  const resultText = `${formattedResult} ${language === 'id' ? toUnit.id : toUnit.en}`;
  const labels = language === 'id'
    ? {
        description: 'Konversi satuan panjang, berat, suhu, luas, kecepatan, dan data digital langsung di browser.',
        category: 'Kategori',
        amount: 'Nilai',
        from: 'Dari',
        to: 'Ke',
        swap: 'Tukar satuan',
        result: 'Hasil',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        invalid: 'Masukkan angka yang valid.',
        invalidTemperature: 'Suhu tidak boleh berada di bawah nol mutlak (−273,15 °C).',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        localNote: 'Konversi dilakukan di perangkat Anda; data tidak dikirim ke server.',
      }
    : {
        description: 'Convert length, mass, temperature, area, speed, and digital storage units directly in your browser.',
        category: 'Category',
        amount: 'Value',
        from: 'From',
        to: 'To',
        swap: 'Swap units',
        result: 'Result',
        copy: 'Copy result',
        copied: 'Copied',
        invalid: 'Enter a valid number.',
        invalidTemperature: 'Temperature cannot be below absolute zero (−273.15 °C).',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        localNote: 'Conversion runs on your device; no data is sent to a server.',
      };

  const handleCategoryChange = (nextKey: CategoryKey) => {
    const nextUnits = categories[nextKey].units;
    setCategoryKey(nextKey);
    setFromKey(nextUnits[0].key);
    setToKey(nextUnits[1]?.key ?? nextUnits[0].key);
    setCopied(false);
    setCopyError(false);
  };

  const copyResult = async () => {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{labels.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.category}
            <select
              value={categoryKey}
              onChange={(event) => {
                const nextKey = categoryKeys.find((key) => key === event.target.value);
                if (nextKey) handleCategoryChange(nextKey);
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {categoryKeys.map((key) => (
                <option key={key} value={key}>{language === 'id' ? categories[key].id : categories[key].en}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.amount}
            <input
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setCopied(false);
                setCopyError(false);
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="mt-5 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.from}
            <select
              value={fromUnit.key}
              onChange={(event) => {
                setFromKey(event.target.value);
                setCopied(false);
                setCopyError(false);
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {category.units.map((unit) => <option key={unit.key} value={unit.key}>{language === 'id' ? unit.id : unit.en}</option>)}
            </select>
          </label>
          <button
            type="button"
            aria-label={labels.swap}
            title={labels.swap}
            onClick={() => {
              setFromKey(toUnit.key);
              setToKey(fromUnit.key);
              setCopied(false);
              setCopyError(false);
            }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
          >
            <ArrowDownUp className="h-5 w-5" aria-hidden="true" />
          </button>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.to}
            <select
              value={toUnit.key}
              onChange={(event) => {
                setToKey(event.target.value);
                setCopied(false);
                setCopyError(false);
              }}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {category.units.map((unit) => <option key={unit.key} value={unit.key}>{language === 'id' ? unit.id : unit.en}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{labels.result}</p>
          {result !== null ? (
            <p className="mt-2 break-words text-2xl font-semibold text-slate-900 dark:text-white" aria-live="polite">
              {resultText}
            </p>
          ) : (
            <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-300">
              {categoryKey === 'temperature' && isValidAmount ? labels.invalidTemperature : labels.invalid}
            </p>
          )}
          <button
            type="button"
            onClick={() => void copyResult()}
            disabled={result === null}
            className="mt-4 rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? labels.copied : labels.copy}
          </button>
          {copyError ? <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-300">{labels.copyError}</p> : null}
        </div>
      </div>
    </div>
  );
}
