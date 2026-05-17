// 현재 사용자가 열어둔 화면 정보. _layout.tsx 의 setNotificationHandler 가
// foreground 알림 표시를 분기하기 위해 참조한다.
//
// 모듈-level singleton 으로 둔다 — zustand store 또는 React Context 도 가능하나,
// (a) setNotificationHandler 콜백이 React 컴포넌트 트리 밖에서 호출되어 hook
// 으로 읽을 수 없고, (b) 동기 읽기/쓰기만 필요한 단순 값이라 store 오버헤드가
// 불필요하기 때문.
//
// 동작:
//   * 채팅 화면 ([matchId].tsx) 마운트 시 setActiveChatMatchId(matchId), 언마운트
//     시 null. 푸시 도착 시 data.match_id 와 일치하면 OS 트레이/배너/사운드 모두 OFF.
//   * 매치 탭 (matches.tsx) focus 시 setMatchesTabActive(true), blur 시 false.
//     true 인 동안에는 message 푸시의 트레이 표시만 OFF — 새 매시지는 list
//     realtime 으로 즉시 반영되므로 OS 알림이 중복 신호. type='match' 새 매치
//     알림은 사용자가 기대하는 ping 이라 그대로 통과 (매치 탭이 떠 있어도 정상
//     트레이/배너/사운드).
//
// 백그라운드/종료 상태 푸시는 setNotificationHandler 가 호출되지 않고 OS 가
// 직접 처리하므로 영향 없음 (앱이 백그라운드면 어떤 탭이든 비활성으로 간주됨).

let activeChatMatchId: string | null = null;
let matchesTabActive = false;

export function setActiveChatMatchId(matchId: string | null): void {
  activeChatMatchId = matchId;
}

export function getActiveChatMatchId(): string | null {
  return activeChatMatchId;
}

export function setMatchesTabActive(active: boolean): void {
  matchesTabActive = active;
}

export function isMatchesTabActive(): boolean {
  return matchesTabActive;
}
