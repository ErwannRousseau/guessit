import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export type HapticFeedback = "selection" | "light" | "medium" | "success" | "warning";

export function triggerHaptic(feedback?: HapticFeedback) {
  if (!feedback || Platform.OS === "web") {
    return;
  }

  const effect = {
    selection: () => Haptics.selectionAsync(),
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  }[feedback];

  void effect().catch(() => undefined);
}
