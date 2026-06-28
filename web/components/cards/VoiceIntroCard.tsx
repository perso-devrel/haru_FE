'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceIntroData } from '@/lib/cardData';

/**
 * Voice-intro feature visual — a faithful recreation of the app's "보이스 한마디"
 * multi-language preview: a title + edit pencil, the intro phrase in a white
 * box, a two-slot language toggle, and a play row (button + progress bar +
 * time). Picking a slot plays that language's synthesized voice; the progress
 * bar and time track playback. No phone frame.
 */
function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VoiceIntroCard({ data, editLabel }: { data: VoiceIntroData; editLabel: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [selected, setSelected] = useState(data.selected);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  // Typewriter effect on the intro phrase — types out char by char, holds, then
  // restarts. Disabled (shows full text) when the user prefers reduced motion.
  const [typed, setTyped] = useState(data.text.length);
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTyped(data.text.length);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    setTyped(0);
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < data.text.length) {
        timer = setTimeout(tick, 80);
      } else {
        timer = setTimeout(() => {
          i = 0;
          setTyped(0);
          timer = setTimeout(tick, 80);
        }, 2400);
      }
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [data.text]);

  // Switching slots swaps the source — stop and reset so the new clip starts clean.
  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
    setCur(0);
    setDur(0);
  }, [selected]);

  // Drive the progress bar at 60fps while playing (timeupdate only fires ~4x/s,
  // which makes the fill jump in chunks).
  useEffect(() => {
    if (!playing) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    const loop = () => {
      const a = audioRef.current;
      if (a) setCur(a.currentTime || 0);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [playing]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    if (a.duration > 0 && a.currentTime >= a.duration) a.currentTime = 0;
    void a.play().catch(() => {});
  }, [playing]);

  const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;

  return (
    <div className="vi-card">
      <div className="vi-head">
        <span className="vi-title font-pixel">{data.title}</span>
        <span className="vi-edit" role="img" aria-label={editLabel}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#cf93ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </span>
      </div>

      <div className="vi-text font-pixel" aria-label={data.text}>
        <span>{data.text.slice(0, typed)}</span>
        <span className="vi-caret" aria-hidden />
      </div>

      <div className="vi-toggle">
        {data.slots.map((slot, i) => (
          <button
            key={i}
            type="button"
            className={`vi-slot${i === selected ? ' is-active' : ''}`}
            onClick={() => setSelected(i)}
          >
            <span className="font-pixel">{slot.label}</span>
            <span className="vi-dot" aria-hidden />
          </button>
        ))}
      </div>

      <div className="vi-play-row">
        <button type="button" className={`vi-play${playing ? ' is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'pause' : 'play'}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#e27aa0" aria-hidden>
            {playing ? (
              <g>
                <rect x="7" y="5" width="4" height="14" rx="1" />
                <rect x="13" y="5" width="4" height="14" rx="1" />
              </g>
            ) : (
              <path d="M8 5l11 7-11 7z" />
            )}
          </svg>
        </button>

        <div className="vi-progress">
          <div className="vi-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <span className="vi-time font-pixel">
          {fmt(cur)} / {fmt(dur)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={data.slots[selected]?.audio}
        preload="metadata"
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
