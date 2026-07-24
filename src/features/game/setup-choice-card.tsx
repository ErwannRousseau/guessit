import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Card } from "@/ui/card";
import { Pressable } from "@/ui/pressable";

import type { CategoryId } from "./game.types";
import { categoryLabels } from "./words";

const categories: CategoryId[] = ["mix", "objects", "animals", "food", "places", "jobs", "leisure"];
const durations = [180, 300, 420] as const;

export function CategoryChoiceCard({
  value,
  onChange,
}: {
  value: CategoryId;
  onChange: (value: CategoryId) => void;
}) {
  return (
    <Card>
      <SectionTitle number="2" title="Choisissez les mots" tone="violet" />
      <View style={styles.chipWrap}>
        {categories.map((category) => (
          <ChoiceChip
            key={category}
            label={categoryLabels[category]}
            selected={value === category}
            onPress={() => onChange(category)}
            selectedTone="accent"
          />
        ))}
      </View>
    </Card>
  );
}

export function DurationChoiceCard({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Card>
      <SectionTitle number="3" title="Durée de la manche" tone="primary" />
      <View style={styles.durationRow}>
        {durations.map((duration) => (
          <ChoiceChip
            key={duration}
            label={`${duration / 60} min`}
            selected={value === duration}
            onPress={() => onChange(duration)}
            grow
            selectedTone="violet"
          />
        ))}
      </View>
    </Card>
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

const styles = StyleSheet.create({
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
  sectionNumberPrimary: { backgroundColor: colors.primary },
  sectionNumberViolet: { backgroundColor: colors.violet },
  sectionNumberText: { color: colors.ink, fontSize: 14, fontWeight: "900" },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "800" },
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
});
