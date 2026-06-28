'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * A play/pause button bound to its own <audio>, used inside the chat-bubble
 * cards (translate / emotion). `mine` paints the icon white (on a pink bubble),
 * otherwise brand pink (on a white bubble).
 */
export default function ChatPlayButton({ src, mine = false }: { src: string; mine?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <button
      type="button"
      className={`tb-play${mine ? ' tb-play--mine' : ''}${playing ? ' is-playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'pause' : 'play'}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill={mine ? 'rgba(255,255,255,0.95)' : '#e27aa0'} aria-hidden>
        {playing ? (
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10 8h1.6v8H10zm2.4 0H14v8h-1.6z" />
        ) : (
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10 8l6 4-6 4z" />
        )}
      </svg>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </button>
  );
}
