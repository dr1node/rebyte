import Image from 'next/image';
import Link from 'next/link';
import type { Tool } from '../lib/tools';

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.28)] transition hover:-translate-y-1 hover:border-sky-300/60 hover:bg-slate-50 hover:shadow-[0_24px_50px_-24px_rgba(2,132,199,0.32)] dark:border-slate-800/80 dark:bg-slate-900/95 dark:hover:border-sky-500/50 dark:hover:bg-slate-950"
      aria-label={`Open ${tool.name}`}
      style={{ minWidth: '0' }}
    >
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-50 shadow-sm ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-slate-700">
          <Image src={tool.icon} alt={`${tool.name} icon`} width={28} height={28} />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
        <p
          className="mt-2 overflow-hidden text-sm leading-6 text-slate-600 dark:text-slate-300"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
        >
          {tool.description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-slate-100 px-3 py-1 uppercase tracking-[0.18em] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
          {tool.category}
        </span>
        {tool.popular ? <span className="font-medium text-sky-600 dark:text-sky-400">Popular</span> : null}
      </div>
    </Link>
  );
}
