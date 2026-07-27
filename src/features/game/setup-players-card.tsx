import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Pressable } from "@/ui/pressable";

import { MAX_PLAYERS, MIN_PLAYERS } from "./game-state";
import type { GameState } from "./game.types";

export function SetupPlayersCard({
  game,
  onAddPlayer,
  onPlayerNameChange,
  onRemovePlayer,
}: {
  game: GameState;
  onAddPlayer: () => void;
  onPlayerNameChange: (index: number, value: string) => void;
  onRemovePlayer: (index: number) => void;
}) {
  const playerRemovalDisabled = game.playerCount <= MIN_PLAYERS;

  return (
    <Card>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionNumber}>
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
              onChangeText={(value) => onPlayerNameChange(index, value)}
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
        onPress={onAddPlayer}
      >
        Ajouter un joueur
      </Button>
    </Card>
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
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  controlDisabled: { opacity: 0.35 },
});
