import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { colors, radii, shadows } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { getEmotionMeta } from '@/constants/emotions';
import {
  playSharedAudio,
  pauseSharedAudio,
  useSharedAudioState,
} from './sharedAudioPlayer';
import type { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  isMine: boolean;
  partnerId?: string | null;
  partnerPhoto?: string | null;
  showAvatar?: boolean;
  onAvatarPress?: () => void;
}

const AVATAR_SIZE = 36;

export function ChatBubble({
  message,
  isMine,
  partnerId,
  partnerPhoto,
  showAvatar = true,
  onAvatarPress,
}: ChatBubbleProps) {
  const { t } = useTranslation();
  const sharedState = useSharedAudioState();
  // chat-audio-singleton sprint: 본 메시지가 shared singleton player 의 현재
  // source 인지 확인. 채팅 화면 전체에서 native player 인스턴스가 1 개라 두
  // 메시지가 동시에 'playing' 상태일 수는 없다.
  const isActive = !!message.audio_url && sharedState.currentUrl === message.audio_url;
  const isPlayingThis = isActive && sharedState.isPlaying;
  const handlePlayPress = () => {
    if (!message.audio_url) return;
    if (isPlayingThis) {
      pauseSharedAudio();
    } else {
      playSharedAudio(message.audio_url);
    }
  };
  const showTranslation =
    !isMine &&
    !!message.translated_text &&
    message.translated_text !== message.original_text;

  // chat-audio-async-insert sprint: audio_status 가 가질 수 있는 값은 세 가지.
  //   * 'pending' — 본인 발신 stub. BE 응답 직후, TTS 완료 전. realtime INSERT
  //     도착 시 같은 id 로 useChat 이 replace → 'ready' 가 됨. 상대방에게는
  //     보이지 않음 (DB INSERT 가 아직 안 일어났음).
  //   * 'ready' — 정상 INSERT 완료. audio_url 있으면 재생, 없으면 텍스트 전용
  //     (no-speakable-content 경로).
  //   * 'failed' — TTS 파이프라인 실패 → 텍스트 전용으로 영구 저장. 사용자는
  //     같은 텍스트로 새 메시지를 보내 재시도. 별도 retry UI 없음 (mid-session
  //     UPDATE 패턴을 폐기했기 때문).
  const inner = (
    <>
      <Text style={[styles.text, isMine && styles.mineText]}>
        {message.original_text}
      </Text>

      {showTranslation && (
        <Text style={styles.translation}>{message.translated_text}</Text>
      )}

      <View style={styles.footer}>
        {message.audio_status === 'ready' && message.audio_url && (
          <Pressable
            onPress={handlePlayPress}
            style={styles.audioBtn}
            accessibilityRole="button"
            accessibilityLabel={
              isPlayingThis ? t('audioPlayer.stop') : t('audioPlayer.play')
            }
            hitSlop={6}
          >
            <Ionicons
              name={isPlayingThis ? 'pause-circle' : 'play-circle'}
              size={24}
              color={isMine ? 'rgba(255,255,255,0.95)' : colors.primary}
            />
          </Pressable>
        )}
        {/* pending stub — 본인 발신 stub 에만 노출 (TTS 완료 전). 상대는 stub
            을 받지 않으므로 분기 도달 불가지만 isMine 가드로 명시. */}
        {message.audio_status === 'pending' && isMine && (
          <View style={styles.audioBtn}>
            <Ionicons
              name="hourglass-outline"
              size={14}
              color="rgba(255,255,255,0.75)"
            />
          </View>
        )}
        {/* failed 메시지는 텍스트 전용 — 별도 인디케이터 없이 timestamp 만. */}

        <Text style={[styles.time, isMine && styles.mineTime]}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>

        {isMine && message.read_at && (
          <Ionicons name="checkmark-done" size={14} color={colors.white} style={{ marginLeft: 4 }} />
        )}
      </View>
    </>
  );

  return (
    <View style={[styles.container, isMine ? styles.mine : styles.theirs]}>
      {!isMine && (
        <View style={styles.avatarSlot}>
          {showAvatar ? (
            <Pressable
              onPress={onAvatarPress}
              hitSlop={6}
              accessibilityRole="button"
              style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
              <ProfilePhoto
                userId={partnerId}
                uri={partnerPhoto ?? undefined}
                size={AVATAR_SIZE}
                variant="avatar"
              />
            </Pressable>
          ) : null}
        </View>
      )}
      <View style={styles.bubbleStack}>
        <View
          style={[
            styles.bubble,
            isMine ? styles.mineBubble : styles.theirsBubble,
            shadows.soft,
          ]}
        >
          {inner}
        </View>
        {message.emotion && message.emotion !== 'neutral' && (
          <View
            style={[
              styles.emotionBadge,
              isMine ? styles.emotionBadgeMine : styles.emotionBadgeTheirs,
            ]}
          >
            <Text style={styles.emotionBadgeText}>
              {getEmotionMeta(message.emotion).emoji}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    marginVertical: 4,
    flexDirection: 'row',
  },
  mine: {
    justifyContent: 'flex-end',
  },
  theirs: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatarSlot: {
    width: AVATAR_SIZE,
    marginRight: 8,
  },
  bubbleStack: {
    maxWidth: '78%',
    position: 'relative',
  },
  bubble: {
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: radii.lg,
  },
  mineBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  theirsBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: radii.lg,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  text: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  mineText: {
    color: colors.white,
  },
  translation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  audioBtn: {
    marginRight: 6,
  },
  time: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  mineTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  emotionBadge: {
    position: 'absolute',
    top: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadows.soft,
  },
  emotionBadgeMine: {
    left: -6,
  },
  emotionBadgeTheirs: {
    right: -6,
  },
  emotionBadgeText: {
    fontSize: 12,
    lineHeight: 14,
  },
});
