import { Platform } from "react-native";

export function isIOS(platform: string = Platform.OS) {
  return platform.toLowerCase() === "ios";
}

export function isWeb() {
  return Platform.OS === "web";
}
