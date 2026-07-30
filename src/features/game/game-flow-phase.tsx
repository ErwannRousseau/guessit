import type { Dispatch } from "react";

import type { GameAction } from "@/features/game/game-state";
import type { GameState } from "@/features/game/game.types";
import { MainMenuPhase } from "@/features/game/main-menu-phase";
import { ResultPhase } from "@/features/game/result-phase";
import { RoleRevealPhase } from "@/features/game/role-reveal-phase";
import { QuestionsPhase, ReadyPhase } from "@/features/game/round-phases";
import { VotePhase } from "@/features/game/vote-phase";

type GameFlowPhaseProps = {
  game: GameState;
  dispatch: Dispatch<GameAction>;
  onRemovePlayer: (index: number) => void;
  onReset: () => void;
  onReturnToMenu: () => void;
};

export function GameFlowPhase({
  game,
  dispatch,
  onRemovePlayer,
  onReset,
  onReturnToMenu,
}: GameFlowPhaseProps) {
  switch (game.phase) {
    case "setup":
      return (
        <MainMenuPhase
          game={game}
          dispatch={dispatch}
          onRemovePlayer={onRemovePlayer}
          onReset={onReset}
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
