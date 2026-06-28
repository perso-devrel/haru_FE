import ChatPlayButton from './ChatPlayButton';
import type { EmotionThreadData } from '@/lib/cardData';

/**
 * Emotion voice-message feature visual — a 2-message thread: the partner's
 * received bubble (top) with original + auto-translation, then my sent bubble
 * (bottom). Each bubble carries an emotion emoji badge (like the app's
 * ChatBubble emotionBadge) and a playable voice clip that conveys the emotion
 * (e.g. "ㅋㅋㅋ" → real laughter).
 */
export default function EmotionThread({
  data,
  avatarAlt,
}: {
  data: EmotionThreadData;
  avatarAlt: string;
}) {
  // The emotion badge sits on the top message only (the one that opens the
  // thread), so it goes on whichever block leads.
  const partnerBlock = (
    <div className="tb-row em-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tb-avatar" src={data.avatar} alt={avatarAlt} />
      <div className="tb-bubble em-bubble">
        {!data.mineFirst && (
          <span className="em-badge em-badge--theirs" aria-hidden>{data.partner.emoji}</span>
        )}
        <p className="tb-original font-pixel">{data.partner.original}</p>
        <p className="tb-translated font-pixel">{data.partner.translated}</p>
        <div className="tb-footer">
          <ChatPlayButton src={data.partner.audio} />
          <span className="tb-time font-pixel">{data.partner.time}</span>
        </div>
      </div>
    </div>
  );

  const mineBlock = (
    <div className="tb-mine-row">
      <div className="tb-bubble tb-bubble--mine em-bubble">
        {data.mineFirst && (
          <span className="em-badge em-badge--mine" aria-hidden>{data.mine.emoji}</span>
        )}
        <p className="tb-original tb-original--mine font-pixel">{data.mine.text}</p>
        <div className="tb-footer">
          <ChatPlayButton src={data.mine.audio} mine />
          <span className="tb-time tb-time--mine font-pixel">{data.mine.time}</span>
          <svg className="tb-read" viewBox="0 0 24 24" width="16" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M1.5 13l3.5 3.5L11 9.5" />
            <path d="M8 13l3.5 3.5L22 5.5" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tb-thread em-thread">
      {data.mineFirst ? (
        <>
          {mineBlock}
          {partnerBlock}
        </>
      ) : (
        <>
          {partnerBlock}
          {mineBlock}
        </>
      )}
    </div>
  );
}
