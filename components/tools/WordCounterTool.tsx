'use client';

import { useMemo, useState } from 'react';

export default function WordCounterTool() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) ?? []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((item) => item.trim()).length : 0;
    return { words, characters: text.length, charactersNoSpaces: text.replace(/\s/g, '').length, sentences, paragraphs, reading: words ? Math.max(1, Math.ceil(words / 200)) : 0, speaking: words ? Math.max(1, Math.ceil(words / 130)) : 0 };
  }, [text]);
  const metrics = [['Words', stats.words], ['Characters', stats.characters], ['Characters (no spaces)', stats.charactersNoSpaces], ['Sentences', stats.sentences], ['Paragraphs', stats.paragraphs], ['Reading time', `${stats.reading} min`], ['Speaking time', `${stats.speaking} min`]];

  return <div className="space-y-6"><textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} placeholder="Type or paste your text here..." className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-3xl border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p></div>)}</div></div>;
}