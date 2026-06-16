import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { colors, gradients, radii, shadows } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import type { Profile } from '@/types';

// 디스커버 참여 전제조건 게이트 — 디스커버 탭과 받은 좋아요 탭이 공유한다.
//
// 디스커버는 양방향이다: 상대 목소리를 들으려면 본인도 (1) 보이스 클론 ready
// (2) 보이스 한마디 작성 (3) 사진 1장 이상 을 갖춰야 남의 피드에도 보이고
// SwipeCard 의 재생 버튼도 의미가 있다. 셋 중 하나라도 없으면 카드를 노출하지
// 않고 "다음 한 가지 할 일" 만 안내한다.

export interface DiscoverGateState {
  voiceReady: boolean;
  voiceProcessing: boolean;
  bioReady: boolean;
  hasPhoto: boolean;
  gated: boolean;
}

export function computeDiscoverGate(profile: Profile | null): DiscoverGateState {
  const voiceReady = profile?.voice_clone_status === 'ready';
  const voiceProcessing = profile?.voice_clone_status === 'processing';
  const bioReady = Boolean(profile?.voice_intro && profile.voice_intro.trim().length > 0);
  const hasPhoto = (profile?.photos.length ?? 0) > 0;
  const gated = !voiceReady || !bioReady || !hasPhoto;
  return { voiceReady, voiceProcessing, bioReady, hasPhoto, gated };
}

type GateRoute =
  | '/(main)/settings/voice'
  | '/(main)/settings/edit-bio'
  | '/(main)/(tabs)/profile';

export interface DiscoverGateStep {
  icon: 'hourglass-outline' | 'mic-outline' | 'create-outline' | 'image-outline';
  title: string;
  hint: string;
  ctaLabel: string;
  // 클론 생성 중(processing)이면 사용자가 할 일이 없어(대기) route=null.
  route: GateRoute | null;
}

// 미충족 전제조건 중 "지금 할 단계 하나" 를 가입 순서(목소리 → 한마디 → 사진)대로
// 고른다. 게이트 화면(전체 화면)과 디스커버 like-wall(좋아요 시점 인터셉트)이
// 같은 단계 매핑을 공유하도록 순수 함수로 분리. gated 아니면 null.
export function getDiscoverGateStep(
  state: DiscoverGateState,
  t: (key: string) => string,
): DiscoverGateStep | null {
  if (!state.gated) return null;
  if (state.voiceProcessing) {
    return {
      icon: 'hourglass-outline',
      title: t('discover.voiceProcessingTitle'),
      hint: t('discover.voiceProcessingHint'),
      ctaLabel: '',
      route: null,
    };
  }
  if (!state.voiceReady) {
    return {
      icon: 'mic-outline',
      title: t('discover.lockedVoiceTitle'),
      hint: t('discover.lockedVoiceHint'),
      ctaLabel: t('discover.lockedGoVoice'),
      route: '/(main)/settings/voice',
    };
  }
  if (!state.bioReady) {
    return {
      icon: 'create-outline',
      title: t('discover.lockedBioTitle'),
      hint: t('discover.lockedBioHint'),
      ctaLabel: t('discover.lockedGoBio'),
      route: '/(main)/settings/edit-bio',
    };
  }
  // 여기 도달하면 hasPhoto 만 false — 남은 게이트는 사진뿐.
  return {
    icon: 'image-outline',
    title: t('discover.lockedPhotoTitle'),
    hint: t('discover.lockedPhotoHint'),
    ctaLabel: t('discover.lockedGoPhoto'),
    route: '/(main)/(tabs)/profile',
  };
}

export function DiscoverGateScreen({
  state,
  t,
}: {
  state: DiscoverGateState;
  t: (key: string) => string;
}) {
  const step = getDiscoverGateStep(state, t);
  if (!step) return null;
  const route = step.route;

  return (
    <View style={styles.empty}>
      <LinearGradient
        colors={[...gradients.glow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.emptyHalo, shadows.glow]}
      >
        <Ionicons name={step.icon} size={38} color={colors.white} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>{step.title}</Text>
      <Text style={styles.emptyText}>{step.hint}</Text>
      {route && (
        <Button
          title={step.ctaLabel}
          onPress={() => router.push(route)}
          style={styles.ctaBtn}
          textStyle={styles.ctaBtnText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: 0.3,
    textAlign: 'center',
    textShadowColor: 'rgba(255,244,238,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 21,
    textShadowColor: 'rgba(255,244,238,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  ctaBtn: {
    marginTop: 28,
    borderRadius: radii.pill,
  },
  ctaBtnText: {
    paddingHorizontal: 4,
  },
});
