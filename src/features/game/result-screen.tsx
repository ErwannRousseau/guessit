import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import type { Player, Round } from "./game.types";

export function ResultScreen({
  players,
  round,
  onNextRound,
  onReset,
}: {
  players: Player[];
  round: Round;
  onNextRound: () => void;
  onReset: () => void;
}) {
  const detectivesWon =
    round.endReason === "word-found" && round.suspectedIndex === round.insiderIndex;
  const winnerTitle = detectivesWon ? "Les Enquêteurs gagnent !" : "Le Complice s’en sort !";
  const winnerDescription = detectivesWon
    ? "Le mot et le Complice ont tous les deux été trouvés."
    : round.endReason === "time-up"
      ? "Le groupe n’a pas trouvé le mot avant la fin du temps."
      : `${players[round.suspectedIndex ?? 0].name} a été accusé à tort.`;
      console.log(players);
  const sortedPlayers = players.toSorted((a, b) => b.score - a.score);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card tone={detectivesWon ? "success" : "danger"} style={styles.resultHero}>
        <Text selectable style={styles.resultKicker}>
          {detectivesWon ? "ENQUÊTE RÉUSSIE" : "MISSION ACCOMPLIE"}
        </Text>
        <Text selectable style={styles.resultTitle}>
          {winnerTitle}
        </Text>
        <Text selectable style={styles.resultDescription}>
          {winnerDescription}
        </Text>
      </Card>
      <Card>
        <RevealLine label="Mot secret" value={round.word} emphasis />
        <View style={styles.divider} />
        <RevealLine label="Complice" value={players[round.insiderIndex].name} />
        <RevealLine label="Maître du jeu" value={players[round.masterIndex].name} />
        {round.suspectedIndex !== null ? (
          <RevealLine label="Personne accusée" value={players[round.suspectedIndex].name} />
        ) : null}
      </Card>
      <Card>
        <Text selectable style={styles.scoreTitle}>
          Classement
        </Text>
        {sortedPlayers.map((player, index) => (
          <View key={player.id} style={styles.scoreRow}>
            <View style={styles.rankBadge}>
              <Text selectable style={styles.rankText}>
                {index + 1}
              </Text>
            </View>
            <Text selectable style={styles.scoreName}>
              {player.name}
            </Text>
            <Text selectable style={styles.scoreValue}>
              {player.score} pt{player.score > 1 ? "s" : ""}
            </Text>
          </View>
        ))}
      </Card>
      <Button onPress={onNextRound}>Nouvelle manche</Button>
      <Button variant="ghost" onPress={onReset}>
        Terminer la partie
      </Button>
    </ScrollView>
  );
}

function RevealLine({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.revealLine}>
      <Text selectable style={styles.revealLabel}>
        {label}
      </Text>
      <Text selectable style={[styles.revealValue, emphasis && styles.revealValueEmphasis]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  resultHero: { paddingVertical: spacing.xl, alignItems: "center" },
  resultKicker: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  resultTitle: {
    color: colors.ink,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    textAlign: "center",
  },
  resultDescription: { color: colors.ink, fontSize: 16, lineHeight: 23, textAlign: "center" },
  revealLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  revealLabel: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: "600" },
  revealValue: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    textAlign: "right",
  },
  revealValueEmphasis: { color: colors.primary, fontSize: 25, lineHeight: 30, fontWeight: "900" },
  divider: { height: 1, backgroundColor: colors.line },
  scoreTitle: { color: colors.ink, fontSize: 20, lineHeight: 25, fontWeight: "900" },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  scoreName: { flex: 1, color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "700" },
  scoreValue: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
});
