'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { AGE_UNIT, type DiscoverCardData, type Locale } from '@/lib/cardData';

/**
 * Faithful HTML/CSS recreation of the app's discover SwipeCard
 * (haru_FE/src/components/discover/SwipeCard.tsx) — no phone frame, just the
 * card, with the voice intro actually playable. Tokens (colours, radii, the
 * deterministic 32-bar waveform) are ported verbatim from the app so the
 * marketing card matches what users see in-app.
 *
 * The dark translucent card body is kept exactly as in-app (per product
 * decision) even though it sits on the light landing background.
 */

const WAVE_BAR_COUNT = 32;
const WAVE_MAX_HEIGHT = 48;
const WAVE_MIN_HEIGHT = 6;

// Ported verbatim from SwipeCard.BASE_WAVEFORM — four Gaussian peaks modulated
// by a fast per-bar oscillation, giving an utterance-like waveform. Computed
// here (not hard-coded) so it stays identical to the app if the app changes.
const BASE_WAVEFORM: number[] = Array.from({ length: WAVE_BAR_COUNT }, (_, i) => {
  const t = i / (WAVE_BAR_COUNT - 1);
  const peak = (center: number, width: number, amp: number) =>
    amp * Math.exp(-Math.pow((t - center) / width, 2));
  const envelope =
    peak(0.13, 0.08, 0.55) + peak(0.34, 0.1, 0.95) + peak(0.58, 0.09, 0.78) + peak(0.82, 0.09, 0.85);
  const detail = 0.55 + 0.3 * Math.sin(i * 2.1 + 0.5) + 0.15 * Math.sin(i * 0.9 + 1.7);
  const normalized = Math.max(0.04, Math.min(1, envelope * detail));
  return Math.round(WAVE_MIN_HEIGHT + (WAVE_MAX_HEIGHT - WAVE_MIN_HEIGHT) * normalized);
});

export default function DiscoverCard({
  data,
  locale,
  alt,
}: {
  data: DiscoverCardData;
  locale: Locale;
  alt: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const gradId = useId();

  const tick = useCallback(() => {
    const a = audioRef.current;
    if (a && a.duration > 0) setProgress(Math.min(Math.max(a.currentTime / a.duration, 0), 1));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    if (a.duration > 0 && a.currentTime >= a.duration) a.currentTime = 0;
    void a.play().catch(() => {
      // Autoplay/blocked — surface nothing; the user can tap again.
    });
  }, [playing]);

  const onPlay = useCallback(() => {
    setPlaying(true);
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    setPlaying(false);
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const ageLine = AGE_UNIT[locale](data.age);
  const iso = data.nationality.toLowerCase();

  return (
    <div className="discover-deck">
      {/* One card peeking behind — a swipeable-stack hint (no photo yet).
          Real sibling element painted under the opaque main card. */}
      <span className="deck-card deck-left" aria-hidden />
      <div className="discover-card">
      {/* Cover photo (watercolor portrait) */}
      <div className="discover-cover">
        <Image
          src={data.photo}
          alt={alt}
          width={720}
          height={720}
          priority
          sizes="(max-width: 768px) 78vw, 300px"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Name + age · flag */}
      <div className="discover-meta">
        <p className="discover-name font-pixel">{data.name}</p>
        <p className="discover-detail font-pixel">
          <span>{ageLine}</span>
          <span className="discover-sep">•</span>
          {/* Real flag image (self-hosted) — Windows browsers lack the emoji
              flag font, so regional-indicator emoji render as letters. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="discover-flag" src={`/flags/${iso}.png`} alt="" width={16} height={11} />
          <span>{data.nationality}</span>
        </p>
      </div>

      {/* Waveform */}
      <div className="discover-waveform">
        {BASE_WAVEFORM.map((h, i) => {
          const played = (i + 0.5) / WAVE_BAR_COUNT <= progress;
          return (
            <span
              key={i}
              className={`wave-bar${playing ? ' is-playing' : ''}`}
              style={{
                height: h,
                background: played ? '#E27AA0' : 'rgba(255,255,255,0.28)',
                animationDelay: playing ? `${(i * 80) % 720}ms` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Controls: Skip · Play · Like */}
      <div className="discover-controls">
        <button type="button" className="discover-side" onClick={toggle} aria-label="Skip">
          <span className="discover-side-label" style={{ color: '#fff' }}>Skip</span>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff" aria-hidden>
            <path d="M11 12 19 6v12zM3 12l8-6v12z" />
          </svg>
        </button>

        <button
          type="button"
          className="discover-play"
          onClick={toggle}
          aria-label={playing ? 'pause voice intro' : 'play voice intro'}
        >
          <svg width="0" height="0" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F6B5C8" />
                <stop offset="100%" stopColor="#E27AA0" />
              </linearGradient>
            </defs>
          </svg>
          <svg viewBox="0 0 58 58" width="58" height="58">
            <circle cx="29" cy="29" r="29" fill={`url(#${gradId})`} />
            {playing ? (
              <g fill="#fff">
                <rect x="21" y="19" width="5.5" height="20" rx="1.5" />
                <rect x="31.5" y="19" width="5.5" height="20" rx="1.5" />
              </g>
            ) : (
              <path d="M24 18v22l18-11z" fill="#fff" />
            )}
          </svg>
        </button>

        <button type="button" className="discover-side" onClick={toggle} aria-label="Like">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#FF5D87" aria-hidden>
            <path d="M13 12 5 6v12zM21 12l-8-6v12z" />
          </svg>
          <span className="discover-side-label" style={{ color: '#FF5D87' }}>Like</span>
        </button>
      </div>

      <audio
        ref={audioRef}
        src={data.audio}
        preload="none"
        onPlay={onPlay}
        onPause={stop}
        onEnded={stop}
      />
      </div>
    </div>
  );
}
