import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import ko from './locales/ko';
import en from './locales/en';
import ja from './locales/ja';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
} as const;

export type SupportedLanguage = keyof typeof resources;

const SUPPORTED: readonly SupportedLanguage[] = ['ko', 'en', 'ja'];
const LANG_KEY = 'app_language';

const isSupported = (v: string | null | undefined): v is SupportedLanguage =>
  v != null && (SUPPORTED as readonly string[]).includes(v);

function detectSystemLanguage(): SupportedLanguage {
  const primary = getLocales()[0]?.languageCode ?? 'ko';
  return isSupported(primary) ? primary : 'ko';
}

// Boot sync with the system locale so the first paint never blocks on storage.
// If the user previously picked a different language in settings, we overlay
// it asynchronously below — a one-frame flash is acceptable for a setting the
// user explicitly chose.
i18n.use(initReactI18next).init({
  resources,
  lng: detectSystemLanguage(),
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

SecureStore.getItemAsync(LANG_KEY)
  .then((stored) => {
    if (isSupported(stored) && i18n.language !== stored) {
      i18n.changeLanguage(stored);
    }
  })
  .catch(() => {
    // Storage read failures fall back to the system-detected language.
  });

export async function setAppLanguage(lang: SupportedLanguage) {
  await i18n.changeLanguage(lang);
  await SecureStore.setItemAsync(LANG_KEY, lang);
}

export const SUPPORTED_APP_LANGUAGES = SUPPORTED;

export default i18n;
