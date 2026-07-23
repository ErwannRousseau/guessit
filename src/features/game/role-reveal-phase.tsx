import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import { getRole } from "./game-engine";
import type { Player, Role, Round } from "./game.types";

export function RoleRevealPhase({
  players,
  round,
  onShowRole,
  onHideAndContinue,
}: {
  players: Player[];
  round: Round;
  onShowRole: () => void;
  onHideAndContinue: () => void;
}) {
  const player = players[round.revealIndex];
  const role = getRole(round, round.revealIndex);
  const isLastPlayer = round.revealIndex === players.length - 1;

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <ProgressDots current={round.revealIndex} total={players.length} />
      {!round.roleVisible ? (
        <>
          <View style={styles.secretIcon}>
            <Text style={styles.secretIconText}>•••</Text>
          </View>
          <Text selectable style={styles.eyebrow}>
            PASSE LE TÉLÉPHONE
          </Text>
          <Text selectable style={styles.centerTitle}>
            {player.name}
          </Text>
          <Text selectable style={styles.centerSubtitle}>
            Vérifie que personne ne regarde l’écran, puis découvre ton rôle.
          </Text>
          <Button onPress={onShowRole}>Voir mon rôle</Button>
        </>
      ) : (
        <RoleCard role={role} word={round.word} playerName={player.name} />
      )}
      {round.roleVisible ? (
        <Button onPress={onHideAndContinue}>
          {isLastPlayer ? "J’ai mémorisé — continuer" : "J’ai mémorisé — joueur suivant"}
        </Button>
      ) : null}
    </ScrollView>
  );
}

function RoleCard({ role, word, playerName }: { role: Role; word: string; playerName: string }) {
  const content = {
    master: {
      badge: "MAÎTRE DU JEU",
      title: "Tu connais le mot",
      description: "Réponds seulement par oui, non ou je ne sais pas.",
      tone: "accent" as const,
    },
    insider: {
      badge: "COMPLICE",
      title: "Aide sans te trahir",
      description: "Oriente subtilement le groupe vers la réponse.",
      tone: "danger" as const,
    },
    detective: {
      badge: "ENQUÊTEUR",
      title: "Trouve le mot secret",
      description: "Pose des questions fermées et observe qui aide un peu trop.",
      tone: "success" as const,
    },
  }[role];

  return (
    <Card tone={content.tone} style={styles.roleCard}>
      <Text selectable style={styles.rolePlayer}>
        {playerName}
      </Text>
      <Text selectable style={styles.roleBadge}>
        {content.badge}
      </Text>
      <Text selectable style={styles.roleTitle}>
        {content.title}
      </Text>
      {role !== "detective" ? (
        <View style={styles.wordPanel}>
          <Text selectable style={styles.wordLabel}>
            LE MOT SECRET
          </Text>
          <Text selectable style={styles.word}>
            {word}
          </Text>
        </View>
      ) : (
        <View style={styles.hiddenWordPanel}>
          <Text selectable style={styles.hiddenWord}>
            ? ? ?
          </Text>
        </View>
      )}
      <Text selectable style={styles.roleDescription}>
        {content.description}
      </Text>
    </Card>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index < current && styles.progressDotDone,
            index === current && styles.progressDotCurrent,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  centeredContent: { flexGrow: 1, justifyContent: "center", alignItems: "stretch" },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    paddingBottom: spacing.md,
  },
  progressDot: { width: 18, height: 5, borderRadius: 3, backgroundColor: colors.line },
  progressDotDone: { backgroundColor: colors.success },
  progressDotCurrent: { width: 34, backgroundColor: colors.primary },
  secretIcon: {
    width: 92,
    height: 92,
    alignSelf: "center",
    borderRadius: 31,
    borderCurve: "continuous",
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  secretIconText: {
    color: colors.accent,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 3,
  },
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
  roleCard: { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.md },
  rolePlayer: { color: colors.muted, fontSize: 15, lineHeight: 20, fontWeight: "700" },
  roleBadge: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  roleTitle: {
    color: colors.ink,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  wordPanel: {
    alignSelf: "stretch",
    padding: spacing.lg,
    borderRadius: radii.medium,
    borderCurve: "continuous",
    backgroundColor: colors.surfaceStrong,
    alignItems: "center",
    gap: spacing.xs,
  },
  wordLabel: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  word: {
    color: colors.dark,
    fontSize: 35,
    lineHeight: 41,
    fontWeight: "900",
    textAlign: "center",
  },
  hiddenWordPanel: {
    alignSelf: "stretch",
    padding: spacing.lg,
    borderRadius: radii.medium,
    borderCurve: "continuous",
    backgroundColor: "rgba(255,255,255,0.58)",
    alignItems: "center",
  },
  hiddenWord: {
    color: colors.ink,
    fontSize: 33,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: 5,
  },
  roleDescription: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    textAlign: "center",
  },
});
