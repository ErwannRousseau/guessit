import { useEffect, useReducer, useRef } from "react";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";

import { gameReducer, initialGameState } from "@/features/game/game-state";
import { ResultPhase } from "@/features/game/result-phase";
import { RoleRevealPhase } from "@/features/game/role-reveal-phase";
import { QuestionsPhase, ReadyPhase } from "@/features/game/round-phases";
import { SetupPhase } from "@/features/game/setup-phase";
import { VotePhase } from "@/features/game/vote-phase";

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
        if (Platform.OS !== "web") {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
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
    Alert.alert("Revenir à l’accueil ?", "Les scores de cette partie seront effacés.", [
      { text: "Annuler", style: "cancel" },
      { text: "Effacer", style: "destructive", onPress: () => dispatch({ type: "reset" }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        {game.phase === "setup" ? (
          <SetupPhase
            game={game}
            onPlayerCountChange={(count) => dispatch({ type: "setPlayerCount", count })}
            onPlayerNameChange={(index, name) => dispatch({ type: "setPlayerName", index, name })}
            onCategoryChange={(categoryId) => dispatch({ type: "setCategory", categoryId })}
            onDurationChange={(seconds) => dispatch({ type: "setDuration", seconds })}
            onStart={() => dispatch({ type: "startRound" })}
          />
        ) : null}

        {game.phase === "roles" && game.round ? (
          <RoleRevealPhase
            players={game.players}
            round={game.round}
            onShowRole={() => dispatch({ type: "showRole" })}
            onHideAndContinue={() => dispatch({ type: "hideRole" })}
          />
        ) : null}

        {game.phase === "ready" && game.round ? (
          <ReadyPhase
            players={game.players}
            round={game.round}
            roundNumber={game.roundNumber}
            onStart={() => dispatch({ type: "startQuestions" })}
          />
        ) : null}

        {game.phase === "questions" && game.round ? (
          <QuestionsPhase
            players={game.players}
            round={game.round}
            onToggleTimer={() => dispatch({ type: "toggleTimer" })}
            onWordFound={() => dispatch({ type: "wordFound" })}
            onGiveUp={() => dispatch({ type: "giveUp" })}
          />
        ) : null}

        {game.phase === "vote" && game.round ? (
          <VotePhase
            players={game.players}
            round={game.round}
            onSelect={(index) => dispatch({ type: "selectSuspect", index })}
            onReveal={() => dispatch({ type: "revealResult" })}
          />
        ) : null}

        {game.phase === "result" && game.round ? (
          <ResultPhase
            players={game.players}
            round={game.round}
            onNextRound={() => dispatch({ type: "startRound" })}
            onReset={resetGame}
          />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
});
