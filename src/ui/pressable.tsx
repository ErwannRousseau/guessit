import {
  Pressable as NativePressable,
  type PressableProps as NativePressableProps,
} from "react-native";

import { triggerHaptic, type HapticFeedback } from "@/lib/haptics";

export type { HapticFeedback } from "@/lib/haptics";
export type PressableProps = NativePressableProps & {
  haptic?: HapticFeedback;
};

export function Pressable({ haptic, onPress, ...props }: PressableProps) {
  return (
    <NativePressable
      {...props}
      onPress={(event) => {
        onPress?.(event);
        triggerHaptic(haptic);
      }}
    />
  );
}
