import Link from 'next/link';
import { categories } from '../lib/tools';

export default function CategorySection() {
  return (
    <section id="categories" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Browse categories</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Find the right tool fast</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.key}
            href={`/tools?category=${category.key}`}
            className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-sky-300/40 dark:border-slate-800/80 dark:bg-slate-900/95"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{category.label}</p>
            <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{category.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
