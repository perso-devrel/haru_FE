import { api } from './api';
import type { DiscoverCandidate, SwipeRequest, SwipeResponse, DiscoverQuota } from '@/types';

export async function getDiscoverCandidates(limit = 10): Promise<DiscoverCandidate[]> {
  return api.get<DiscoverCandidate[]>(`/api/discover?limit=${limit}`);
}

// 받은 좋아요 — 나를 like 한 사용자 중 내가 아직 응답 안 했고 차단 양방향 아닌 후보.
// 응답 shape 은 디스커버 카드와 동일 → SwipeCard 컴포넌트 재사용.
// 정렬은 like 한 시각 내림차순 (BE).
export async function getReceivedLikes(): Promise<DiscoverCandidate[]> {
  return api.get<DiscoverCandidate[]>('/api/discover/likes-received');
}

export async function swipe(data: SwipeRequest): Promise<SwipeResponse> {
  return api.post<SwipeResponse>('/api/discover/swipe', data);
}

// BE 가 sources of truth 로 들고 있는 "오늘 스와이프 수" 를 가져온다 (기기 간 동기화).
// tz_offset_minutes 는 Date#getTimezoneOffset() 그대로 — 사용자 로컬 자정 경계를 BE 가 계산한다.
export async function getDiscoverQuota(): Promise<DiscoverQuota> {
  const tz = new Date().getTimezoneOffset();
  return api.get<DiscoverQuota>(`/api/discover/quota?tz_offset_minutes=${tz}`);
}
