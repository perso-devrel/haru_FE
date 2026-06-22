import { AppleLogo, GooglePlayLogo } from './StoreLogos';

/**
 * The black store badge (white logo + caption + store name), shared by the
 * DownloadCTA section (size="lg") and the Navbar (size="sm") so both read as
 * the same design at two scales. On the small variant the text can collapse
 * below `sm` so the navbar row doesn't overflow on phones (logo-only pill).
 */
type Props = {
  href: string;
  store: 'apple' | 'google';
  caption: string;
  name: string;
  size?: 'lg' | 'sm';
  /** Hide caption + name below the `sm` breakpoint (logo-only). */
  collapseTextOnMobile?: boolean;
};

const SIZES = {
  lg: {
    box: 'gap-3 rounded-2xl px-6 py-3.5 shadow-[0_14px_34px_-12px_rgba(0,0,0,0.45)]',
    caption: 'text-[11px]',
    name: 'text-lg',
    apple: 26,
    google: 24,
  },
  sm: {
    box: 'gap-2 rounded-xl px-3.5 py-2 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.45)]',
    caption: 'text-[9px]',
    name: 'text-[13px]',
    apple: 18,
    google: 16,
  },
} as const;

export default function StoreBadge({
  href,
  store,
  caption,
  name,
  size = 'lg',
  collapseTextOnMobile = false,
}: Props) {
  const s = SIZES[size];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${caption} ${name}`}
      className={`inline-flex items-center ${s.box} bg-[#111111] text-white transition hover:scale-[1.03] hover:bg-black`}
    >
      {store === 'apple' ? <AppleLogo size={s.apple} /> : <GooglePlayLogo size={s.google} />}
      <span className={`text-left leading-tight ${collapseTextOnMobile ? 'hidden sm:block' : ''}`}>
        <span className={`block ${s.caption} font-medium opacity-80`}>{caption}</span>
        <span className={`block ${s.name} font-semibold`}>{name}</span>
      </span>
    </a>
  );
}
