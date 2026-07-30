import { Alert } from "react-native";

import { isWeb } from "@/lib/platform";

type ConfirmActionOptions = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelable?: boolean;
};

export function confirmAction({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  cancelable = true,
}: ConfirmActionOptions) {
  if (isWeb()) {
    if (globalThis.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    } else {
      onCancel?.();
    }
    return;
  }

  Alert.alert(
    title,
    message,
    [
      { text: cancelText, style: "cancel", onPress: onCancel },
      { text: confirmText, style: "destructive", onPress: onConfirm },
    ],
    { cancelable },
  );
}
