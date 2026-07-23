import { beforeAll, describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import * as ReactNativeWeb from "react-native-web";

mock.module("react-native", () => ReactNativeWeb);
mock.module("react-native-safe-area-context", () => ({
  SafeAreaView: ReactNativeWeb.View,
}));
mock.module("../../../assets/images/icon.png", () => ({ default: "/guessit-icon.png" }));
mock.module("../../../assets/images/logo-mark.png", () => ({ default: "/guessit-mark.png" }));
mock.module("../../../assets/sounds/timer-finished.wav", () => ({ default: 1 }));
mock.module("expo-audio", () => ({
  setAudioModeAsync: async () => {},
  useAudioPlayer: () => ({ play: () => {}, seekTo: async () => {} }),
}));
mock.module("expo-haptics", () => ({
  NotificationFeedbackType: { Warning: "warning" },
  notificationAsync: async () => {},
}));
mock.module("expo-store-review", () => ({
  isAvailableAsync: async () => false,
  requestReview: async () => {},
}));

let GameScreen: typeof import("@/screens/game-screen").GameScreen;

beforeAll(async () => {
  ({ GameScreen } = await import("@/screens/game-screen"));
});

describe("GameScreen", () => {
  test("renders an accessible four-player setup", () => {
    const markup = renderToStaticMarkup(<GameScreen />);

    expect(markup.match(/<input\b/g)).toHaveLength(4);
    expect(markup.match(/role="radio"/g)).toHaveLength(10);
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(1);
    expect(markup.match(/role="button"/g)).toHaveLength(3);
  });
});
