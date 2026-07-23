import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";

import type { Player, Round } from "./game.types";

export function VotePhase({
  players,
  round,
  onSelect,
  onReveal,
}: {
  players: Player[];
  round: Round;
  onSelect: (index: number) => void;
  onReveal: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.voteHeader}>
        <Text selectable style={styles.eyebrow}>
          LE MOT A ÉTÉ TROUVÉ
        </Text>
        <Text selectable style={styles.title}>
          Qui est le Complice ?
        </Text>
        <Text selectable style={styles.subtitle}>
          Débattez ensemble, puis désignez une seule personne. Le Maître du jeu ne peut pas être
          suspecté.
        </Text>
      </View>
      <View style={styles.suspectGrid}>
        {players.map((player, index) => {
          const isMaster = index === round.masterIndex;
          const selected = round.suspectedIndex === index;
          return (
            <Pressable
              key={player.id}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: isMaster }}
              disabled={isMaster}
              onPress={() => onSelect(index)}
              style={({ pressed }) => [
                styles.suspectCard,
                selected && styles.suspectCardSelected,
                isMaster && styles.suspectCardDisabled,
                pressed && !isMaster && styles.controlPressed,
              ]}
            >
              <View style={[styles.avatar, selected && styles.avatarSelected]}>
                <Text style={[styles.avatarText, selected && styles.avatarTextSelected]}>
                  {player.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <Text selectable numberOfLines={1} style={styles.suspectName}>
                {player.name}
              </Text>
              <Text selectable style={styles.suspectMeta}>
                {isMaster ? "Maître du jeu" : selected ? "Votre choix" : "Suspect"}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Button disabled={round.suspectedIndex === null} onPress={onReveal}>
        Révéler le Complice
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  voteHeader: { gap: spacing.sm, paddingVertical: spacing.sm },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: { color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23 },
  suspectGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  suspectCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 135,
    padding: spacing.md,
    borderRadius: radii.medium,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.xs,
  },
  suspectCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  suspectCardDisabled: { opacity: 0.43 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSelected: { backgroundColor: colors.primary },
  avatarText: { color: colors.ink, fontSize: 21, lineHeight: 25, fontWeight: "900" },
  avatarTextSelected: { color: colors.white },
  suspectName: {
    maxWidth: 120,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  suspectMeta: { color: colors.muted, fontSize: 12, lineHeight: 16, fontWeight: "600" },
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
