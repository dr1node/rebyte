'use client';

import Link from 'next/link';

export default function Breadcrumb({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <Link href={item.href} className="hover:text-slate-900 dark:hover:text-white">
              {item.label}
            </Link>
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
