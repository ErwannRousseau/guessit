import { GameScreen } from "@/screens/game-screen";
import { LandingScreen } from "@/screens/landing-screen";
import { isWeb } from "@/lib/platform";

export default function HomeScreen() {
  return isWeb() ? <LandingScreen /> : <GameScreen />;
}
