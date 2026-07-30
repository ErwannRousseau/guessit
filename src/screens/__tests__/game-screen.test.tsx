import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import * as ReactNativeWeb from "react-native-web";

const impactAsync = mock(async () => {});
const notificationAsync = mock(async () => {});
const selectionAsync = mock(async () => {});

mock.module("react-native", () => ({
  ...ReactNativeWeb,
  Platform: { OS: "ios" },
}));
mock.module("react-native-safe-area-context", () => ({
  SafeAreaView: ReactNativeWeb.View,
}));
mock.module("../../../assets/images/icon.png", () => ({ default: "/guessit-icon.png" }));
mock.module("../../../assets/images/logo-mark.png", () => ({ default: "/guessit-mark.png" }));
mock.module("../../../assets/images/splash-lockup.png", () => ({
  default: "/guessit-lockup.png",
}));
mock.module("../../../store-assets/apple/iphone/1320x2868/fr-FR/01-hero.png", () => ({
  default: "/guessit-setup.png",
}));
mock.module("../../../store-assets/apple/iphone/1320x2868/fr-FR/02-device-bottom.png", () => ({
  default: "/guessit-role.png",
}));
mock.module("../../../store-assets/apple/iphone/1320x2868/fr-FR/04-device-top.png", () => ({
  default: "/guessit-timer.png",
}));
mock.module("../../../store-assets/apple/iphone/1320x2868/fr-FR/06-device-bottom.png", () => ({
  default: "/guessit-score.png",
}));
mock.module("../../../assets/sounds/timer-finished.wav", () => ({ default: 1 }));
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

let GameScreen: typeof import("@/screens/game-screen").GameScreen;
let LandingScreen: typeof import("@/screens/landing-screen").LandingScreen;
let Platform: typeof import("react-native").Platform;
let Pressable: typeof import("@/ui/pressable").Pressable;
let confirmAction: typeof import("@/lib/confirmation").confirmAction;

beforeAll(async () => {
  ({ GameScreen } = await import("@/screens/game-screen"));
  ({ LandingScreen } = await import("@/screens/landing-screen"));
  ({ Platform } = await import("react-native"));
  ({ Pressable } = await import("@/ui/pressable"));
  ({ confirmAction } = await import("@/lib/confirmation"));
});

beforeEach(() => {
  impactAsync.mockClear();
  notificationAsync.mockClear();
  selectionAsync.mockClear();
});

describe("GameScreen", () => {
  test("renders an accessible four-player setup", () => {
    const markup = renderToStaticMarkup(<GameScreen />);

    expect(markup.match(/<input\b/g)).toHaveLength(4);
    expect(markup.match(/role="radio"/g)).toHaveLength(10);
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(4);
    expect(markup.match(/role="button"/g)).toHaveLength(7);
    expect(markup).toContain("Ajouter un joueur");
    expect(markup).toContain("Nouvelle partie");
  });
});

describe("LandingScreen", () => {
  test("prioritizes mobile downloads before web play", () => {
    const markup = renderToStaticMarkup(<LandingScreen />);

    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(4);
    expect(markup).toContain("Télécharger sur l’App Store");
    expect(markup).toContain("Télécharger sur Google Play");
    expect(markup).toContain("Bientôt disponible");
    expect(markup).toContain(">iOS<");
    expect(markup).toContain(">Android<");
    expect(markup).toContain('href="/play"');
    expect(markup).toContain("Jouer sur le web");
  });
});

describe("Pressable", () => {
  const press = (haptic?: import("@/ui/pressable").HapticFeedback) => {
    const element = Pressable({ children: "Action", haptic });
    element.props.onPress({});
  };

  test("stays silent without a haptic prop", () => {
    press();

    expect(impactAsync).not.toHaveBeenCalled();
    expect(notificationAsync).not.toHaveBeenCalled();
    expect(selectionAsync).not.toHaveBeenCalled();
  });

  test("stays silent on web", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });

    press("warning");

    expect(notificationAsync).not.toHaveBeenCalled();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  });

  test("maps each haptic prop to its native effect", () => {
    press("selection");
    press("light");
    press("medium");
    press("success");
    press("warning");

    expect(selectionAsync).toHaveBeenCalledTimes(1);
    expect(impactAsync).toHaveBeenNthCalledWith(1, "light");
    expect(impactAsync).toHaveBeenNthCalledWith(2, "medium");
    expect(notificationAsync).toHaveBeenNthCalledWith(1, "success");
    expect(notificationAsync).toHaveBeenNthCalledWith(2, "warning");
  });
});

describe("confirmAction", () => {
  test("runs the confirmed web action", () => {
    const confirm = mock(() => true);
    const onConfirm = mock(() => {});
    const onCancel = mock(() => {});
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    Object.defineProperty(globalThis, "confirm", { configurable: true, value: confirm });

    confirmAction({
      title: "Retirer Joueur 5 ?",
      message: "Son score de 0 points sera perdu.",
      confirmText: "Retirer",
      cancelText: "Annuler",
      onConfirm,
      onCancel,
    });

    expect(confirm).toHaveBeenCalledWith("Retirer Joueur 5 ?\n\nSon score de 0 points sera perdu.");
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  });

  test("runs the cancelled web action", () => {
    const onConfirm = mock(() => {});
    const onCancel = mock(() => {});
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    Object.defineProperty(globalThis, "confirm", {
      configurable: true,
      value: mock(() => false),
    });

    confirmAction({
      title: "Retour au menu ?",
      message: "Cette manche sera annulée.",
      confirmText: "Retour au menu",
      cancelText: "Continuer",
      onConfirm,
      onCancel,
    });

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  });
});
