'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Is ReByte free?',
    answer: 'Yes. ReByte is built to remain free and accessible without requiring any payments or subscriptions.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account is required. You can use most tools immediately without signing in.',
  },
  {
    question: 'Is my uploaded file stored?',
    answer: 'No. Whenever possible, files are processed directly in your browser and not uploaded to a server.',
  },
  {
    question: 'Can I use ReByte on mobile?',
    answer: 'Absolutely. ReByte is responsive and optimized for desktop, tablet, and mobile devices.',
  },
  {
    question: 'Will more tools be added?',
    answer: 'Yes. We are constantly adding new tools and improving existing ones based on user feedback.',
  },
];

export default function AboutFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">FAQ</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Frequently asked questions</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Find quick answers to the most common questions about how ReByte works.</p>
      </div>
      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50 transition hover:border-sky-300/40 dark:border-slate-800/70 dark:bg-slate-900/95">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <span className={`text-xl font-bold text-slate-900 transition ${isOpen ? 'rotate-45' : 'rotate-0'} dark:text-white`} aria-hidden="true">
                  +
                </span>
              </button>
              {isOpen ? (
                <div className="border-t border-slate-200/70 px-6 py-5 text-sm leading-6 text-slate-600 dark:border-slate-800/70 dark:text-slate-300">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
