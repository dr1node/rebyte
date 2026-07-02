const faqs = [
  {
    question: 'Are all tools free to use?',
    answer: 'Yes, all utilities are intended for free use and do not require login.',
  },
  {
    question: 'Is my data stored?',
    answer: 'No, all processing happens in the browser and data is not stored on a server.',
  },
  {
    question: 'Can I search tools by category?',
    answer: 'Yes, search filters by name, category, and description.',
  },
];

export default function FAQSection() {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">FAQ</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Questions answered</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {faqs.map((item) => (
          <div key={item.question} className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/95">
            <h3 className="font-semibold text-slate-900 dark:text-white">{item.question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
