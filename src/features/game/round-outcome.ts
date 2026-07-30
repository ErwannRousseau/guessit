import type { Player, Round, RoundOutcome } from "@/features/game/game.types";

export type RoundCompletion = {
  players: Player[];
  round: Round;
};

export function completeRound(players: Player[], round: Round): RoundCompletion | null {
  if (round.outcome) return null;

  if (round.endReason === "time-up") {
    const outcome: RoundOutcome = {
      tone: "danger",
      kicker: "TEMPS ÉCOULÉ",
      title: "Le Complice perd 1 point !",
      description: "Le groupe n’a pas trouvé le mot avant la fin du temps imparti.",
    };
    return {
      players: players.map((player, index) =>
        index === round.insiderIndex ? { ...player, score: player.score - 1 } : player,
      ),
      round: { ...round, outcome },
    };
  }

  if (round.endReason !== "word-found" || round.suspectedIndex === null) return null;

  const insiderFound = round.suspectedIndex === round.insiderIndex;
  const outcome: RoundOutcome = insiderFound
    ? {
        tone: "success",
        kicker: "ENQUÊTE RÉUSSIE",
        title: "Tous les autres joueurs gagnent !",
        description: "Le mot et le Complice ont tous les deux été trouvés.",
      }
    : {
        tone: "danger",
        kicker: "MISSION ACCOMPLIE",
        title: "Le Complice s’en sort !",
        description: `${players[round.suspectedIndex].name} a été accusé à tort.`,
      };

  return {
    players: players.map((player, index) => {
      if (insiderFound) {
        return index === round.insiderIndex ? player : { ...player, score: player.score + 1 };
      }
      return index === round.insiderIndex ? { ...player, score: player.score + 2 } : player;
    }),
    round: { ...round, outcome },
  };
}
