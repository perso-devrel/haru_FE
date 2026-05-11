import { api } from './api';
import type {
  Emotion,
  Message,
  ReadResponse,
  SendMessageResponse,
} from '@/types';

export async function getMessages(
  matchId: string,
  limit = 50,
  before?: string,
): Promise<Message[]> {
  let path = `/api/matches/${matchId}/messages?limit=${limit}`;
  if (before) path += `&before=${encodeURIComponent(before)}`;
  return api.get<Message[]>(path);
}

export async function sendMessage(
  matchId: string,
  text: string,
  emotion?: Emotion,
): Promise<SendMessageResponse> {
  // BE accepts neutral and stores it as null; omit the field when neutral so
  // the request body stays minimal.
  // chat-audio-async-insert sprint: 응답은 두 가지 경로.
  //   * voice clone 보유 발신자 → 202 stub Message (audio_status='pending',
  //     id 는 확정된 UUID — realtime INSERT 가 같은 id 로 도착 → useChat
  //     이 같은 id 로 replace).
  //   * voice clone 없는 발신자 → 201 동기 INSERT Message.
  // 응답 타입은 동일 Message 모양이므로 호출처는 분기 불필요.
  const body: { text: string; emotion?: Emotion } =
    emotion && emotion !== 'neutral' ? { text, emotion } : { text };
  return api.post<SendMessageResponse>(`/api/matches/${matchId}/messages`, body);
}

export async function markAsRead(matchId: string): Promise<ReadResponse> {
  return api.patch<ReadResponse>(`/api/matches/${matchId}/messages/read`);
}

// chat-audio-async-insert sprint: retryAudio 함수 제거.
// 실패한 메시지는 audio_url=null, audio_status='failed' 로 영구 저장되며
// 사용자는 동일 텍스트로 새 메시지를 보내 재시도한다.
