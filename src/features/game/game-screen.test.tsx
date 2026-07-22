import { beforeAll, describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import * as ReactNativeWeb from "react-native-web";

mock.module("react-native", () => ReactNativeWeb);
mock.module("react-native-safe-area-context", () => ({
  SafeAreaView: ReactNativeWeb.View,
}));

let GameScreen: typeof import("./game-screen").GameScreen;

beforeAll(async () => {
  ({ GameScreen } = await import("./game-screen"));
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
