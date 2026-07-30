import { useEffect, useReducer, useRef } from "react";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as StoreReview from "expo-store-review";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radii, spacing } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import { isIOS } from "@/lib/platform";
import { Pressable } from "@/ui/pressable";

import { gameReducer, initialGameState } from "@/features/game/game-state";
import { PartieFlowPhase } from "@/features/game/partie-flow-phase";

export function GameScreen() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGameState);
  const hasRequestedReview = useRef(false);
  const timerFinishedPlayer = useAudioPlayer(require("../../assets/sounds/timer-finished.wav"));

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "mixWithOthers" });
  }, []);

  useEffect(() => {
    if (
      game.phase !== "questions" ||
      !game.round?.timerRunning ||
      game.round.remainingSeconds <= 0
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (game.round?.remainingSeconds === 1) {
        void timerFinishedPlayer.seekTo(0).then(() => timerFinishedPlayer.play());
        triggerHaptic("warning");
      }
      dispatch({ type: "timerTick" });
    }, 1000);
    return () => clearInterval(interval);
  }, [game.phase, game.round?.timerRunning, game.round?.remainingSeconds, timerFinishedPlayer]);

  useEffect(() => {
    if (game.phase !== "result" || game.roundNumber !== 3 || hasRequestedReview.current) {
      return;
    }

    hasRequestedReview.current = true;
    void StoreReview.isAvailableAsync()
      .then((isAvailable) => (isAvailable ? StoreReview.requestReview() : undefined))
      .catch(() => undefined);
  }, [game.phase, game.roundNumber]);

  const resetGame = () => {
    Alert.alert(
      "Commencer une nouvelle partie ?",
      "Les joueurs, les scores et les réglages seront effacés.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "reset" });
            triggerHaptic("warning");
          },
        },
      ],
    );
  };

  const removePlayer = (index: number) => {
    const player = game.players[index];
    if (!player) return;
    const pointsLabel = `${player.score} point${Math.abs(player.score) === 1 ? "" : "s"}`;

    Alert.alert(`Retirer ${player.name} ?`, `Son score de ${pointsLabel} sera perdu.`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Retirer",
        style: "destructive",
        onPress: () => {
          dispatch({ type: "removePlayer", index });
          triggerHaptic("warning");
        },
      },
    ]);
  };

  const returnToMenu = () => {
    if (game.phase === "result") {
      dispatch({ type: "returnToMenu" });
      return;
    }

    const timerWasRunning = game.phase === "questions" && game.round?.timerRunning === true;
    if (timerWasRunning) {
      dispatch({ type: "toggleTimer" });
    }

    Alert.alert(
      "Retour au menu ?",
      "Cette manche sera annulée. Aucun score ne sera modifié.",
      [
        {
          text: "Continuer",
          style: "cancel",
          onPress: timerWasRunning ? () => dispatch({ type: "toggleTimer" }) : undefined,
        },
        {
          text: "Retour au menu",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "returnToMenu" });
            triggerHaptic("warning");
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={isIOS() ? "padding" : undefined} style={styles.flex}>
        {game.phase !== "setup" ? (
          <View style={styles.menuBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour au menu"
              haptic="selection"
              onPress={returnToMenu}
              style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
            >
              <Text style={styles.menuButtonText}>← Menu</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.flex}>
          <PartieFlowPhase
            game={game}
            dispatch={dispatch}
            onRemovePlayer={removePlayer}
            onReset={resetGame}
            onReturnToMenu={returnToMenu}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  menuBar: {
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  menuButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  menuButtonText: { color: colors.ink, fontSize: 14, lineHeight: 18, fontWeight: "900" },
});
