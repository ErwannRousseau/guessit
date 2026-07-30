import { beforeAll, describe, expect, mock, test } from "bun:test";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import * as ReactNativeWeb from "react-native-web";

import type { GameAction } from "@/features/game/game-state";

mock.module("react-native", () => ({
  ...ReactNativeWeb,
  Platform: { OS: "ios" },
}));
mock.module("../../../../assets/images/logo-mark.png", () => ({
  default: "/guessit-mark.png",
}));

let initialGameState: typeof import("@/features/game/game-state").initialGameState;
let MenuPrincipalPhase: typeof import("@/features/game/menu-principal-phase").MenuPrincipalPhase;

beforeAll(async () => {
  ({ initialGameState } = await import("@/features/game/game-state"));
  ({ MenuPrincipalPhase } = await import("@/features/game/menu-principal-phase"));
});

type MenuElementProps = {
  accessibilityLabel?: string;
  children?: ReactNode;
  label?: string;
  onChangeText?: (value: string) => void;
  onPress?: () => void;
};

function menuElements(node: ReactNode): ReactElement<MenuElementProps>[] {
  if (Array.isArray(node)) return node.flatMap(menuElements);
  if (!isValidElement<MenuElementProps>(node)) return [];
  return [node, ...menuElements(node.props.children)];
}

function menuControl(elements: ReactElement<MenuElementProps>[], name: string) {
  const control = elements.find(
    ({ props }) =>
      props.accessibilityLabel === name || props.label === name || props.children === name,
  );
  if (!control) throw new Error(`Contrôle Menu principal introuvable : ${name}`);
  return control;
}

describe("MenuPrincipalPhase", () => {
  test("wires interactions through its external interface", () => {
    const dispatch = mock((_action: GameAction) => {});
    const onRemovePlayer = mock((_index: number) => {});
    const onReset = mock(() => {});
    const elements = menuElements(
      MenuPrincipalPhase({
        game: initialGameState(),
        dispatch,
        onRemovePlayer,
        onReset,
      }),
    );

    menuControl(elements, "Nom du joueur 1").props.onChangeText?.(" Alice ");
    menuControl(elements, "Ajouter un joueur").props.onPress?.();
    menuControl(elements, "Retirer Joueur 1").props.onPress?.();
    menuControl(elements, "Objets").props.onPress?.();
    menuControl(elements, "3 min").props.onPress?.();
    menuControl(elements, "Distribuer les rôles").props.onPress?.();
    menuControl(elements, "Nouvelle partie").props.onPress?.();

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "setPlayerName",
      index: 0,
      name: " Alice ",
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: "addPlayer" });
    expect(onRemovePlayer).toHaveBeenCalledWith(0);
    expect(dispatch).toHaveBeenNthCalledWith(3, { type: "setCategory", categoryId: "objects" });
    expect(dispatch).toHaveBeenNthCalledWith(4, { type: "setDuration", seconds: 180 });
    expect(dispatch).toHaveBeenNthCalledWith(5, { type: "startRound" });
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
