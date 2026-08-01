'use client';

import { useState, type ChangeEvent } from 'react';
import type { Tool } from '../lib/tools';
import { useLanguage } from '../lib/LanguageContext';

type CategoryOption = {
  key: string;
  label: string;
};

type SearchBarProps = {
  tools: Tool[];
  categories: ReadonlyArray<CategoryOption>;
  selectedCategory: string;
  // eslint-disable-next-line no-unused-vars
  onSearch: (value: Tool[]) => void;
  // eslint-disable-next-line no-unused-vars
  onQueryChange?: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onCategoryChange: (value: string) => void;
};

export default function SearchBar({
  tools,
  categories,
  selectedCategory,
  onSearch,
  onQueryChange,
  onCategoryChange,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const filterTools = (value: string, category: string) => {
    const normalized = value.toLowerCase().trim();

    return tools.filter((tool) => {
      const matchesCategory = !category || tool.category.toLowerCase() === category.toLowerCase();
      const matchesQuery =
        !normalized ||
        tool.name.toLowerCase().includes(normalized) ||
        tool.category.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(filterTools(value, selectedCategory));
    onQueryChange?.(value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onCategoryChange(value);
    onSearch(filterTools(query, value));
  };

  return (
    <div className="space-y-4">
      <label htmlFor="tool-search" className="sr-only">
        {t('search')}
      </label>
      <div className="grid gap-4 sm:grid-cols-[1.8fr_1fr]">
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder={t('searchTools')}
          className="w-full rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-4 text-sm text-slate-900 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.3)] outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-slate-800"
          aria-label={t('search')}
        />
        <label className="relative block">
          <span className="sr-only">{t('categories')}</span>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full appearance-none rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-4 text-sm text-slate-900 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.3)] outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-slate-800"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">▾</div>
        </label>
      </div>
    </div>
  );
}
