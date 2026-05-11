import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider, useResizeMode } from 'react-native-keyboard-controller';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { setAudioModeAsync } from 'expo-audio';
import { useAuthStore } from '@/stores/authStore';
import { registerOnSessionExpired } from '@/services/api';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AlertHost } from '@/components/ui/AlertHost';
import { SWRConfigProvider } from '@/lib/swr';
import { PRETENDARD_ASSETS, fonts } from '@/constants/fonts';
import '@/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

registerOnSessionExpired(() => useAuthStore.getState().logout());

function applyDefaultFont() {
  const textAny = Text as unknown as { defaultProps?: { style?: unknown } };
  textAny.defaultProps = textAny.defaultProps ?? {};
  textAny.defaultProps.style = [{ fontFamily: fonts.pixel }, textAny.defaultProps.style];

  const inputAny = TextInput as unknown as { defaultProps?: { style?: unknown } };
  inputAny.defaultProps = inputAny.defaultProps ?? {};
  inputAny.defaultProps.style = [{ fontFamily: fonts.pixel }, inputAny.defaultProps.style];
}

function RootShell() {
  // Force adjustResize at the activity level once for the whole tree. Every
  // input screen below uses useKeyboardState to manually offset for the
  // visible keyboard height, so we need a consistent window mode underneath.
  useResizeMode();
  return (
    <SafeAreaProvider>
      <SWRConfigProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="index" />
        </Stack>
        <AlertHost />
      </SWRConfigProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const { isLoading, tryAutoLogin } = useAuthStore();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(PRETENDARD_ASSETS);
        applyDefaultFont();
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    })();
  }, []);

  useEffect(() => {
    tryAutoLogin();
  }, []);

  // chat-audio-mid-session-playback fix: 부팅 시 audio session 을 playback-only
  // (`allowsRecording: false`) + 무음 모드 재생 허용으로 명시 고정. 진단 로그
  // 분석 결과 — useAudioPlayer 가 mid-session 으로 새 메시지 셀에 mount 될 때
  // duration 은 파싱되는데 isLoaded 가 false 에 머무는 케이스가 관측됐다. iOS
  // 에서 이 패턴은 AVPlayerItem.status 가 .readyToPlay 로 진입 못한 상태이고,
  // 가장 흔한 트리거는 audio session 이 `playAndRecord` category 에 있는 것.
  // useVoiceCloneRecorder.start() 가 `allowsRecording: true` 로 한 번 바꾼 뒤
  // 복원하지 않는 경로가 있어, 채팅방에 진입한 시점에는 이미 record-capable
  // 세션일 수 있다. 이 상태에서 새로 attach 되는 AVPlayer 의 buffer fill 이
  // 멈춰 사용자가 보고한 "재생 버튼 깜빡 후 무음" 패턴이 발생한다.
  //
  // 부팅 시 단 한 번 명시적으로 playback-only 로 고정하면 (i) 녹음 직후 audio
  // session 잔여 상태 영향이 사라지고 (ii) Android playsInSilentMode 가 활성
  // 화돼 무음 모드에서도 메시지 재생이 보장된다. recorder 가 필요할 때만
  // `allowsRecording: true` 로 일시 전환하고 (이미 useVoiceCloneRecorder.start
  // 에서 수행) stop() 직후 다시 false 로 원복하는 책임은 recorder 훅에 둔다.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {
      // 무시 — 단발성 audio session 설정 실패해도 앱 동작은 계속.
    });
  }, []);

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <RootShell />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
