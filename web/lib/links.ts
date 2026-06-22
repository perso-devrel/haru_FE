// Shared external links so the store identifiers live in exactly one place.
// Update here if a listing moves.

const PLAY_APP_ID = 'com.haruvoice.app';
// App Store Connect numeric App ID (ascAppId in haru_FE/eas.json).
const APP_STORE_ID = 'id6779128759';

// Per-locale store targeting. Play accepts hl (UI language) + gl (country),
// which is exactly what Play appends to its own internal links — so a bare
// link falls back to the browser Accept-Language instead. App Store has no
// language param; the path country code only pins the storefront (the shown
// language still follows the device locale).
const STORE_REGION: Record<string, { hl: string; gl: string; appCountry: string }> = {
  ko: { hl: 'ko', gl: 'KR', appCountry: 'kr' },
  ja: { hl: 'ja', gl: 'JP', appCountry: 'jp' },
  en: { hl: 'en', gl: 'US', appCountry: 'us' },
};

function region(locale: string) {
  return STORE_REGION[locale] ?? STORE_REGION.en;
}

export function playStoreUrl(locale: string): string {
  const { hl, gl } = region(locale);
  return `https://play.google.com/store/apps/details?id=${PLAY_APP_ID}&hl=${hl}&gl=${gl}`;
}

export function appStoreUrl(locale: string): string {
  const { appCountry } = region(locale);
  return `https://apps.apple.com/${appCountry}/app/${APP_STORE_ID}`;
}
