import { useEffect, useState } from 'react';
import { Platform, ViewStyle } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

interface AppleLoginButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

// Sign in with Apple 버튼. Apple HIG 준수를 위해 시스템 네이티브 버튼
// (AppleAuthenticationButton) 을 그대로 사용한다 — 커스텀 스타일 버튼은 심사
// 리젝 사유. iOS 외 플랫폼이거나 기기가 Apple 인증을 지원하지 않으면 렌더하지
// 않는다(Google 버튼만 노출). 높이/코너는 GoogleLoginButton(40 / radius 20)과
// 동일하게 맞춰 두 버튼이 시각적으로 정렬되도록 한다.
export function AppleLoginButton({ onPress, style }: AppleLoginButtonProps) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync()
      .then((ok) => {
        if (mounted) setAvailable(ok);
      })
      .catch(() => {
        if (mounted) setAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (Platform.OS !== 'ios' || !available) return null;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={20}
      style={[{ height: 40, width: '100%' }, style]}
      onPress={onPress}
    />
  );
}
