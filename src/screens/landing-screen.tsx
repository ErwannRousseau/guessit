import { Link } from "expo-router";
import Head from "expo-router/head";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radii, spacing } from "@/constants/theme";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Button } from "@/ui/button";
import { Pressable } from "@/ui/pressable";

const appIcon = require("../../assets/images/icon.png");
const splashLockup = require("../../assets/images/splash-lockup.png");

export function LandingScreen() {
  const { isSmall } = useScreenSize();

  return (
    <>
      <Head>
        <title>GuessIt : Le Complice</title>
        <meta
          name="description"
          content="Un jeu de mots, de bluff et de déduction à partager sur un seul téléphone."
        />
      </Head>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.page, !isSmall && styles.pageWide]}>
            <View style={[styles.hero, !isSmall && styles.heroWide]}>
              <View style={styles.logoCard}>
                <Image
                  accessibilityLabel="GuessIt"
                  resizeMode="contain"
                  source={splashLockup}
                  style={styles.logo}
                />
              </View>

              <View style={styles.copy}>
                <Text accessibilityRole="header" style={styles.title}>
                  Devinez le mot. Démasquez le Complice.
                </Text>
                <Text selectable style={styles.subtitle}>
                  Un jeu de mots, de bluff et de déduction à partager sur un seul téléphone.
                </Text>
              </View>
            </View>

            <View style={[styles.actions, !isSmall && styles.actionsWide]}>
              <Text style={styles.actionsLabel}>CHOISISSEZ VOTRE VERSION</Text>

              <View style={[styles.storeList, !isSmall && styles.storeListWide]}>
                <StoreCard platform="iPhone" />
                <StoreCard platform="Android" />
              </View>

              <Link href="/play" asChild>
                <Button variant="secondary">Jouer sur le web</Button>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function StoreCard({ platform }: { platform: "iPhone" | "Android" }) {
  return (
    <Pressable
      accessibilityLabel={`Version ${platform}, bientôt disponible`}
      accessibilityRole="button"
      accessibilityState={{ disabled: true }}
      disabled
      style={styles.storeCard}
    >
      <Image source={appIcon} style={styles.storeIcon} />
      <View style={styles.storeCopy}>
        <Text style={styles.storePlatform}>Version {platform}</Text>
        <Text style={styles.storeStatus}>Bientôt disponible</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  page: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    gap: spacing.xl,
  },
  pageWide: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxl,
  },
  hero: {
    gap: spacing.lg,
  },
  heroWide: {
    flex: 1,
    maxWidth: 560,
  },
  logoCard: {
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: radii.large,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.surfaceStrong,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -1.2,
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    textAlign: "center",
  },
  actions: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    gap: spacing.md,
  },
  actionsWide: {
    flex: 1,
  },
  actionsLabel: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    letterSpacing: 1.4,
    textAlign: "center",
  },
  storeList: {
    gap: spacing.md,
  },
  storeListWide: {
    flexDirection: "row",
  },
  storeCard: {
    flex: 1,
    minHeight: 116,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.medium,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.accentSoft,
    opacity: 0.68,
  },
  storeIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.small,
    borderCurve: "continuous",
  },
  storeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  storePlatform: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  storeStatus: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
});
