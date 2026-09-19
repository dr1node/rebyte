import { toolComponents } from './toolRegistry';

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 text-sm text-slate-700 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)] dark:border-slate-800/70 dark:bg-slate-900/95 dark:text-slate-300">
        This tool is under development. Please check back later or choose another tool from the list.
      </div>
    );
  }

  return <Component />;
}
