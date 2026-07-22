import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Card } from "@/ui/card";

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
      <SectionTitle number="2" title="Choisissez les mots" />
      <View style={styles.chipWrap}>
        {categories.map((category) => (
          <ChoiceChip
            key={category}
            label={categoryLabels[category]}
            selected={value === category}
            onPress={() => onChange(category)}
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
      <SectionTitle number="3" title="Durée de la manche" />
      <View style={styles.durationRow}>
        {durations.map((duration) => (
          <ChoiceChip
            key={duration}
            label={`${duration / 60} min`}
            selected={value === duration}
            onPress={() => onChange(duration)}
            grow
          />
        ))}
      </View>
    </Card>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionNumber}>
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
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  grow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        grow && styles.chipGrow,
        selected && styles.chipSelected,
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
    borderRadius: 15,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "800" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  durationRow: { flexDirection: "row", gap: spacing.sm },
  chip: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  chipGrow: { flex: 1 },
  chipSelected: { backgroundColor: colors.dark, borderColor: colors.dark },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  chipTextSelected: { color: colors.white },
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
