import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { impactAsync, notificationAsync, selectionAsync } from "@/test/platform-test-setup";

let GameScreen: typeof import("@/screens/game-screen").GameScreen;
let LandingScreen: typeof import("@/screens/landing-screen").LandingScreen;
let Platform: typeof import("react-native").Platform;
let Pressable: typeof import("@/ui/pressable").Pressable;

beforeAll(async () => {
  ({ GameScreen } = await import("@/screens/game-screen"));
  ({ LandingScreen } = await import("@/screens/landing-screen"));
  ({ Platform } = await import("react-native"));
  ({ Pressable } = await import("@/ui/pressable"));
});

beforeEach(() => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
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

  test("enables keyboard avoidance on iOS", () => {
    const markup = renderToStaticMarkup(<GameScreen />);

    expect(markup).toContain('data-keyboard-behavior="padding"');
  });

  test("leaves keyboard avoidance disabled on web", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });

    const markup = renderToStaticMarkup(<GameScreen />);

    expect(markup).toContain('data-keyboard-behavior="none"');
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
