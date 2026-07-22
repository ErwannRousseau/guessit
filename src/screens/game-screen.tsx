import { useEffect, useReducer } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";

import { gameReducer, initialGameState } from "@/features/game/game-state";
import { QuestionsScreen, ReadyScreen } from "@/features/game/questions-screen";
import { ResultScreen } from "@/features/game/result-screen";
import { RoleRevealScreen } from "@/features/game/role-reveal-screen";
import { SetupScreen } from "@/features/game/setup-screen";
import { VoteScreen } from "@/features/game/vote-screen";

export function GameScreen() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGameState);

  useEffect(() => {
    if (
      game.phase !== "questions" ||
      !game.round?.timerRunning ||
      game.round.remainingSeconds <= 0
    ) {
      return;
    }

    const interval = setInterval(() => dispatch({ type: "timerTick" }), 1000);
    return () => clearInterval(interval);
  }, [game.phase, game.round?.timerRunning, game.round?.remainingSeconds]);

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
          <SetupScreen
            game={game}
            onPlayerCountChange={(count) => dispatch({ type: "setPlayerCount", count })}
            onPlayerNameChange={(index, name) => dispatch({ type: "setPlayerName", index, name })}
            onCategoryChange={(categoryId) => dispatch({ type: "setCategory", categoryId })}
            onDurationChange={(seconds) => dispatch({ type: "setDuration", seconds })}
            onStart={() => dispatch({ type: "startRound" })}
          />
        ) : null}

        {game.phase === "roles" && game.round ? (
          <RoleRevealScreen
            players={game.players}
            round={game.round}
            onShowRole={() => dispatch({ type: "showRole" })}
            onHideAndContinue={() => dispatch({ type: "hideRole" })}
          />
        ) : null}

        {game.phase === "ready" && game.round ? (
          <ReadyScreen
            players={game.players}
            round={game.round}
            roundNumber={game.roundNumber}
            onStart={() => dispatch({ type: "startQuestions" })}
          />
        ) : null}

        {game.phase === "questions" && game.round ? (
          <QuestionsScreen
            players={game.players}
            round={game.round}
            onToggleTimer={() => dispatch({ type: "toggleTimer" })}
            onWordFound={() => dispatch({ type: "wordFound" })}
            onGiveUp={() => dispatch({ type: "giveUp" })}
          />
        ) : null}

        {game.phase === "vote" && game.round ? (
          <VoteScreen
            players={game.players}
            round={game.round}
            onSelect={(index) => dispatch({ type: "selectSuspect", index })}
            onReveal={() => dispatch({ type: "revealResult" })}
          />
        ) : null}

        {game.phase === "result" && game.round ? (
          <ResultScreen
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
