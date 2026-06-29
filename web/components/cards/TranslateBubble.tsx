import ChatPlayButton from './ChatPlayButton';
import type { TranslateThreadData } from '@/lib/cardData';

/**
 * Auto-translate feature visual — a short chat thread recreating the app's
 * chat bubbles (haru_FE/src/components/chat/ChatBubble.tsx): my sent bubbles
 * (right, pink) plus the partner's received bubble (left, white) with their
 * original text, the auto-translation under it, and a play button. The voice
 * clips are playable. No phone frame.
 */
export default function TranslateBubble({
  data,
  avatarAlt,
}: {
  data: TranslateThreadData;
  avatarAlt: string;
}) {
  const mineBlock = data.mine.map((msg, i) => (
    <div
      key={i}
      className={`tb-mine-row${data.partnerFirst && i === 0 ? ' tb-mine-row--sep' : ''}`}
    >
      <div className="tb-bubble tb-bubble--mine">
        <p className="tb-original tb-original--mine font-pixel">{msg.text}</p>
        <div className="tb-footer">
          <ChatPlayButton src={msg.audio} mine />
          <span className="tb-time tb-time--mine font-pixel">{data.mineTime}</span>
          {/* read receipt — double check, like the app's checkmark-done */}
          <svg className="tb-read" viewBox="0 0 24 24" width="16" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M1.5 13l3.5 3.5L11 9.5" />
            <path d="M8 13l3.5 3.5L22 5.5" />
          </svg>
        </div>
      </div>
    </div>
  ));

  const partnerBlock = (
    <div className={`tb-row${data.partnerFirst ? ' tb-row--lead' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tb-avatar" src={data.avatar} alt={avatarAlt} width={46} height={46} loading="lazy" />
      <div className="tb-partner-stack">
        {data.partner.map((msg, i) => (
          <div key={i} className="tb-bubble">
            <p className="tb-original font-pixel">{msg.original}</p>
            <p className="tb-translated font-pixel">{msg.translated}</p>
            <div className="tb-footer">
              <ChatPlayButton src={msg.audio} />
              <span className="tb-time font-pixel">{data.partnerTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Order depends on who opens the thread (differs per locale): partnerFirst
  // puts the partner's received bubble on top, otherwise my sent bubbles lead.
  return (
    <div className="tb-thread">
      {data.partnerFirst ? (
        <>
          {partnerBlock}
          {mineBlock}
        </>
      ) : (
        <>
          {mineBlock}
          {partnerBlock}
        </>
      )}
    </div>
  );
}
