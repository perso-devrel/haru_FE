import { useTranslations } from 'next-intl';
import type { ArtProfileData } from '@/lib/cardData';

/**
 * Art-profile feature visual — a before → after pair that shows a real photo
 * being turned into the app's watercolor "art profile". Two shots (shown at
 * their natural aspect, not cropped) with an arrow between them; captions name
 * each side. Plain <img> so the photos render uncropped. No phone, no audio.
 */
export default function ArtProfileCard({
  data,
  originalAlt,
  convertedAlt,
}: {
  data: ArtProfileData;
  originalAlt: string;
  convertedAlt: string;
}) {
  const t = useTranslations('features.art');

  return (
    <div className="art-card">
      <figure className="art-shot">
        <div className="art-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.original} alt={originalAlt} width={720} height={960} loading="lazy" />
        </div>
        <figcaption className="art-caption">{t('before')}</figcaption>
      </figure>

      <span className="art-arrow" aria-hidden>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h15" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>

      <figure className="art-shot">
        <div className="art-frame art-frame--art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.converted} alt={convertedAlt} width={720} height={960} loading="lazy" />
          <span className="art-badge" aria-hidden>✨</span>
        </div>
        <figcaption className="art-caption art-caption--art">{t('after')}</figcaption>
      </figure>
    </div>
  );
}
