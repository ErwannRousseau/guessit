import * as Haptics from "expo-haptics";

import { isWeb } from "@/lib/platform";

export type HapticFeedback = "selection" | "light" | "medium" | "success" | "warning";

export function triggerHaptic(feedback?: HapticFeedback) {
  if (!feedback || isWeb()) {
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
