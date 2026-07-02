import Link from 'next/link';
import AboutFAQ from '../../components/AboutFAQ';

export const metadata = {
  title: 'About · ReByte',
  description: 'Learn more about ReByte, a modern suite of free online utilities.',
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95 sm:p-12">
          <div className="absolute inset-x-0 top-0 h-72 bg-hero-stripes opacity-80 dark:opacity-60" />
          <div className="relative grid gap-12">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-sky-900/15 dark:text-sky-300">
                About ReByte
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Powerful browser tools with speed, privacy, and no distractions.
              </h1>
              <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                ReByte is a curated collection of web utilities built for the modern web. No login, no database, and no waiting—just fast, reliable tools that help you finish work and keep moving.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/95">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Our mission</p>
                <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200">Create approachable utilities that work instantly in the browser, with privacy built in and interfaces designed for clarity.</p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/95">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Our promise</p>
                <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200">Keep tools free, fast, and easy to use without forcing signup, tracking, or backend complexity.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Tools available', value: '40+' },
                { label: 'No login needed', value: '100%' },
                { label: 'Built for', value: 'browser-first workflows' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/95">
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/tools" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Browse tools
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                Explore the homepage
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Why ReByte</p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">Built for practical work, not for hype.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Every utility is designed to solve a real task quickly. ReByte focuses on usefulness, clarity, and a smooth browser experience across desktop and mobile.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Privacy-first', content: 'Most tools run entirely in the browser, so your data stays local.' },
                  { title: 'Instant access', content: 'Open a tool, paste your input, and get results within seconds.' },
                  { title: 'Developer-ready', content: 'Includes converters, encoders, PDF utilities, and debugging helpers.' },
                  { title: 'Modern design', content: 'Clean UI with responsive layout and accessible controls.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Product focus</p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">What we build</h2>
              <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span>Compact, usable tools for everyday browser workflows.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span>Privacy-minded experiences with minimal external dependencies.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span>High-quality utility pages with clear guidance and instant feedback.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Core values</p>
              <div className="mt-8 space-y-6">
                {[
                  { title: 'Simplicity', description: 'Remove unnecessary options and make each tool feel effortless to use.' },
                  { title: 'Reliability', description: 'Ensure tools work consistently without extra setup or hidden steps.' },
                  { title: 'Transparency', description: 'Be open about how tools process data and what happens in the browser.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Roadmap</p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">What’s next</h2>
              <div className="mt-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white">More PDF & developer tools</p>
                  <p className="mt-2">Continuously expand utilities for workflows like PDF editing, image conversion, regex testing, and token decoding.</p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white">Improved sharing</p>
                  <p className="mt-2">Add easier ways to share results, export outputs, and move data between tools.</p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white">Faster onboarding</p>
                  <p className="mt-2">Offer more guided help for new users and smarter search for finding the right tool fast.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Modern utility toolkit</p>
            <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">Designed for teams, builders, and anyone who values speed.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'PDF Saver', body: 'Compress, merge, split, and convert files without uploading them.' },
                { title: 'Dev helpers', body: 'JWT decode, URL encode, regex testing, and barcode generation.' },
                { title: 'Image workflow', body: 'Convert, resize, and export images in the browser.' },
                { title: 'Text utilities', body: 'Markdown preview, JSON formatting, and case conversion.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Commitment</p>
              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                ReByte is about practical tools that reduce friction for everyday tasks. We keep the experience fast and distraction-free by avoiding unnecessary features.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  'No sign-up required',
                  'No hidden tracking',
                  'All tools accessible in-browser',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Get started</p>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">Start using tools in seconds.</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Open the tools page, choose a utility, and paste your content. No setup required.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tools" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  View tools
                </Link>
                <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  Return home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Meet the Developer</p>
          <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">Independently designed and built.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            ReByte is independently designed and developed by Regi.
          </p>
          <div className="mt-6">
            <a
              href="https://itsrex.xo.je/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Visit Portfolio
            </a>
          </div>
        </div>

        <div className="mt-12">
          <AboutFAQ />
        </div>
      </div>
    </div>
  );
}
