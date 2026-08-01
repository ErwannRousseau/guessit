import { useWindowDimensions } from "react-native";

export function useScreenSize() {
  const { width } = useWindowDimensions();

  return {
    isSmall: width > 0 && width < 760,
  };
}
