import { Link } from "expo-router";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";

type LegalPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text selectable style={styles.kicker}>
          GUESSIT
        </Text>
        <Text selectable style={styles.title}>
          {title}
        </Text>
        <Text selectable style={styles.intro}>
          {intro}
        </Text>
      </View>
      <View style={styles.card}>{children}</View>
      <Link href="/" style={styles.backLink}>
        Retour à GuessIt
      </Link>
    </ScrollView>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text selectable style={styles.sectionTitle}>
        {title}
      </Text>
      <Text selectable style={styles.body}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },
  intro: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.dark,
    borderRadius: radii.large,
    borderWidth: 2,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 23,
  },
  backLink: {
    alignSelf: "center",
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
