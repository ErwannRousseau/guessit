import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "GuessIt : Le Complice",
  slug: "guessit",
  owner: "erwannrousseau",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "guessit",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.erwannrousseau.guessit",
    icon: "./assets/app-icon.icon",
    infoPlist: {
      CFBundleDevelopmentRegion: "fr",
      CFBundleLocalizations: ["fr"],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.erwannrousseau.guessit",
    blockedPermissions: [
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.SYSTEM_ALERT_WINDOW",
    ],
    adaptiveIcon: {
      backgroundColor: "#17162B",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFF7E8",
        image: "./assets/images/splash-lockup.png",
        imageWidth: 320,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "b7d9f890-e856-40bf-a006-b94210e1b6c0",
    },
  },
};

export default config;
