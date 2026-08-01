'use client';

import { useMemo, useState } from 'react';

const source = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'.split(' ');

export default function LoremIpsumGeneratorTool() {
  const [amount, setAmount] = useState('3');
  const [mode, setMode] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [seed, setSeed] = useState(0);
  const output = useMemo(() => {
    const count = Math.max(1, Math.min(100, Number(amount) || 1));
    const word = (index: number) => source[(index + seed) % source.length];
    const sentence = (offset: number) => `${Array.from({ length: 12 }, (_, index) => word(offset + index)).join(' ').replace(/^./, (char) => char.toUpperCase())}.`;
    if (mode === 'words') return Array.from({ length: count }, (_, index) => word(index)).join(' ');
    if (mode === 'sentences') return Array.from({ length: count }, (_, index) => sentence(index * 12)).join(' ');
    return Array.from({ length: count }, (_, paragraph) => Array.from({ length: 4 }, (_, index) => sentence(paragraph * 48 + index * 12)).join(' ')).join('\n\n');
  }, [amount, mode, seed]);

  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]"><label className="space-y-2"><span className="text-sm font-semibold text-slate-900 dark:text-white">Amount</span><input type="number" min="1" max="100" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><label className="space-y-2"><span className="text-sm font-semibold text-slate-900 dark:text-white">Generate by</span><select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></label><button type="button" onClick={() => setSeed((value) => value + 1)} className="self-end rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Generate</button></div><textarea value={output} readOnly rows={12} className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" /><button type="button" onClick={() => navigator.clipboard.writeText(output)} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">Copy text</button></div>;
}