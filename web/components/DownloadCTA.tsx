import { useLocale, useTranslations } from 'next-intl';
import { appStoreUrl, playStoreUrl } from '@/lib/links';
import { AppleLogo, GooglePlayLogo } from './StoreLogos';

/**
 * Final call-to-action: real App Store + Google Play download buttons.
 * Replaced the early-access waitlist form once both listings went live.
 * Store badges are the recognizable black pill with white logo + caption,
 * so the brand marks read instantly regardless of locale.
 */
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
            <AppleLogo size={26} />
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
            <GooglePlayLogo size={24} />
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
