import { describe, expect, test } from "bun:test";

import { completeRound } from "@/features/game/round-outcome";
import type { Player, Round } from "@/features/game/game.types";

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
    endReason: "word-found",
    suspectedIndex: 1,
    outcome: null,
    ...overrides,
  };
}

describe("completeRound", () => {
  test("awards every other player and describes a found Complice", () => {
    const completion = completeRound(players, round());

    expect(completion?.players).toEqual([
      { ...players[0], score: 1 },
      players[1],
      { ...players[2], score: 2 },
      { ...players[3], score: 1 },
    ]);
    expect(completion?.round.outcome).toMatchObject({
      kicker: "ENQUÊTE RÉUSSIE",
      title: "Tous les autres joueurs gagnent !",
      description: "Le mot et le Complice ont tous les deux été trouvés.",
    });
  });

  test("awards the Complice and names the wrongly accused Joueur", () => {
    const completion = completeRound(players, round({ suspectedIndex: 2 }));

    expect(completion?.players).toEqual([
      players[0],
      { ...players[1], score: 4 },
      players[2],
      players[3],
    ]);
    expect(completion?.round.outcome).toMatchObject({
      kicker: "MISSION ACCOMPLIE",
      title: "Le Complice s’en sort !",
      description: "Chloé a été accusé à tort.",
    });
  });

  test("deducts one point and describes an Échec du Complice", () => {
    const completion = completeRound(
      players,
      round({ endReason: "time-up", suspectedIndex: null }),
    );

    expect(completion?.players).toEqual([
      players[0],
      { ...players[1], score: 1 },
      players[2],
      players[3],
    ]);
    expect(completion?.round.outcome).toMatchObject({
      kicker: "TEMPS ÉCOULÉ",
      title: "Le Complice perd 1 point !",
      description: "Le groupe n’a pas trouvé le mot avant la fin du temps imparti.",
    });
  });

  test("rejects duplicate completion through the module interface", () => {
    const completion = completeRound(players, round());

    expect(completion).not.toBeNull();
    if (!completion) throw new Error("Expected completed Manche");
    expect(completeRound(completion.players, completion.round)).toBeNull();
  });
});
