import { describe, expect, test } from "bun:test";

import {
  gameReducer,
  initialGameState,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from "@/features/game/game-state";
import type { GameState, Round } from "@/features/game/game.types";

function activeGame(roundOverrides: Partial<Round> = {}): GameState {
  return {
    ...initialGameState(),
    phase: "questions",
    players: [
      { id: "player-1", name: "Alice", score: 0 },
      { id: "player-2", name: "Bob", score: 0 },
      { id: "player-3", name: "Chloé", score: 0 },
      { id: "player-4", name: "David", score: 0 },
    ],
    roundNumber: 1,
    round: {
      word: "Boussole",
      categoryId: "objects",
      masterIndex: 0,
      insiderIndex: 1,
      revealIndex: 0,
      roleVisible: false,
      remainingSeconds: 1,
      timerRunning: true,
      endReason: null,
      suspectedIndex: null,
      scoreApplied: false,
      ...roundOverrides,
    },
  };
}

describe("gameReducer", () => {
  test("clamps the player count and preserves existing player data", () => {
    const initial = initialGameState();
    const named = gameReducer(initial, { type: "setPlayerName", index: 0, name: " Alice " });
    const maximum = gameReducer(named, { type: "setPlayerCount", count: MAX_PLAYERS + 4 });
    const minimum = gameReducer(maximum, { type: "setPlayerCount", count: MIN_PLAYERS - 4 });

    expect(maximum.playerCount).toBe(MAX_PLAYERS);
    expect(maximum.players[0].name).toBe(" Alice ");
    expect(minimum.playerCount).toBe(MIN_PLAYERS);
    expect(minimum.players).toHaveLength(MIN_PLAYERS);
  });

  test("advances private role reveals to the ready phase", () => {
    let game: GameState = { ...activeGame(), phase: "roles" };

    game = gameReducer(game, { type: "showRole" });
    expect(game.round?.roleVisible).toBe(true);

    for (let index = 0; index < game.players.length; index += 1) {
      game = gameReducer(game, { type: "hideRole" });
    }

    expect(game.phase).toBe("ready");
    expect(game.round?.revealIndex).toBe(game.players.length - 1);
    expect(game.round?.roleVisible).toBe(false);
  });

  test("ends the round and awards the insider when the timer expires", () => {
    const result = gameReducer(activeGame(), { type: "timerTick" });

    expect(result.phase).toBe("result");
    expect(result.round).toMatchObject({
      remainingSeconds: 0,
      timerRunning: false,
      endReason: "time-up",
      scoreApplied: true,
    });
    expect(result.players.map(({ score }) => score)).toEqual([0, 1, 0, 0]);
  });

  test("pauses and resumes timer ticks", () => {
    const paused = gameReducer(activeGame({ remainingSeconds: 30 }), { type: "toggleTimer" });

    expect(paused.round?.timerRunning).toBe(false);
    expect(gameReducer(paused, { type: "timerTick" })).toBe(paused);

    const resumed = gameReducer(paused, { type: "toggleTimer" });
    const ticked = gameReducer(resumed, { type: "timerTick" });
    expect(ticked.round?.remainingSeconds).toBe(29);
  });

  test("records a vote and awards detectives when the insider is identified", () => {
    const voting = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "wordFound" });
    const selected = gameReducer(voting, { type: "selectSuspect", index: 1 });
    const result = gameReducer(selected, { type: "revealResult" });

    expect(voting.phase).toBe("vote");
    expect(result.phase).toBe("result");
    expect(result.players.map(({ score }) => score)).toEqual([1, 0, 1, 1]);
  });

  test("awards the insider for a wrong accusation and for giving up", () => {
    const voting = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "wordFound" });
    const selected = gameReducer(voting, { type: "selectSuspect", index: 2 });
    const wrongAccusation = gameReducer(selected, { type: "revealResult" });
    const givenUp = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "giveUp" });

    expect(wrongAccusation.players.map(({ score }) => score)).toEqual([0, 2, 0, 0]);
    expect(givenUp.players.map(({ score }) => score)).toEqual([0, 1, 0, 0]);
  });

  test("preserves scores when starting the next round", () => {
    const result = gameReducer(activeGame({ endReason: "time-up", timerRunning: false }), {
      type: "giveUp",
    });
    const nextRound = gameReducer(result, { type: "startRound" });

    expect(nextRound.phase).toBe("roles");
    expect(nextRound.roundNumber).toBe(2);
    expect(nextRound.players.map(({ score }) => score)).toEqual([0, 1, 0, 0]);
    expect(nextRound.round?.masterIndex).not.toBe(nextRound.round?.insiderIndex);
  });

  test("resets the full game state", () => {
    expect(gameReducer(activeGame(), { type: "reset" })).toEqual(initialGameState());
  });
});
