import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Card } from "@/ui/card";

import { MAX_PLAYERS, MIN_PLAYERS } from "./game-state";
import type { GameState } from "./game.types";

export function SetupPlayersCard({
  game,
  onPlayerCountChange,
  onPlayerNameChange,
}: {
  game: GameState;
  onPlayerCountChange: (count: number) => void;
  onPlayerNameChange: (index: number, value: string) => void;
}) {
  return (
    <Card>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionNumber}>
          <Text style={styles.sectionNumberText}>1</Text>
        </View>
        <Text selectable style={styles.sectionTitle}>
          Combien de joueurs ?
        </Text>
      </View>
      <View style={styles.stepperRow}>
        <PlayerCountButton
          label="Retirer un joueur"
          symbol="−"
          disabled={game.playerCount <= MIN_PLAYERS}
          onPress={() => onPlayerCountChange(game.playerCount - 1)}
        />
        <View style={styles.playerCountBlock}>
          <Text selectable style={styles.playerCount}>
            {game.playerCount}
          </Text>
          <Text selectable style={styles.playerCountLabel}>
            joueurs
          </Text>
        </View>
        <PlayerCountButton
          label="Ajouter un joueur"
          symbol="+"
          disabled={game.playerCount >= MAX_PLAYERS}
          onPress={() => onPlayerCountChange(game.playerCount + 1)}
        />
      </View>
      <View style={styles.namesGrid}>
        {game.players.map((player, index) => (
          <TextInput
            key={player.id}
            accessibilityLabel={`Nom du joueur ${index + 1}`}
            value={player.name}
            onChangeText={(value) => onPlayerNameChange(index, value)}
            maxLength={18}
            selectTextOnFocus
            returnKeyType="done"
            style={styles.nameInput}
          />
        ))}
      </View>
    </Card>
  );
}

function PlayerCountButton({
  label,
  symbol,
  disabled,
  onPress,
}: {
  label: string;
  symbol: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepperButton,
        pressed && styles.controlPressed,
        disabled && styles.controlDisabled,
      ]}
    >
      <Text style={styles.stepperSymbol}>{symbol}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderCurve: "continuous",
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberText: { color: colors.ink, fontSize: 14, fontWeight: "900" },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "800" },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: colors.violet,
    borderWidth: 2,
    borderColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperSymbol: { color: colors.ink, fontSize: 29, lineHeight: 32, fontWeight: "500" },
  playerCountBlock: { minWidth: 84, alignItems: "center" },
  playerCount: {
    color: colors.ink,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  playerCountLabel: { color: colors.muted, fontSize: 13, lineHeight: 17, fontWeight: "600" },
  namesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  nameInput: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 130,
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
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  controlDisabled: { opacity: 0.35 },
});
