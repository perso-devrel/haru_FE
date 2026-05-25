import { useTranslations } from 'next-intl';

const APP_STORE_URL = 'https://apps.apple.com/app/id000000000';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.voicemate.app';

export default function AppStoreCTA() {
  const t = useTranslations('cta');
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
      <div className="relative overflow-hidden rounded-[40px] border border-[color:var(--color-border)] bg-white p-10 text-center shadow-glow md:p-16">
        <span className="aura" aria-hidden />
        <h2 className="break-keep text-3xl font-semibold text-[color:var(--color-text)] md:text-4xl lg:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl break-keep text-base text-[color:var(--color-text-secondary)] md:text-lg">
          {t('body')}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={PLAY_STORE_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-gradient px-7 py-3.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(226,122,160,0.6)] transition hover:scale-[1.02] sm:w-auto"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 20.5V3.5a1 1 0 011.5-.87l13 7.5a1 1 0 010 1.74l-13 7.5A1 1 0 013 20.5z" />
            </svg>
            {t('playStore')}
          </a>
          <a
            href={APP_STORE_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[color:var(--color-primary)] bg-white px-7 py-3.5 font-semibold text-[color:var(--color-primary-dark)] transition hover:bg-[color:var(--color-primary-light)] sm:w-auto"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.05 12.04c-.03-2.7 2.2-4.01 2.31-4.07-1.26-1.84-3.22-2.09-3.91-2.12-1.66-.17-3.24.98-4.09.98s-2.15-.96-3.54-.93C5.83 5.93 4.1 6.99 3.16 8.7c-1.95 3.37-.5 8.35 1.4 11.08.92 1.34 2.02 2.84 3.45 2.79 1.38-.06 1.9-.9 3.57-.9 1.66 0 2.13.9 3.59.86 1.48-.03 2.42-1.36 3.32-2.71 1.05-1.55 1.49-3.05 1.52-3.13-.03-.01-2.92-1.12-2.96-4.45zM14.4 4.05c.76-.92 1.27-2.2 1.13-3.46-1.09.04-2.41.72-3.19 1.64-.7.81-1.31 2.1-1.15 3.34 1.22.1 2.46-.61 3.21-1.52z" />
            </svg>
            {t('appStore')}
          </a>
        </div>
        <p className="mt-6 text-xs text-[color:var(--color-text-light)]">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
