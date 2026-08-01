'use client';

import Image from 'next/image';
import Breadcrumb from './Breadcrumb';
import ToolRenderer from './ToolRenderer';
import LocalizedToolContent from './LocalizedToolContent';
import { useLanguage } from '../lib/LanguageContext';
import { getLocalizedTool } from '../lib/toolTranslations';
import { tools } from '../lib/tools';

export default function ToolDetailClient({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return null;
  const localizedTool = getLocalizedTool(tool, language);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumb items={[{ label: language === 'id' ? 'Beranda' : 'Home', href: '/' }, { label: language === 'id' ? 'Alat' : 'Tools', href: '/tools' }, { label: localizedTool.name, href: `/tools/${tool.slug}` }]} />
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_0.55fr] lg:items-start">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 shadow-sm dark:bg-slate-900">
                  <Image src={tool.icon} alt={`${localizedTool.name} icon`} width={32} height={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{localizedTool.category}</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{localizedTool.name}</h1>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{localizedTool.description}</p>
              <div className="mt-10 rounded-3xl border border-slate-200/70 bg-slate-50 p-8 dark:border-slate-800/70 dark:bg-slate-900/95">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Area alat' : 'Tool area'}</h2>
                <ToolRenderer slug={tool.slug} />
              </div>
              <LocalizedToolContent slug={tool.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
