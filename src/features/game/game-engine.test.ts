import { afterEach, describe, expect, mock, test } from "bun:test";

import { applyRoundScore, createPlayers, createRound, formatTime, getRole } from "./game-engine";
import type { Player, Round } from "./game.types";

const originalRandom = Math.random;

const players: Player[] = [
  { id: "player-1", name: "Alice", score: 0 },
  { id: "player-2", name: "Bob", score: 2 },
  { id: "player-3", name: "Chloé", score: 1 },
  { id: "player-4", name: "David", score: 0 },
];

function round(overrides: Partial<Round> = {}): Round {
  return {
    word: "Boussole",
    categoryId: "objects",
    masterIndex: 0,
    insiderIndex: 1,
    revealIndex: 0,
    roleVisible: false,
    remainingSeconds: 300,
    timerRunning: false,
    endReason: null,
    suspectedIndex: null,
    scoreApplied: false,
    ...overrides,
  };
}

afterEach(() => {
  Math.random = originalRandom;
  mock.restore();
});

describe("createPlayers", () => {
  test("creates defaults and preserves existing identities, names, and scores", () => {
    expect(createPlayers(2)).toEqual([
      { id: "player-1", name: "Joueur 1", score: 0 },
      { id: "player-2", name: "Joueur 2", score: 0 },
    ]);

    expect(createPlayers(5, players)).toEqual([
      ...players,
      { id: "player-5", name: "Joueur 5", score: 0 },
    ]);
  });
});

describe("createRound", () => {
  test("selects distinct master and insider roles and preserves round settings", () => {
    const random = mock(() => 0);
    random.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1).mockReturnValueOnce(0.4);
    Math.random = random;

    const result = createRound(4, "objects", 420);

    expect(result).toEqual({
      word: "Parapluie",
      categoryId: "objects",
      masterIndex: 0,
      insiderIndex: 1,
      revealIndex: 0,
      roleVisible: false,
      remainingSeconds: 420,
      timerRunning: false,
      endReason: null,
      suspectedIndex: null,
      scoreApplied: false,
    });
  });

  test("resolves the mixed category to a playable category", () => {
    const random = mock(() => 0);
    random.mockReturnValueOnce(0.2).mockReturnValueOnce(0.1).mockReturnValueOnce(0.4);
    Math.random = random;

    expect(createRound(4, "mix", 300)).toMatchObject({
      word: "Panda",
      categoryId: "animals",
      masterIndex: 0,
      insiderIndex: 1,
    });
  });
});

describe("role and display helpers", () => {
  test("maps every player role", () => {
    const currentRound = round();
    expect(getRole(currentRound, 0)).toBe("master");
    expect(getRole(currentRound, 1)).toBe("insider");
    expect(getRole(currentRound, 2)).toBe("detective");
  });

  test("formats a duration as minutes and zero-padded seconds", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(600)).toBe("10:00");
  });
});

describe("applyRoundScore", () => {
  test("awards one point to every detective when the insider is found", () => {
    expect(applyRoundScore(players, round({ endReason: "word-found", suspectedIndex: 1 }))).toEqual(
      [
        { ...players[0], score: 1 },
        players[1],
        { ...players[2], score: 2 },
        { ...players[3], score: 1 },
      ],
    );
  });

  test("awards the insider two points for a wrong accusation", () => {
    expect(applyRoundScore(players, round({ endReason: "word-found", suspectedIndex: 2 }))).toEqual(
      [players[0], { ...players[1], score: 4 }, players[2], players[3]],
    );
  });

  test("awards the insider one point when time expires", () => {
    expect(applyRoundScore(players, round({ endReason: "time-up" }))).toEqual([
      players[0],
      { ...players[1], score: 3 },
      players[2],
      players[3],
    ]);
  });
});
