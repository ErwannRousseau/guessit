import type { ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";

type CardProps = ViewProps & {
  children: ReactNode;
  tone?: "default" | "accent" | "success" | "danger" | "dark";
};

export function Card({ children, tone = "default", style, ...props }: CardProps) {
  return (
    <View style={[styles.base, toneStyles[tone], style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.lg,
    borderRadius: radii.large,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md,
  },
});

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface,
  },
  accent: {
    backgroundColor: colors.accentSoft,
    borderColor: "#E7CB87",
  },
  success: {
    backgroundColor: colors.successSoft,
    borderColor: "#B7D6C7",
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: "#E5B9B4",
  },
  dark: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
});
