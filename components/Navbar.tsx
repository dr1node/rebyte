'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import MobileNavDrawer from './MobileNavDrawer';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import InstallAppButton from './InstallAppButton';
import { useLanguage } from '../lib/LanguageContext';
import { getLocalizedTool } from '../lib/toolTranslations';
import { tools } from '../lib/tools';
import { setBodyScrollLocked } from '../lib/bodyScrollLock';
import logoImage from '../img/ReByte navbar logo.png';
import logoImageLight from '../img/ReByte navbar logo light mode.png';

const navigation = [
  { key: 'home', href: '/' },
  { key: 'tools', href: '/tools' },
  { key: 'about', href: '/about' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncThemeState = () => {
      const root = document.documentElement;
      const matchesDark = root.classList.contains('dark');
      setIsDarkMode(matchesDark);
    };

    syncThemeState();
    const observer = new MutationObserver(syncThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      setBodyScrollLocked(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    setBodyScrollLocked(true);
    searchInputRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      setBodyScrollLocked(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  const filteredTools = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    if (!normalized) {
      return tools.slice(0, 6);
    }

    return tools
      .filter((tool) => {
        const haystack = `${tool.name} ${tool.description} ${tool.category} ${tool.slug}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 8);
  }, [searchQuery]);

  const handleSelectTool = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(`/tools/${slug}`);
  };

  const navLinks = useMemo(
    () =>
      navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors duration-200 ${
            pathname === item.href
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          {t(item.key)}
        </Link>
      )),
    [pathname, t]
  );

  const controlButtonClassName =
    'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950';

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? 'border-slate-200/70 bg-white/90 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/90'
            : 'border-transparent bg-white/80 dark:bg-slate-950/80'
        } backdrop-blur-xl`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center text-slate-900 dark:text-white" aria-label="ReByte home">
            <div className="relative flex h-9 items-center justify-center sm:h-10 md:h-11">
              <Image
                src={isDarkMode ? logoImage : logoImageLight}
                alt="ReByte logo"
                width={320}
                height={100}
                priority
                sizes="(max-width: 640px) 152px, (max-width: 1024px) 192px, 208px"
                className="h-full w-auto max-w-[152px] object-contain sm:max-w-[192px] md:max-w-[208px]"
              />
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navLinks}
          </nav>

          <div className="flex items-center gap-2">
            <InstallAppButton />
            <div className="hidden md:flex md:items-center md:gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <button
              type="button"
              className={controlButtonClassName}
              aria-label={t('openSearch')}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={`${controlButtonClassName} md:hidden`}
              aria-label={t('openMenu')}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:px-6" role="dialog" aria-modal="true" aria-labelledby="tool-search-title">
          <button
            type="button"
            className="absolute inset-0"
            aria-label={t('closeSearch')}
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="relative w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <h2 id="tool-search-title" className="sr-only">
              {t('search')}
            </h2>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('searchTools')}
                className="flex-1 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                aria-label={t('search')}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={t('closeSearch')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.slug}
                    type="button"
                    onClick={() => handleSelectTool(tool.slug)}
                    className="flex w-full items-start justify-between rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{tool.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{getLocalizedTool(tool, language).description}</p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-950/50 dark:text-sky-300">
                      {tool.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {t('noToolsFound')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
