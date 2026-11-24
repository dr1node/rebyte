export const RECENT_TOOLS_STORAGE_KEY = 'rebyte-recent-tools';
export const RECENT_TOOLS_CHANGE_EVENT = 'rebyte-recent-tools-change';

const DEFAULT_RECENT_TOOLS_LIMIT = 12;

export function getRecentToolSlugs(limit = DEFAULT_RECENT_TOOLS_LIMIT): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return Array.from(new Set(
      parsed
        .filter((slug): slug is string => typeof slug === 'string')
        .map((slug) => slug === 'sha-256-generator' ? 'hash-generator' : slug),
    )).slice(0, limit);
  } catch (error) {
    console.warn('Unable to read recent tools from browser storage:', error);
    return [];
  }
}

export function recordRecentTool(
  slug: string,
  limit = DEFAULT_RECENT_TOOLS_LIMIT,
) {
  if (typeof window === 'undefined' || !slug) return;

  const previous = getRecentToolSlugs(limit);
  const next = [slug, ...previous.filter((item) => item !== slug)].slice(0, limit);

  try {
    window.localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Unable to save recent tools to browser storage:', error);
    return;
  }

  window.dispatchEvent(new CustomEvent(RECENT_TOOLS_CHANGE_EVENT));
}
