import Link from 'next/link';
import { tools, categories } from '../../lib/tools';
import ToolCard from '../../components/ToolCard';

export const metadata = {
  title: 'Tools · ReByte',
  description: 'Browse all available utility tools organized by category.',
};

export default function ToolsPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category;
  const filteredTools = category
    ? tools.filter((tool) => tool.category.toLowerCase() === category.toLowerCase())
    : tools;

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Tools</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Browse utility tools</h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Explore tools by category and find the utility you need for PDF, image, text, developer, network, and utility tasks.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <Link
              key={item.key}
              href={`/tools?category=${item.key}`}
              className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-center text-slate-900 shadow-soft transition hover:-translate-y-1 dark:border-slate-800/80 dark:bg-slate-900/95 dark:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.length ? (
            filteredTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)
          ) : (
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-10 text-center dark:border-slate-800/80 dark:bg-slate-900/95">
              <p className="text-slate-700 dark:text-slate-300">No tools found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
