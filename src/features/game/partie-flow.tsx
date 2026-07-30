import type { Dispatch } from "react";

import type { GameAction } from "@/features/game/game-state";
import type { GameState } from "@/features/game/game.types";
import { ResultPhase } from "@/features/game/result-phase";
import { RoleRevealPhase } from "@/features/game/role-reveal-phase";
import { QuestionsPhase, ReadyPhase } from "@/features/game/round-phases";
import { SetupPhase } from "@/features/game/setup-phase";
import { VotePhase } from "@/features/game/vote-phase";

type PartieFlowProps = {
  game: GameState;
  dispatch: Dispatch<GameAction>;
  onRemovePlayer: (index: number) => void;
  onReset: () => void;
  onReturnToMenu: () => void;
};

export function PartieFlow({
  game,
  dispatch,
  onRemovePlayer,
  onReset,
  onReturnToMenu,
}: PartieFlowProps) {
  switch (game.phase) {
    case "setup":
      return (
        <SetupPhase
          game={game}
          onAddPlayer={() => dispatch({ type: "addPlayer" })}
          onPlayerNameChange={(index, name) => dispatch({ type: "setPlayerName", index, name })}
          onRemovePlayer={onRemovePlayer}
          onCategoryChange={(categoryId) => dispatch({ type: "setCategory", categoryId })}
          onDurationChange={(seconds) => dispatch({ type: "setDuration", seconds })}
          onReset={onReset}
          onStart={() => dispatch({ type: "startRound" })}
        />
      );
    case "roles":
      return game.round ? (
        <RoleRevealPhase
          players={game.players}
          round={game.round}
          onShowRole={() => dispatch({ type: "showRole" })}
          onHideAndContinue={() => dispatch({ type: "hideRole" })}
        />
      ) : null;
    case "ready":
      return game.round ? (
        <ReadyPhase
          players={game.players}
          round={game.round}
          roundNumber={game.roundNumber}
          onStart={() => dispatch({ type: "startQuestions" })}
        />
      ) : null;
    case "questions":
      return game.round ? (
        <QuestionsPhase
          players={game.players}
          round={game.round}
          onToggleTimer={() => dispatch({ type: "toggleTimer" })}
          onWordFound={() => dispatch({ type: "wordFound" })}
          onGiveUp={() => dispatch({ type: "giveUp" })}
        />
      ) : null;
    case "vote":
      return game.round ? (
        <VotePhase
          players={game.players}
          round={game.round}
          onSelect={(index) => dispatch({ type: "selectSuspect", index })}
          onReveal={() => dispatch({ type: "revealResult" })}
        />
      ) : null;
    case "result":
      return game.round?.outcome ? (
        <ResultPhase
          players={game.players}
          round={game.round}
          outcome={game.round.outcome}
          onNextRound={() => dispatch({ type: "startRound" })}
          onReturnToMenu={onReturnToMenu}
        />
      ) : null;
  }
}
