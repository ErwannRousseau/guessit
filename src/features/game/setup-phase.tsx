import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import type { CategoryId, GameState } from "./game.types";
import { CategoryChoiceCard, DurationChoiceCard } from "./setup-choice-card";
import { SetupPlayersCard } from "./setup-players-card";

type SetupPhaseProps = {
  game: GameState;
  onPlayerCountChange: (count: number) => void;
  onPlayerNameChange: (index: number, value: string) => void;
  onCategoryChange: (category: CategoryId) => void;
  onDurationChange: (seconds: number) => void;
  onStart: () => void;
};

export function SetupPhase({
  game,
  onPlayerCountChange,
  onPlayerNameChange,
  onCategoryChange,
  onDurationChange,
  onStart,
}: SetupPhaseProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <Image
            accessibilityIgnoresInvertColors
            source={require("../../../assets/images/logo-mark.png")}
            style={styles.logoMark}
          />
          <Text selectable style={styles.title}>
            GuessIt
          </Text>
        </View>
        <Text selectable style={styles.eyebrow}>
          JEU DE MOTS & DÉDUCTION
        </Text>
        <View style={styles.mantraRow}>
          <Text selectable style={[styles.mantra, styles.mantraLight]}>
            Devine.
          </Text>
          <Text selectable style={[styles.mantra, styles.mantraCoral]}>
            Doute.
          </Text>
          <Text selectable style={[styles.mantra, styles.mantraLime]}>
            Démasque.
          </Text>
        </View>
        <Text selectable style={styles.subtitle}>
          Trouvez le mot secret sans laisser le Complice brouiller les pistes.
        </Text>
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
      <View style={styles.legalLinks}>
        <Pressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL("https://guessit.erwannrousseau.dev/privacy")}
        >
          <Text selectable style={styles.legalLink}>
            Confidentialité
          </Text>
        </Pressable>
        <Text selectable style={styles.legalSeparator}>
          ·
        </Text>
        <Pressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL("https://guessit.erwannrousseau.dev/support")}
        >
          <Text selectable style={styles.legalLink}>
            Support
          </Text>
        </Pressable>
      </View>
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
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  logoMark: {
    width: 62,
    height: 62,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  title: {
    color: colors.ink,
    fontSize: 42,
    lineHeight: 47,
    fontWeight: "900",
    letterSpacing: -1.6,
  },
  mantraRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  mantra: { fontSize: 21, lineHeight: 27, fontWeight: "900", letterSpacing: -0.4 },
  mantraLight: { color: colors.ink },
  mantraCoral: { color: colors.primary },
  mantraLime: { color: colors.accent },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, maxWidth: 430 },
  rulesTitle: { color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "900" },
  ruleLine: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  ruleNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleNumberText: { color: colors.accent, fontSize: 12, fontWeight: "900" },
  ruleText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: "600" },
  legalNote: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  legalLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  legalSeparator: {
    color: colors.muted,
    fontSize: 13,
  },
});
