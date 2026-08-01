'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'rebyte-theme';

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const nextTheme = storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      const root = document.documentElement;

      root.classList.toggle('dark', nextTheme === 'dark');
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    } catch (_) {
      // Keep the server-bootstrapped theme when storage is unavailable.
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    const root = document.documentElement;

    root.classList.add('theme-transition');
    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme;
    setTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (_) {
      // Theme still applies for the current session when storage is unavailable.
    }

    window.setTimeout(() => root.classList.remove('theme-transition'), 300);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="group inline-flex h-11 w-[4.5rem] items-center rounded-full border border-slate-200 bg-slate-100 p-1 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:focus-visible:ring-offset-slate-950"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-transform duration-200 ${
          isDark ? 'translate-x-7 bg-slate-700 text-sky-300' : 'translate-x-0 bg-white text-amber-500'
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      </span>
    </button>
  );
}