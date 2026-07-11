'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { categories, tools } from '../lib/tools';
import ToolCard from './ToolCard';
import SearchBar from './SearchBar';
import FAQSection from './FAQSection';

export default function HomeSection() {
  const [filteredTools, setFilteredTools] = useState(tools);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const popularTools = useMemo(() => {
    const popular = tools.filter((tool) => tool.popular);
    if (popular.length >= 6) return popular.slice(0, 6);
    return [...popular, ...tools.filter((tool) => !tool.popular).slice(0, 6 - popular.length)];
  }, []);

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div className="absolute inset-x-0 top-0 h-72 bg-hero-stripes opacity-90 dark:opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/95 sm:p-12">
          <div className="grid gap-10">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm dark:bg-sky-900/15 dark:text-sky-300">
                Free Online Tools
              </p>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Fast, privacy-friendly tools for developers, students, and everyone.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  A modern suite of utility tools built for performance, accessibility, and scalability without databases or login.
                </p>
              </div>
              <div className="max-w-xl">
                <SearchBar
                  tools={tools}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSearch={setFilteredTools}
                  onQueryChange={setSearchQuery}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              {(searchQuery || selectedCategory) && (
                <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50/90 p-6 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.26)] dark:border-slate-800/70 dark:bg-slate-900/95">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Search results</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Showing {filteredTools.length} result{filteredTools.length === 1 ? '' : 's'}
                        {selectedCategory ? ` in ${selectedCategory}` : ''}
                        {searchQuery ? ` for "${searchQuery}"` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTools.length > 0 ? (
                      filteredTools.slice(0, 6).map((tool) => <ToolCard key={tool.slug} tool={tool} />)
                    ) : (
                      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-10 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-950/95">
                        <p className="text-slate-700 dark:text-slate-300">No tools match your search. Try a different keyword or category.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Popular tools</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Top tools our users rely on</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {popularTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/tools" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 dark:shadow-none">
              View all tools
            </Link>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection />
        </div>
      </div>
    </section>
  );
}
