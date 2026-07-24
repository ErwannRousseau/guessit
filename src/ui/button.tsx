import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/constants/theme";
import { Pressable, type PressableProps } from "@/ui/pressable";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        state.pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variant === "ghost" ? colors.onDark : colors.ink} />
        ) : null}
        <Text style={[styles.label, labelStyles[variant]]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.small,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  label: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.violet,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: colors.primary,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: colors.ink,
  },
  secondary: {
    color: colors.ink,
  },
  ghost: {
    color: colors.muted,
  },
  danger: {
    color: colors.ink,
  },
});
