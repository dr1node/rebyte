'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/downloadFile';

type EntryType = 'income' | 'expense';
type BudgetEntry = {
  id: string;
  type: EntryType;
  description: string;
  category: string;
  amount: number;
  date: string;
};
type StorageStatus = 'loading' | 'ready' | 'unavailable';

const STORAGE_KEY = 'rebyte-monthly-budget-v1';
const expenseCategories = ['food', 'housing', 'transport', 'bills', 'health', 'education', 'shopping', 'other'];
const incomeCategories = ['salary', 'business', 'freelance', 'investment', 'other'];

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isBudgetEntry(value: unknown): value is BudgetEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string'
    && (entry.type === 'income' || entry.type === 'expense')
    && typeof entry.description === 'string'
    && typeof entry.category === 'string'
    && typeof entry.amount === 'number'
    && Number.isFinite(entry.amount)
    && entry.amount > 0
    && typeof entry.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(entry.date);
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export default function MonthlyBudgetTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('loading');
  const [type, setType] = useState<EntryType>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(localDateString);
  const [month, setMonth] = useState(localDateString().slice(0, 7));
  const [error, setError] = useState('');
  const skipNextSaveRef = useRef(false);

  const labels = isIndonesian
    ? {
        description: 'Catat pemasukan dan pengeluaran bulanan. Data disimpan hanya di browser ini dan dapat dihapus kapan saja.',
        type: 'Jenis transaksi',
        income: 'Pemasukan',
        expense: 'Pengeluaran',
        details: 'Nama transaksi',
        detailsPlaceholder: 'Contoh: Belanja mingguan',
        category: 'Kategori',
        amount: 'Jumlah (IDR)',
        date: 'Tanggal',
        add: 'Tambah transaksi',
        month: 'Bulan yang ditampilkan',
        incomeTotal: 'Total pemasukan',
        expenseTotal: 'Total pengeluaran',
        balance: 'Selisih',
        transactions: 'Transaksi bulan ini',
        noEntries: 'Belum ada transaksi untuk bulan ini.',
        deleteEntry: 'Hapus',
        export: 'Ekspor CSV bulan ini',
        clear: 'Hapus semua data',
        clearConfirm: 'Hapus semua data anggaran yang tersimpan di browser ini?',
        required: 'Isi nama transaksi, jumlah yang lebih dari 0, dan tanggal yang valid.',
        loadError: 'Data anggaran tidak dapat dibaca dari penyimpanan browser. Hapus data tersimpan untuk memulai lagi; perubahan baru tidak akan tersimpan sampai itu berhasil.',
        saveError: 'Browser tidak dapat menyimpan data anggaran. Anda masih dapat mengekspornya sebagai CSV.',
        csvError: 'CSV tidak dapat dibuat.',
        stored: 'Tersimpan di browser ini saja. Data tidak dikirim ke server.',
        categories: {
          food: 'Makanan',
          housing: 'Tempat tinggal',
          transport: 'Transportasi',
          bills: 'Tagihan',
          health: 'Kesehatan',
          education: 'Pendidikan',
          shopping: 'Belanja',
          salary: 'Gaji',
          business: 'Usaha',
          freelance: 'Freelance',
          investment: 'Investasi',
          other: 'Lainnya',
        } as Record<string, string>,
      }
    : {
        description: 'Track monthly income and expenses. Data is stored only in this browser and can be cleared at any time.',
        type: 'Transaction type',
        income: 'Income',
        expense: 'Expense',
        details: 'Transaction name',
        detailsPlaceholder: 'For example: Weekly groceries',
        category: 'Category',
        amount: 'Amount (IDR)',
        date: 'Date',
        add: 'Add transaction',
        month: 'Showing month',
        incomeTotal: 'Total income',
        expenseTotal: 'Total expenses',
        balance: 'Balance',
        transactions: 'Transactions this month',
        noEntries: 'There are no transactions for this month yet.',
        deleteEntry: 'Delete',
        export: 'Export this month as CSV',
        clear: 'Clear all data',
        clearConfirm: 'Clear all budget data stored in this browser?',
        required: 'Enter a transaction name, an amount above 0, and a valid date.',
        loadError: 'Budget data could not be read from browser storage. Clear the saved data to start again; new changes will not be saved until that succeeds.',
        saveError: 'Your browser could not save the budget data. You can still export it as CSV.',
        csvError: 'Unable to create the CSV file.',
        stored: 'Stored only in this browser. No data is sent to a server.',
        categories: {
          food: 'Food',
          housing: 'Housing',
          transport: 'Transport',
          bills: 'Bills',
          health: 'Health',
          education: 'Education',
          shopping: 'Shopping',
          salary: 'Salary',
          business: 'Business',
          freelance: 'Freelance',
          investment: 'Investment',
          other: 'Other',
        } as Record<string, string>,
      };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(isBudgetEntry)) throw new Error('Invalid saved budget data');
        setEntries(parsed);
      }
      setStorageStatus('ready');
    } catch (caughtError) {
      console.error('Unable to load monthly budget:', caughtError);
      setStorageStatus('unavailable');
      setError(labels.loadError);
    }
  }, [labels.loadError]);

  useEffect(() => {
    if (storageStatus !== 'ready') return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (caughtError) {
      console.error('Unable to save monthly budget:', caughtError);
      setStorageStatus('unavailable');
      setError(labels.saveError);
    }
  }, [entries, labels.saveError, storageStatus]);

  const categoryIds = type === 'expense' ? expenseCategories : incomeCategories;
  const monthEntries = useMemo(
    () => entries.filter((entry) => entry.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date)),
    [entries, month],
  );
  const income = monthEntries.filter((entry) => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = monthEntries.filter((entry) => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
  const currencyFormat = new Intl.NumberFormat(isIndonesian ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 2,
  });
  const formatMoney = (value: number) => currencyFormat.format(value);

  const addEntry = () => {
    const parsedAmount = Number(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !date) {
      setError(labels.required);
      return;
    }
    const newEntry: BudgetEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      description: description.trim(),
      category,
      amount: parsedAmount,
      date,
    };
    setEntries((current) => [...current, newEntry]);
    setDescription('');
    setAmount('');
    setDate(localDateString());
    setError('');
  };

  const deleteAll = () => {
    if (!window.confirm(labels.clearConfirm)) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      skipNextSaveRef.current = true;
      setEntries([]);
      setStorageStatus('ready');
      setError('');
    } catch (caughtError) {
      console.error('Unable to clear monthly budget:', caughtError);
      setEntries([]);
      setStorageStatus('unavailable');
      setError(labels.saveError);
    }
  };

  const exportCsv = () => {
    try {
      const rows = [
        [isIndonesian ? 'Tanggal' : 'Date', isIndonesian ? 'Jenis' : 'Type', isIndonesian ? 'Kategori' : 'Category', isIndonesian ? 'Nama' : 'Name', isIndonesian ? 'Jumlah IDR' : 'Amount IDR'],
        ...monthEntries.map((entry) => [
          entry.date,
          entry.type === 'income' ? labels.income : labels.expense,
          labels.categories[entry.category] ?? labels.categories.other,
          entry.description,
          String(entry.amount),
        ]),
      ];
      const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `budget-${month}.csv`);
      setError('');
    } catch (caughtError) {
      console.error('Unable to export monthly budget:', caughtError);
      setError(labels.csvError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{labels.stored}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.type}
            <select value={type} onChange={(event) => { const next = event.target.value as EntryType; setType(next); setCategory(next === 'income' ? 'salary' : 'food'); }} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <option value="expense">{labels.expense}</option><option value="income">{labels.income}</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.category}
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              {categoryIds.map((id) => <option key={id} value={id}>{labels.categories[id]}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.details}
            <input value={description} onChange={(event) => setDescription(event.target.value)} maxLength={120} placeholder={labels.detailsPlaceholder} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.amount}
            <input type="number" min="0.01" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.date}
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
          <button type="button" disabled={storageStatus === 'loading'} onClick={addEntry} className="self-end rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">{labels.add}</button>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.month}
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="mt-2 block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={!monthEntries.length} onClick={exportCsv} className="rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">{labels.export}</button>
            <button type="button" onClick={deleteAll} className="rounded-3xl border border-rose-300 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-800 dark:text-rose-300">{labels.clear}</button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-live="polite">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{labels.incomeTotal}</p><p className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatMoney(income)}</p></div>
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{labels.expenseTotal}</p><p className="mt-2 text-xl font-bold text-rose-700 dark:text-rose-300">{formatMoney(expenses)}</p></div>
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{labels.balance}</p><p className={`mt-2 text-xl font-bold ${income - expenses < 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-white'}`}>{formatMoney(income - expenses)}</p></div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{labels.transactions}</h3>
          {monthEntries.length ? <div className="mt-3 space-y-3">
            {monthEntries.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-900 dark:text-white">{entry.description}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.date} · {labels.categories[entry.category] ?? labels.categories.other}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-semibold ${entry.type === 'income' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{entry.type === 'income' ? '+' : '−'}{formatMoney(entry.amount)}</p>
                  <button type="button" aria-label={`${labels.deleteEntry}: ${entry.description}`} onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">{labels.deleteEntry}</button>
                </div>
              </div>
            ))}
          </div> : <p className="mt-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">{labels.noEntries}</p>}
        </div>

        {error ? <p role="alert" className="mt-5 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
      </div>
    </div>
  );
}
