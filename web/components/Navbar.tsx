import Link from 'next/link';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { appStoreUrl, playStoreUrl } from '@/lib/links';
import LangSwitcher from './LangSwitcher';
import { AppleLogo, GooglePlayLogo } from './StoreLogos';

/**
 * Absolutely-positioned header — it sits at the top of the page and
 * scrolls away with the content (it does NOT stay pinned to the viewport
 * as you scroll down). No background fill or blur: the wordmark + switcher
 * float directly over the hero so the hero behind them stays visible.
 *
 * Because the header is `position: absolute` it leaves no flow space,
 * so the page wrapper in app/[locale]/layout.tsx adds matching top
 * padding to prevent the hero from starting under it.
 */
export default function Navbar() {
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`${prefix}/`}
          className="transition hover:opacity-85"
          aria-label="haru — home"
        >
          <span
            className="font-pixel text-3xl font-extrabold lowercase tracking-tight md:text-4xl"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #FFC1A6 0%, #E27AA0 50%, #B85478 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            haru
          </span>
        </Link>

        {/* Right cluster: small store buttons + language toggle.
            Store buttons reuse the locale-aware links so they match the
            DownloadCTA section (Play forces hl/gl, App Store pins storefront). */}
        <div className="flex items-center gap-2">
          <a
            href={appStoreUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="App Store"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white/80 text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)]/40 hover:bg-white"
          >
            <AppleLogo size={17} />
          </a>
          <a
            href={playStoreUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Play"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white/80 text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)]/40 hover:bg-white"
          >
            <GooglePlayLogo size={15} />
          </a>
          <LangSwitcher />
        </div>
      </div>
    </header>
  );
}
