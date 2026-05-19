export interface ChatPromptStep {
  id: 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
  titleKey: string;
  bodyKey: string;
}

export const CHAT_PROMPT_STEPS: readonly ChatPromptStep[] = [
  { id: 'step1', titleKey: 'chat.prompts.step1.title', bodyKey: 'chat.prompts.step1.body' },
  { id: 'step2', titleKey: 'chat.prompts.step2.title', bodyKey: 'chat.prompts.step2.body' },
  { id: 'step3', titleKey: 'chat.prompts.step3.title', bodyKey: 'chat.prompts.step3.body' },
  { id: 'step4', titleKey: 'chat.prompts.step4.title', bodyKey: 'chat.prompts.step4.body' },
  { id: 'step5', titleKey: 'chat.prompts.step5.title', bodyKey: 'chat.prompts.step5.body' },
] as const;

// Tracks per-match "have I auto-shown the prompts modal once" state.
// Set to '1' the first time the chat screen mounts for a given matchId so
// subsequent re-entries don't re-pop the modal. expo-secure-store keys may
// only contain alphanumeric chars plus `.`, `-`, `_` — keep this prefix in
// that subset (no `:` separators).
export const CHAT_PROMPTS_SEEN_KEY_PREFIX = 'chatPromptsSeen_';

