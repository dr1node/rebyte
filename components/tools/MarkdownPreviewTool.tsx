'use client';

import { useMemo, useState } from 'react';

const sanitizeMarkdown = (text: string) => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let html = escaped
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+?)`/gim, '<code>$1</code>')
    .replace(/^### (.*)$/gim, '<h3>$1</h3>')
    .replace(/^## (.*)$/gim, '<h2>$1</h2>')
    .replace(/^# (.*)$/gim, '<h1>$1</h1>')
    .replace(/^>\s?(.*)$/gim, '<blockquote>$1</blockquote>')
    .replace(/^\s*-\s+(.*)$/gim, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*)$/gim, '<li>$1</li>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  html = html
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/<p><ul>/gim, '<ul>')
    .replace(/<\/ul><\/p>/gim, '</ul>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br />');

  return `<p>${html}</p>`;
};

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState('# Markdown Preview\n\nType **Markdown** on the left to see headings, lists, links, and code blocks.\n\n## Features\n\n- Bold text with **double asterisks**\n- Italic text with *single asterisks*\n- Links like [ReByte](https://example.com)\n\n```js\nconsole.log("Hello Markdown");\n```');

  const rendered = useMemo(() => sanitizeMarkdown(markdown), [markdown]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <label className="space-y-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Markdown Input</span>
        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          rows={16}
          className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
          placeholder="Type Markdown here..."
        />
      </label>

      <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Preview</span>
        </div>
        <div className="prose prose-slate max-w-none overflow-auto text-sm leading-7 text-slate-700 dark:prose-invert dark:text-slate-200" dangerouslySetInnerHTML={{ __html: rendered }} />
      </div>
    </div>
  );
}
