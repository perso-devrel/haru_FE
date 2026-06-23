import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/site-url';

// localePrefix is 'as-needed': the default locale (ko) is served without a
// prefix, the others under /en and /ja. So the same logical page lives at
// three URLs that must point at each other via hreflang, and each locale's
// own URL is its canonical.
function localePath(base: string, locale: string, path: string): string {
  const seg = path ? `/${path.replace(/^\//, '')}` : '';
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${base}${prefix}${seg}`;
}

// Build per-page hreflang + canonical. `path` is the route below the locale
// segment ('' for home, 'privacy', 'terms', ...). Pass the result into a
// page's generateMetadata so canonical resolves to *that* page (not the home).
export function buildAlternates(locale: string, path = ''): Metadata['alternates'] {
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localePath(base, l, path);
  }
  languages['x-default'] = localePath(base, routing.defaultLocale, path);
  return {
    canonical: localePath(base, locale, path),
    languages,
  };
}
