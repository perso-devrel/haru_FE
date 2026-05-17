import { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MatchItem } from '@/components/matches/MatchItem';
import { MatchActionsSheet } from '@/components/matches/MatchActionsSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoBackground } from '@/components/ui/PhotoBackground';
import { useMatches } from '@/hooks/useMatches';
import { showAlert } from '@/stores/alertStore';
import { setMatchesTabActive } from '@/lib/activeChat';
import { colors } from '@/constants/colors';
import type { MatchListItem } from '@/types';

export default function MatchesScreen() {
  const { t } = useTranslation();
  const { matches, loading, hasMore, loadMatches, loadMore, toggleMute } = useMatches();
  const [actionTarget, setActionTarget] = useState<MatchListItem | null>(null);

  // mig 022: 액션시트의 "알림 끄기/켜기" 발화 시 옵티미스틱 토글 + BE 호출
  // (useMatches.toggleMute 내부에서 처리). 실패 시 공통 에러 알럿 + 자동 롤백.
  const handleToggleMute = useCallback(
    async (matchId: string, nextMuted: boolean) => {
      try {
        await toggleMute(matchId, nextMuted);
      } catch (e: any) {
        showAlert({ variant: 'error', title: t('common.error'), message: e?.message ?? '' });
      }
    },
    [toggleMute, t],
  );

  // Refetch every time the tab regains focus so unread_count reflects the
  // BE truth after listened POSTs from the chat screen. The list-level
  // Realtime channel only listens to INSERTs, so unread decrements
  // (listened_at flips on messages) never reach the list otherwise.
  //
  // 같은 useFocusEffect 의 cleanup 으로 matchesTabActive 플래그를 토글한다.
  // 화면 focus → true (foreground 알림 트레이 표시 OFF), blur → false. 채팅창
  // 으로 이동 시 cleanup 이 발화되어 trayed 알림이 다시 정상 표시되므로 사용자가
  // 매치 탭을 떠난 직후의 푸시는 누락되지 않는다.
  useFocusEffect(
    useCallback(() => {
      loadMatches();
      setMatchesTabActive(true);
      return () => setMatchesTabActive(false);
    }, [loadMatches]),
  );

  const renderItem = useCallback(({ item }: { item: MatchListItem }) => {
    // Don't seed partnerPhoto/partnerName from a tombstone partner — let the
    // chat screen render its own "탈퇴한 사용자" fallback once it sees
    // partner.deleted_at on its own /api/matches fetch.
    const isDeleted = !!item.partner?.deleted_at;
    return (
      <MatchItem
        item={item}
        onPress={() =>
          router.push({
            pathname: '/(main)/chat/[matchId]',
            params: {
              matchId: item.match_id,
              partnerPhoto: isDeleted ? '' : (item.partner?.photos[0] ?? ''),
              partnerName: isDeleted ? '' : (item.partner?.display_name ?? ''),
            },
          })
        }
        onLongPress={() => setActionTarget(item)}
      />
    );
  }, []);

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        iconName="sparkles-outline"
        title={t('matches.noMatches')}
        ctaLabel={t('matches.goToDiscover')}
        onCtaPress={() => router.push('/(main)/(tabs)/discover')}
      />
    );
  };

  return (
    <PhotoBackground variant="app">
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={(item) => item.match_id}
        contentContainerStyle={
          matches.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={renderEmpty}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMatches}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />

      <MatchActionsSheet
        visible={actionTarget !== null}
        matchId={actionTarget?.match_id ?? null}
        partnerId={actionTarget?.partner?.id ?? null}
        partnerName={
          actionTarget?.partner?.deleted_at
            ? t('common.deletedUser')
            : (actionTarget?.partner?.display_name || t('matches.unknown'))
        }
        partnerDeleted={!!actionTarget?.partner?.deleted_at}
        isUnmatched={!!actionTarget?.unmatched_at}
        isMuted={!!actionTarget?.muted}
        onToggleMute={(next) => {
          if (actionTarget) handleToggleMute(actionTarget.match_id, next);
        }}
        onClose={() => setActionTarget(null)}
        onResolved={loadMatches}
      />
    </PhotoBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 14,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
  },
});
