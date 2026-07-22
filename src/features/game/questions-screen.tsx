import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import { formatTime } from "./game-engine";
import type { Player, Round } from "./game.types";

export function ReadyScreen({
  players,
  round,
  roundNumber,
  onStart,
}: {
  players: Player[];
  round: Round;
  roundNumber: number;
  onStart: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <Text selectable style={styles.eyebrow}>
        MANCHE {roundNumber}
      </Text>
      <Text selectable style={styles.centerTitle}>
        Tout le monde est prêt ?
      </Text>
      <Text selectable style={styles.centerSubtitle}>
        Posez des questions auxquelles le Maître du jeu peut répondre par oui, non ou je ne sais
        pas.
      </Text>
      <Card tone="dark" style={styles.hostCard}>
        <Text selectable style={styles.hostLabel}>
          MAÎTRE DU JEU
        </Text>
        <Text selectable style={styles.hostName}>
          {players[round.masterIndex].name}
        </Text>
        <Text selectable style={styles.hostHint}>
          Garde le mot secret et lance le chrono.
        </Text>
      </Card>
      <Card>
        <RuleLine text="Une seule question à la fois" />
        <RuleLine text="Aucun geste, mime ou indice direct" />
        <RuleLine text="Quand le mot est trouvé, arrêtez le chrono" />
      </Card>
      <Button onPress={onStart}>Lancer la manche</Button>
    </ScrollView>
  );
}

export function QuestionsScreen({
  players,
  round,
  onToggleTimer,
  onWordFound,
  onGiveUp,
}: {
  players: Player[];
  round: Round;
  onToggleTimer: () => void;
  onWordFound: () => void;
  onGiveUp: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <View style={styles.timerTopRow}>
        <View>
          <Text selectable style={styles.eyebrow}>
            QUESTIONS EN COURS
          </Text>
          <Text selectable style={styles.timerHost}>
            Maître : {players[round.masterIndex].name}
          </Text>
        </View>
        <View style={[styles.liveDot, !round.timerRunning && styles.pausedDot]} />
      </View>
      <View style={styles.timerRing}>
        <Text selectable style={styles.timerText}>
          {formatTime(round.remainingSeconds)}
        </Text>
        <Text selectable style={styles.timerStatus}>
          {round.timerRunning ? "TEMPS RESTANT" : "EN PAUSE"}
        </Text>
      </View>
      <Card tone="accent">
        <Text selectable style={styles.questionReminder}>
          « Est-ce que ça se mange ? »{`\n`}« Est-ce plus grand qu’une voiture ? »
        </Text>
        <Text selectable style={styles.questionHint}>
          Le Complice connaît la réponse. Observez qui pose les questions les plus utiles.
        </Text>
      </Card>
      <Button variant="secondary" onPress={onToggleTimer}>
        {round.timerRunning ? "Mettre en pause" : "Reprendre le chrono"}
      </Button>
      <Button onPress={onWordFound}>Le mot a été trouvé</Button>
      <Button variant="ghost" onPress={onGiveUp}>
        Temps écoulé / abandonner
      </Button>
    </ScrollView>
  );
}

function RuleLine({ text }: { text: string }) {
  return (
    <View style={styles.ruleLine}>
      <View style={styles.ruleNumber}>
        <Text style={styles.ruleNumberText}>✓</Text>
      </View>
      <Text selectable style={styles.ruleText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  centeredContent: { flexGrow: 1, justifyContent: "center", alignItems: "stretch" },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  centerTitle: {
    color: colors.ink,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.8,
  },
  centerSubtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    paddingHorizontal: spacing.sm,
  },
  hostCard: { alignItems: "center", paddingVertical: spacing.xl },
  hostLabel: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  hostName: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    textAlign: "center",
  },
  hostHint: { color: "#C7CFDD", fontSize: 14, lineHeight: 20, textAlign: "center" },
  ruleLine: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  ruleNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(23, 32, 51, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  ruleNumberText: { color: colors.ink, fontSize: 12, fontWeight: "900" },
  ruleText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: "600" },
  timerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  timerHost: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: "700", paddingTop: 3 },
  liveDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.success },
  pausedDot: { backgroundColor: colors.accent },
  timerRing: {
    width: 246,
    height: 246,
    alignSelf: "center",
    borderRadius: 123,
    backgroundColor: colors.dark,
    borderWidth: 10,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  timerText: {
    color: colors.white,
    fontSize: 61,
    lineHeight: 67,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    letterSpacing: -2,
  },
  timerStatus: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  questionReminder: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  questionHint: { color: colors.ink, fontSize: 14, lineHeight: 20, textAlign: "center" },
});
