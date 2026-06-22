import { useLocale, useTranslations } from 'next-intl';
import { appStoreUrl, playStoreUrl } from '@/lib/links';

/**
 * Final call-to-action: real App Store + Google Play download buttons.
 * Replaced the early-access waitlist form once both listings went live.
 * Store badges are the recognizable black pill with white logo + caption,
 * so the brand marks read instantly regardless of locale.
 */
function AppleLogo() {
  return (
    <svg viewBox="0 0 384 512" width="26" height="26" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GooglePlayLogo() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

const badgeClass =
  'inline-flex items-center gap-3 rounded-2xl bg-[#111111] px-6 py-3.5 text-white shadow-[0_14px_34px_-12px_rgba(0,0,0,0.45)] transition hover:scale-[1.03] hover:bg-black';

export default function DownloadCTA() {
  const t = useTranslations('download');
  const locale = useLocale();

  return (
    <section id="download" className="scroll-mt-24">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-primary-dark)]">
          {t('eyebrow')}
        </span>
        <h2 className="mt-4 break-keep text-3xl font-bold leading-tight text-[color:var(--color-text)] md:text-4xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-md break-keep text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {t('description')}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={appStoreUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className={badgeClass}
            aria-label={`${t('appStoreCaption')} App Store`}
          >
            <AppleLogo />
            <span className="text-left leading-tight">
              <span className="block text-[11px] font-medium opacity-80">{t('appStoreCaption')}</span>
              <span className="block text-lg font-semibold">App Store</span>
            </span>
          </a>

          <a
            href={playStoreUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className={badgeClass}
            aria-label={`${t('playCaption')} Google Play`}
          >
            <GooglePlayLogo />
            <span className="text-left leading-tight">
              <span className="block text-[11px] font-medium opacity-80">{t('playCaption')}</span>
              <span className="block text-lg font-semibold">Google Play</span>
            </span>
          </a>
        </div>

        <p className="mt-8 text-xs text-[color:var(--color-text-light)]">{t('ageNote')}</p>
      </div>
    </section>
  );
}
