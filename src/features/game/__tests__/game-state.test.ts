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
      outcome: null,
      ...roundOverrides,
    },
  };
}

describe("gameReducer", () => {
  test("adds players and removes the selected player while preserving everyone else", () => {
    const initial = initialGameState();
    const added = gameReducer(initial, { type: "addPlayer" });
    const named = gameReducer(added, { type: "setPlayerName", index: 2, name: "Chloé" });
    const removed = gameReducer(named, { type: "removePlayer", index: 1 });

    expect(added.players.at(-1)).toEqual({ id: "player-5", name: "Joueur 5", score: 0 });
    expect(removed.playerCount).toBe(MIN_PLAYERS);
    expect(removed.players.map(({ id }) => id)).toEqual([
      "player-1",
      "player-3",
      "player-4",
      "player-5",
    ]);
    expect(removed.players[1].name).toBe("Chloé");
    expect(gameReducer(removed, { type: "removePlayer", index: 0 })).toBe(removed);

    let maximum = removed;
    while (maximum.playerCount < MAX_PLAYERS) {
      maximum = gameReducer(maximum, { type: "addPlayer" });
    }
    expect(gameReducer(maximum, { type: "addPlayer" })).toBe(maximum);
  });

  test("starts a round with trimmed names and selected settings", () => {
    const initial = initialGameState();
    const named = gameReducer(initial, { type: "setPlayerName", index: 0, name: "  Alice  " });
    const blank = gameReducer(named, { type: "setPlayerName", index: 1, name: "  " });
    const categorized = gameReducer(blank, { type: "setCategory", categoryId: "objects" });
    const configured = gameReducer(categorized, { type: "setDuration", seconds: 180 });
    const started = gameReducer(configured, { type: "startRound" });

    expect(started.phase).toBe("roles");
    expect(started.players[0].name).toBe("Alice");
    expect(started.players[1].name).toBe("Joueur 2");
    expect(started.round).toMatchObject({
      categoryId: "objects",
      remainingSeconds: 180,
    });
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

  test("ends the round and penalizes the insider when the timer expires", () => {
    const result = gameReducer(activeGame(), { type: "timerTick" });

    expect(result.phase).toBe("result");
    expect(result.round).toMatchObject({
      remainingSeconds: 0,
      timerRunning: false,
      endReason: "time-up",
      outcome: {
        title: "Le Complice perd 1 point !",
      },
    });
    expect(result.players.map(({ score }) => score)).toEqual([0, -1, 0, 0]);
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

  test("awards the insider for a wrong accusation and penalizes them for giving up", () => {
    const voting = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "wordFound" });
    const selected = gameReducer(voting, { type: "selectSuspect", index: 2 });
    const wrongAccusation = gameReducer(selected, { type: "revealResult" });
    const givenUp = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "giveUp" });

    expect(wrongAccusation.players.map(({ score }) => score)).toEqual([0, 2, 0, 0]);
    expect(givenUp.players.map(({ score }) => score)).toEqual([0, -1, 0, 0]);
  });

  test("applies each round score only once", () => {
    const givenUp = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "giveUp" });
    const voting = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "wordFound" });
    const selected = gameReducer(voting, { type: "selectSuspect", index: 1 });
    const revealed = gameReducer(selected, { type: "revealResult" });

    expect(gameReducer(givenUp, { type: "giveUp" })).toBe(givenUp);
    expect(gameReducer(revealed, { type: "revealResult" })).toBe(revealed);
  });

  test("returns to the menu without scoring or counting an active round", () => {
    const game = activeGame({ remainingSeconds: 120 });
    const result = gameReducer(game, { type: "returnToMenu" });
    const initial = initialGameState();

    expect(result).toMatchObject({ phase: "setup", round: null, roundNumber: 0 });
    expect(result.players).toBe(game.players);
    expect(gameReducer(initial, { type: "returnToMenu" })).toBe(initial);
  });

  test("returns to the menu while preserving a completed round and its scores", () => {
    const completed = gameReducer(activeGame({ remainingSeconds: 120 }), { type: "giveUp" });
    const result = gameReducer(completed, { type: "returnToMenu" });

    expect(result).toMatchObject({ phase: "setup", round: null, roundNumber: 1 });
    expect(result.players.map(({ score }) => score)).toEqual([0, -1, 0, 0]);
  });

  test("preserves scores when starting the next round", () => {
    const result = gameReducer(activeGame({ endReason: "time-up", timerRunning: false }), {
      type: "giveUp",
    });
    const nextRound = gameReducer(result, { type: "startRound" });

    expect(nextRound.phase).toBe("roles");
    expect(nextRound.roundNumber).toBe(2);
    expect(nextRound.players.map(({ score }) => score)).toEqual([0, -1, 0, 0]);
    expect(nextRound.round?.masterIndex).not.toBe(nextRound.round?.insiderIndex);
  });

  test("resets the full game state", () => {
    expect(gameReducer(activeGame(), { type: "reset" })).toEqual(initialGameState());
  });
});
