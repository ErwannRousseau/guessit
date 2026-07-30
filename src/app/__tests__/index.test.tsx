import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

let GameScreen: typeof import("@/screens/game-screen").GameScreen;
let HomeScreen: typeof import("@/app/index").default;
let LandingScreen: typeof import("@/screens/landing-screen").LandingScreen;
let Platform: typeof import("react-native").Platform;

beforeAll(async () => {
  await import("@/test/platform-test-setup");
  ({ GameScreen } = await import("@/screens/game-screen"));
  ({ default: HomeScreen } = await import("@/app/index"));
  ({ LandingScreen } = await import("@/screens/landing-screen"));
  ({ Platform } = await import("react-native"));
});

beforeEach(() => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
});

describe("HomeScreen", () => {
  test("opens the landing experience on web", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });

    expect(HomeScreen().type).toBe(LandingScreen);
  });

  test("opens the Partie on iOS", () => {
    expect(HomeScreen().type).toBe(GameScreen);
  });
});
