// Whitelisted spoken languages for launch (BCP-47 short codes). Drives both
// profile language picker and matching preference picker. Note: this is the
// set of *spoken languages a user can register on their profile*, not the
// app UI locales (those are tracked separately in `src/i18n/locales/`).
// Keep in sync with `haru_BE/src/schemas/profile.ts` `LANGUAGE_CODES`.
export const SUPPORTED_LANGUAGES = [
  { code: 'ko', labelKey: 'languages.ko' },
  { code: 'ja', labelKey: 'languages.ja' },
  { code: 'en', labelKey: 'languages.en' },
  { code: 'th', labelKey: 'languages.th' },
  { code: 'hi', labelKey: 'languages.hi' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as readonly LanguageCode[];

export const isLanguageCode = (value: string): value is LanguageCode =>
  (LANGUAGE_CODES as readonly string[]).includes(value);
