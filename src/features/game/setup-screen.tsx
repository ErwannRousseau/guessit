import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import type { CategoryId, GameState } from "./game.types";
import { CategoryChoiceCard, DurationChoiceCard } from "./setup-choice-card";
import { SetupPlayersCard } from "./setup-players-card";

type SetupScreenProps = {
  game: GameState;
  onPlayerCountChange: (count: number) => void;
  onPlayerNameChange: (index: number, value: string) => void;
  onCategoryChange: (category: CategoryId) => void;
  onDurationChange: (seconds: number) => void;
  onStart: () => void;
};

export function SetupScreen({
  game,
  onPlayerCountChange,
  onPlayerNameChange,
  onCategoryChange,
  onDurationChange,
  onStart,
}: SetupScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.hero}>
        <View style={styles.logoMark}>
          <Text style={styles.logoQuestion}>?</Text>
          <View style={styles.logoDot} />
        </View>
        <View style={styles.heroCopy}>
          <Text selectable style={styles.eyebrow}>
            JEU DE MOTS & DÉDUCTION
          </Text>
          <Text selectable style={styles.title}>
            Mot Masqué
          </Text>
          <Text selectable style={styles.subtitle}>
            Aidez le groupe à trouver le mot… sans révéler qui est le complice.
          </Text>
        </View>
      </View>

      <SetupPlayersCard
        game={game}
        onPlayerCountChange={onPlayerCountChange}
        onPlayerNameChange={onPlayerNameChange}
      />
      <CategoryChoiceCard value={game.categoryId} onChange={onCategoryChange} />
      <DurationChoiceCard value={game.durationSeconds} onChange={onDurationChange} />

      <Card tone="accent">
        <Text selectable style={styles.rulesTitle}>
          Comment jouer ?
        </Text>
        <RuleLine number="1" text="Le Maître du jeu et le Complice voient le mot." />
        <RuleLine number="2" text="Les autres posent uniquement des questions fermées." />
        <RuleLine
          number="3"
          text="Le Complice guide discrètement le groupe sans se faire repérer."
        />
      </Card>
      <Button onPress={onStart}>Distribuer les rôles</Button>
      <Text selectable style={styles.legalNote}>
        Jeu original indépendant, inspiré des mécaniques classiques de mots cachés et de déduction
        sociale.
      </Text>
    </ScrollView>
  );
}

function RuleLine({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.ruleLine}>
      <View style={styles.ruleNumber}>
        <Text style={styles.ruleNumberText}>{number}</Text>
      </View>
      <Text selectable style={styles.ruleText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroCopy: { flex: 1, gap: spacing.xs },
  logoMark: {
    width: 74,
    height: 74,
    borderRadius: 25,
    borderCurve: "continuous",
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-4deg" }],
  },
  logoQuestion: { color: colors.accent, fontSize: 42, fontWeight: "900", lineHeight: 48 },
  logoDot: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: { color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23 },
  rulesTitle: { color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "900" },
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
  legalNote: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
});
