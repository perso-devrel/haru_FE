import { useLocale, useTranslations } from 'next-intl';
import { appStoreUrl, playStoreUrl } from '@/lib/links';
import StoreBadge from './StoreBadge';

/**
 * Final call-to-action: real App Store + Google Play download buttons.
 * Replaced the early-access waitlist form once both listings went live.
 * Store badges are the recognizable black pill with white logo + caption,
 * so the brand marks read instantly regardless of locale.
 */
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
          <StoreBadge
            href={appStoreUrl(locale)}
            store="apple"
            caption={t('appStoreCaption')}
            name="App Store"
            size="lg"
          />
          <StoreBadge
            href={playStoreUrl(locale)}
            store="google"
            caption={t('playCaption')}
            name="Google Play"
            size="lg"
          />
        </div>

        <p className="mt-8 text-xs text-[color:var(--color-text-light)]">{t('ageNote')}</p>
      </div>
    </section>
  );
}
