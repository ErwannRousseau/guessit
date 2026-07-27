import type { CategoryId, Player, Role, Round } from "./game.types";
import { playableCategoryIds, wordsByCategory } from "./words";

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function createPlayers(count: number, previousPlayers: Player[] = []): Player[] {
  const nextPlayerNumber =
    previousPlayers.reduce((highest, player) => {
      const playerNumber = Number(/^player-(\d+)$/.exec(player.id)?.[1] ?? 0);
      return Math.max(highest, playerNumber);
    }, 0) + 1;

  return Array.from({ length: count }, (_, index) => ({
    id:
      previousPlayers[index]?.id ??
      `player-${nextPlayerNumber + Math.max(0, index - previousPlayers.length)}`,
    name: previousPlayers[index]?.name ?? `Joueur ${index + 1}`,
    score: previousPlayers[index]?.score ?? 0,
  }));
}

export function createRound(
  playerCount: number,
  categoryId: CategoryId,
  durationSeconds: number,
): Round {
  const selectedCategory =
    categoryId === "mix"
      ? playableCategoryIds[randomIndex(playableCategoryIds.length)]
      : categoryId;
  const words = wordsByCategory[selectedCategory];
  const masterIndex = randomIndex(playerCount);

  let insiderIndex = randomIndex(playerCount);
  while (insiderIndex === masterIndex) {
    insiderIndex = randomIndex(playerCount);
  }

  return {
    word: words[randomIndex(words.length)],
    categoryId: selectedCategory,
    masterIndex,
    insiderIndex,
    revealIndex: 0,
    roleVisible: false,
    remainingSeconds: durationSeconds,
    timerRunning: false,
    endReason: null,
    suspectedIndex: null,
    scoreApplied: false,
  };
}

export function getRole(round: Round, playerIndex: number): Role {
  if (playerIndex === round.masterIndex) return "master";
  if (playerIndex === round.insiderIndex) return "insider";
  return "detective";
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function applyRoundScore(players: Player[], round: Round): Player[] {
  const detectivesWon =
    round.endReason === "word-found" && round.suspectedIndex === round.insiderIndex;

  return players.map((player, index) => {
    if (detectivesWon) {
      return index === round.insiderIndex ? player : { ...player, score: player.score + 1 };
    }

    if (index === round.insiderIndex) {
      const points = round.endReason === "word-found" ? 2 : -1;
      return { ...player, score: player.score + points };
    }

    return player;
  });
}
