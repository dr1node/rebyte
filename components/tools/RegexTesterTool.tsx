'use client';

import { useEffect, useState } from 'react';

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const found = [] as string[];
      let match;
      const source = regex.global ? text : `${text}`;
      if (regex.global) {
        while ((match = regex.exec(source)) !== null) {
          found.push(match[0]);
          if (match.index === regex.lastIndex) {
            regex.lastIndex += 1;
          }
        }
      } else {
        match = regex.exec(source);
        if (match) found.push(match[0]);
      }

      setMatches(found);
      setError('');
    } catch (err) {
      setMatches([]);
      setError('Invalid regular expression.');
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Test regular expressions in real time and see matches instantly.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Pattern
              <input
                type="text"
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
                placeholder="Enter regex pattern"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Flags
              <input
                type="text"
                value={flags}
                onChange={(event) => setFlags(event.target.value)}
                placeholder="e.g. gim"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Test text
              <textarea
                rows={8}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Enter the text to test against your regex"
                className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            {error ? (
              <p className="rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Matches</p>
            <div className="mt-4 min-h-[260px] overflow-hidden rounded-3xl bg-white p-4 dark:bg-slate-950">
              {matches.length ? (
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {matches.map((match, index) => (
                    <li key={`${match}-${index}`} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                      <code>{match}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Matches appear here as you type a valid pattern.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
