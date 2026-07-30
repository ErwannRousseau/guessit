import { mock } from "bun:test";
import * as ReactNativeWeb from "react-native-web";

export const impactAsync = mock(async () => {});
export const notificationAsync = mock(async () => {});
export const selectionAsync = mock(async () => {});

mock.module("react-native", () => ({
  ...ReactNativeWeb,
  KeyboardAvoidingView: ({
    behavior,
    children,
  }: {
    behavior?: string;
    children: React.ReactNode;
  }) => <div data-keyboard-behavior={behavior ?? "none"}>{children}</div>,
  Platform: { OS: "ios" },
}));
mock.module("react-native-safe-area-context", () => ({
  SafeAreaView: ReactNativeWeb.View,
}));
mock.module("../../assets/images/icon.png", () => ({ default: "/guessit-icon.png" }));
mock.module("../../assets/images/logo-mark.png", () => ({ default: "/guessit-mark.png" }));
mock.module("../../assets/images/splash-lockup.png", () => ({
  default: "/guessit-lockup.png",
}));
mock.module("../../store-assets/apple/iphone/1320x2868/fr-FR/01-hero.png", () => ({
  default: "/guessit-setup.png",
}));
mock.module("../../store-assets/apple/iphone/1320x2868/fr-FR/02-device-bottom.png", () => ({
  default: "/guessit-role.png",
}));
mock.module("../../store-assets/apple/iphone/1320x2868/fr-FR/04-device-top.png", () => ({
  default: "/guessit-timer.png",
}));
mock.module("../../store-assets/apple/iphone/1320x2868/fr-FR/06-device-bottom.png", () => ({
  default: "/guessit-score.png",
}));
mock.module("../../assets/sounds/timer-finished.wav", () => ({ default: 1 }));
mock.module("expo-router", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
mock.module("expo-router/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
mock.module("expo-audio", () => ({
  setAudioModeAsync: async () => {},
  useAudioPlayer: () => ({ play: () => {}, seekTo: async () => {} }),
}));
mock.module("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light", Medium: "medium" },
  NotificationFeedbackType: { Success: "success", Warning: "warning" },
  impactAsync,
  notificationAsync,
  selectionAsync,
}));
mock.module("expo-store-review", () => ({
  isAvailableAsync: async () => false,
  requestReview: async () => {},
}));
