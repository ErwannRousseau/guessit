import { applyRoundScore, createPlayers, createRound } from "./game-engine";
import type { CategoryId, GameState, Round } from "./game.types";

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 10;

export function initialGameState(): GameState {
  return {
    phase: "setup",
    players: createPlayers(MIN_PLAYERS),
    playerCount: MIN_PLAYERS,
    categoryId: "mix",
    durationSeconds: 300,
    roundNumber: 0,
    round: null,
  };
}

type GameAction =
  | { type: "setPlayerCount"; count: number }
  | { type: "setPlayerName"; index: number; name: string }
  | { type: "setCategory"; categoryId: CategoryId }
  | { type: "setDuration"; seconds: number }
  | { type: "startRound" }
  | { type: "showRole" }
  | { type: "hideRole" }
  | { type: "startQuestions" }
  | { type: "toggleTimer" }
  | { type: "timerTick" }
  | { type: "wordFound" }
  | { type: "giveUp" }
  | { type: "selectSuspect"; index: number }
  | { type: "revealResult" }
  | { type: "reset" };

function completeRound(game: GameState, round: Round): GameState {
  return {
    ...game,
    phase: "result",
    round,
    players: applyRoundScore(game.players, round),
  };
}

export function gameReducer(game: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "setPlayerCount": {
      const playerCount = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, action.count));
      return {
        ...game,
        playerCount,
        players: createPlayers(playerCount, game.players),
      };
    }
    case "setPlayerName":
      return {
        ...game,
        players: game.players.map((player, index) =>
          index === action.index ? { ...player, name: action.name } : player,
        ),
      };
    case "setCategory":
      return { ...game, categoryId: action.categoryId };
    case "setDuration":
      return { ...game, durationSeconds: action.seconds };
    case "startRound": {
      const players = game.players.map((player, index) => ({
        ...player,
        name: player.name.trim() || `Joueur ${index + 1}`,
      }));
      return {
        ...game,
        phase: "roles",
        players,
        roundNumber: game.roundNumber + 1,
        round: createRound(game.playerCount, game.categoryId, game.durationSeconds),
      };
    }
    case "showRole":
      return game.round ? { ...game, round: { ...game.round, roleVisible: true } } : game;
    case "hideRole": {
      if (!game.round) return game;
      if (game.round.revealIndex === game.players.length - 1) {
        return {
          ...game,
          phase: "ready",
          round: { ...game.round, roleVisible: false },
        };
      }
      return {
        ...game,
        round: {
          ...game.round,
          revealIndex: game.round.revealIndex + 1,
          roleVisible: false,
        },
      };
    }
    case "startQuestions":
      return game.round
        ? {
            ...game,
            phase: "questions",
            round: { ...game.round, timerRunning: true },
          }
        : game;
    case "toggleTimer":
      return game.round
        ? { ...game, round: { ...game.round, timerRunning: !game.round.timerRunning } }
        : game;
    case "timerTick": {
      if (game.phase !== "questions" || !game.round?.timerRunning) return game;
      const remainingSeconds = Math.max(0, game.round.remainingSeconds - 1);
      if (remainingSeconds > 0) {
        return { ...game, round: { ...game.round, remainingSeconds } };
      }
      const round: Round = {
        ...game.round,
        remainingSeconds: 0,
        timerRunning: false,
        endReason: "time-up",
        scoreApplied: true,
      };
      return completeRound(game, round);
    }
    case "wordFound":
      return game.round
        ? {
            ...game,
            phase: "vote",
            round: { ...game.round, timerRunning: false, endReason: "word-found" },
          }
        : game;
    case "giveUp":
      return game.round
        ? completeRound(game, {
            ...game.round,
            timerRunning: false,
            endReason: "time-up",
            scoreApplied: true,
          })
        : game;
    case "selectSuspect":
      return game.round
        ? { ...game, round: { ...game.round, suspectedIndex: action.index } }
        : game;
    case "revealResult": {
      if (!game.round || game.round.suspectedIndex === null) return game;
      return completeRound(game, { ...game.round, scoreApplied: true });
    }
    case "reset":
      return initialGameState();
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
