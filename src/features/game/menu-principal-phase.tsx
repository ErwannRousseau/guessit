import type { Dispatch } from "react";
import {
  Image,
  Linking,
  Pressable as NativePressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import type { GameAction } from "@/features/game/game-state";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/features/game/game-state";
import type { CategoryId, GameState } from "@/features/game/game.types";
import { categoryLabels } from "@/features/game/words";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Pressable } from "@/ui/pressable";

const categories: CategoryId[] = ["mix", "objects", "animals", "food", "places", "jobs", "leisure"];
const durations = [180, 300, 420] as const;

type MenuPrincipalPhaseProps = {
  game: GameState;
  dispatch: Dispatch<GameAction>;
  onRemovePlayer: (index: number) => void;
  onReset: () => void;
};

export function MenuPrincipalPhase({
  game,
  dispatch,
  onRemovePlayer,
  onReset,
}: MenuPrincipalPhaseProps) {
  const playerRemovalDisabled = game.playerCount <= MIN_PLAYERS;

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

      <Card>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionNumber, styles.sectionNumberPlayers]}>
            <Text style={styles.sectionNumberText}>1</Text>
          </View>
          <Text selectable style={styles.sectionTitle}>
            Joueurs
          </Text>
          <Text selectable style={styles.playerCountLabel}>
            {game.playerCount}/{MAX_PLAYERS}
          </Text>
        </View>
        <View style={styles.playersList}>
          {game.players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <TextInput
                accessibilityLabel={`Nom du joueur ${index + 1}`}
                value={player.name}
                onChangeText={(name) => dispatch({ type: "setPlayerName", index, name })}
                maxLength={18}
                selectTextOnFocus
                returnKeyType="done"
                style={styles.nameInput}
              />
              <Text selectable style={styles.playerScore}>
                {player.score} pt{Math.abs(player.score) === 1 ? "" : "s"}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Retirer ${player.name}`}
                disabled={playerRemovalDisabled}
                haptic="warning"
                onPress={() => onRemovePlayer(index)}
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.controlPressed,
                  playerRemovalDisabled && styles.controlDisabled,
                ]}
              >
                <Text style={styles.removeSymbol}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Button
          disabled={game.playerCount >= MAX_PLAYERS}
          haptic="selection"
          variant="secondary"
          onPress={() => dispatch({ type: "addPlayer" })}
        >
          Ajouter un joueur
        </Button>
      </Card>

      <Card>
        <SectionTitle number="2" title="Choisissez les mots" tone="violet" />
        <View style={styles.chipWrap}>
          {categories.map((category) => (
            <ChoiceChip
              key={category}
              label={categoryLabels[category]}
              selected={game.categoryId === category}
              onPress={() => dispatch({ type: "setCategory", categoryId: category })}
              selectedTone="accent"
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle number="3" title="Durée de la manche" tone="primary" />
        <View style={styles.durationRow}>
          {durations.map((duration) => (
            <ChoiceChip
              key={duration}
              label={`${duration / 60} min`}
              selected={game.durationSeconds === duration}
              onPress={() => dispatch({ type: "setDuration", seconds: duration })}
              grow
              selectedTone="violet"
            />
          ))}
        </View>
      </Card>

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
      <Button haptic="light" onPress={() => dispatch({ type: "startRound" })}>
        Distribuer les rôles
      </Button>
      <Button variant="ghost" onPress={onReset}>
        Nouvelle partie
      </Button>
      <Text selectable style={styles.legalNote}>
        Jeu original indépendant, inspiré des mécaniques classiques de mots cachés et de déduction
        sociale.
      </Text>
      <View style={styles.legalLinks}>
        <NativePressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL("https://guessit.erwannrousseau.dev/privacy")}
        >
          <Text selectable style={styles.legalLink}>
            Confidentialité
          </Text>
        </NativePressable>
        <Text selectable style={styles.legalSeparator}>
          ·
        </Text>
        <NativePressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL("https://guessit.erwannrousseau.dev/support")}
        >
          <Text selectable style={styles.legalLink}>
            Support
          </Text>
        </NativePressable>
      </View>
    </ScrollView>
  );
}

function SectionTitle({
  number,
  title,
  tone,
}: {
  number: string;
  title: string;
  tone: "primary" | "violet";
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View
        style={[
          styles.sectionNumber,
          tone === "primary" ? styles.sectionNumberPrimary : styles.sectionNumberViolet,
        ]}
      >
        <Text style={styles.sectionNumberText}>{number}</Text>
      </View>
      <Text selectable style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
  grow = false,
  selectedTone,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  grow?: boolean;
  selectedTone: "accent" | "violet";
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      haptic={selected ? undefined : "selection"}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        grow && styles.chipGrow,
        selected &&
          (selectedTone === "accent" ? styles.chipSelectedAccent : styles.chipSelectedViolet),
        pressed && styles.controlPressed,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
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
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberPlayers: { backgroundColor: colors.accent },
  sectionNumberPrimary: { backgroundColor: colors.primary },
  sectionNumberViolet: { backgroundColor: colors.violet },
  sectionNumberText: { color: colors.ink, fontSize: 14, fontWeight: "900" },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "800" },
  playerCountLabel: { color: colors.muted, fontSize: 14, lineHeight: 18, fontWeight: "800" },
  playersList: { gap: spacing.sm },
  playerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  nameInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.small,
    borderCurve: "continuous",
    backgroundColor: colors.surfaceStrong,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  playerScore: {
    minWidth: 50,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  removeButton: {
    width: 46,
    height: 46,
    borderRadius: radii.small,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  removeSymbol: { color: colors.danger, fontSize: 27, lineHeight: 30, fontWeight: "700" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  durationRow: { flexDirection: "row", gap: spacing.sm },
  chip: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.small,
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  chipGrow: { flex: 1 },
  chipSelectedAccent: { backgroundColor: colors.accent },
  chipSelectedViolet: { backgroundColor: colors.violet },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  chipTextSelected: { color: colors.ink },
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  controlDisabled: { opacity: 0.35 },
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
