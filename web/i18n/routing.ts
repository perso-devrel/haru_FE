import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en', 'ja'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed',
  // On first visit (no NEXT_LOCALE cookie), detect the visitor's language
  // from the Accept-Language header — which browsers populate from the
  // device/OS system language — and redirect to the matching locale
  // (e.g. a Japanese device hitting '/' is sent to '/ja'). Once the visitor
  // picks a language via the switcher, that choice is stored in a cookie and
  // takes precedence on later visits.
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string | undefined): value is AppLocale {
  return typeof value === 'string' && (routing.locales as readonly string[]).includes(value);
}
