import { Image } from "expo-image";
import { Link } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radii, spacing } from "@/constants/theme";
import { Button } from "@/ui/button";
import { Pressable } from "@/ui/pressable";

const appIcon = require("../../assets/images/icon.png");
const appStoreUrl = "https://apps.apple.com/fr/app/guessit-le-complice/id6794387024?l=en-GB";
const heroScreenshot = require("../../store-assets/apple/iphone/1320x2868/fr-FR/04-device-top.png");
const gameplayScreenshots = [
  {
    source: require("../../store-assets/apple/iphone/1320x2868/fr-FR/01-hero.png"),
    label: "Configurez votre partie",
  },
  {
    source: require("../../store-assets/apple/iphone/1320x2868/fr-FR/02-device-bottom.png"),
    label: "Découvrez votre rôle",
  },
  {
    source: require("../../store-assets/apple/iphone/1320x2868/fr-FR/06-device-bottom.png"),
    label: "Révélez le Complice",
  },
];

const gameFacts = ["👥 4–10 joueurs", "⏱ 3–7 min", "📱 Un seul téléphone", "🌐 Dans le navigateur"];

const wideLayoutStyles = `
  @media (min-width: 760px) {
    #landing-hero { min-height: 620px; flex-direction: row; align-items: center; gap: 56px; }
    #landing-hero-copy { flex: 1.08; }
    #landing-title { font-size: 62px; line-height: 62px; letter-spacing: -2.8px; }
    #landing-subtitle { font-size: 20px; line-height: 30px; }
    #landing-store-list { flex-direction: row; }
    #landing-hero-action { max-width: 330px; }
    #landing-hero-visual { flex: 0.85; height: 610px; }
    #landing-steps, #landing-gameplay, #landing-reasons { flex-direction: row; }
    #landing-step-1, #landing-step-2, #landing-step-3, #landing-step-4,
    #landing-gameplay-1, #landing-gameplay-2, #landing-gameplay-3,
    #landing-reason-1, #landing-reason-2, #landing-reason-3 { flex: 1; }
    #landing-faq { flex-direction: row; align-items: flex-start; }
    #landing-final { flex-direction: row; align-items: center; justify-content: space-between; padding: ${spacing.xxl}px; }
  }
`;

const steps = [
  {
    number: "1",
    title: "Passez le téléphone",
    copy: "Chacun découvre secrètement son rôle.",
  },
  {
    number: "2",
    title: "Posez vos questions",
    copy: "Trouvez le mot avec des questions fermées.",
  },
  {
    number: "3",
    title: "Brouillez les pistes",
    copy: "Le Complice connaît la réponse et reste discret.",
  },
  {
    number: "4",
    title: "Votez",
    copy: "Démasquez le Complice avant la fin du chrono.",
  },
];

const funReasons = [
  {
    title: "Zéro préparation",
    copy: "Ajoutez les prénoms et lancez la première manche.",
  },
  {
    title: "Tout le monde joue",
    copy: "Une règle simple, des rôles secrets et aucun temps mort.",
  },
  {
    title: "Jamais la même partie",
    copy: "Les questions, les bluffs et les soupçons changent à chaque mot.",
  },
];

const faqs = [
  {
    question: "Combien de personnes peuvent jouer ?",
    answer: "De 4 à 10 joueurs autour d’un seul téléphone.",
  },
  {
    question: "Peut-on jouer sans installer l’application ?",
    answer:
      "Oui. La version web reste disponible, et l’application iOS est maintenant disponible sur l’App Store.",
  },
  {
    question: "Combien de temps dure une manche ?",
    answer: "Choisissez un chrono de 3, 5 ou 7 minutes.",
  },
];

export function LandingScreen() {
  return (
    <>
      <Head>
        <title>GuessIt : Le Complice</title>
        <meta
          name="description"
          content="Découvrez GuessIt, le jeu de bluff et de déduction pour vos soirées, sur iOS, Android et web."
        />
        <style>{wideLayoutStyles}</style>
      </Head>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.page}>
            <View accessibilityLabel="GuessIt" style={styles.brand}>
              <Image source={appIcon} style={styles.brandIcon} />
              <Text style={styles.brandName}>GuessIt</Text>
            </View>

            <View nativeID="landing-hero" style={styles.hero}>
              <View nativeID="landing-hero-copy" style={styles.heroCopy}>
                <Text style={styles.eyebrow}>BLUFF, DÉDUCTION & FOUS RIRES</Text>
                <Text accessibilityRole="header" nativeID="landing-title" style={styles.title}>
                  Le Complice se cache autour de la table.
                </Text>
                <Text nativeID="landing-subtitle" selectable style={styles.subtitle}>
                  Un téléphone passe de main en main. Tout le monde cherche le mot secret. Une seule
                  personne brouille les pistes.
                </Text>
                <Text style={styles.socialProof}>
                  Le jeu parfait pour lancer une soirée en 30 secondes.
                </Text>

                <View style={styles.downloads}>
                  <Text style={styles.downloadsLabel}>TÉLÉCHARGER L’APPLICATION</Text>
                  <View nativeID="landing-store-list" style={styles.storeList}>
                    <StoreDownloadCard platform="iOS" />
                    <StoreDownloadCard platform="Android" />
                  </View>
                </View>

                <View nativeID="landing-hero-action" style={styles.heroAction}>
                  <Link href="/play" asChild>
                    <Button variant="secondary">Jouer sur le web</Button>
                  </Link>
                  <Text style={styles.actionNote}>Disponible maintenant · sans installation</Text>
                </View>

                <View style={styles.factList}>
                  {gameFacts.map((fact) => (
                    <View key={fact} style={styles.fact}>
                      <Text style={styles.factText}>{fact}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View nativeID="landing-hero-visual" style={styles.heroVisual}>
                <View style={styles.heroAccent} />
                <Image
                  accessibilityLabel="Écran de jeu montrant le chrono d’une manche"
                  resizeMode="cover"
                  source={heroScreenshot}
                  style={styles.heroImage}
                />
              </View>
            </View>

            <SectionHeader
              eyebrow="COMMENT ÇA MARCHE"
              title="Une partie comprise en moins de 15 secondes."
            />
            <View nativeID="landing-steps" style={styles.grid}>
              {steps.map((step, index) => (
                <View
                  key={step.number}
                  nativeID={`landing-step-${index + 1}`}
                  style={styles.stepCard}
                >
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{step.title}</Text>
                  <Text style={styles.cardCopy}>{step.copy}</Text>
                </View>
              ))}
            </View>

            <SectionHeader
              eyebrow="DANS LE JEU"
              title="Voyez la partie avant de jouer."
              copy="Des rôles secrets au vote final, tout se joue sur une interface simple à faire circuler."
            />
            <View nativeID="landing-gameplay" style={styles.grid}>
              {gameplayScreenshots.map((screenshot, index) => (
                <View
                  key={screenshot.label}
                  nativeID={`landing-gameplay-${index + 1}`}
                  style={styles.screenshotCard}
                >
                  <Image
                    accessibilityLabel={screenshot.label}
                    resizeMode="cover"
                    source={screenshot.source}
                    style={styles.screenshot}
                  />
                  <Text style={styles.screenshotLabel}>{screenshot.label}</Text>
                </View>
              ))}
            </View>

            <SectionHeader
              eyebrow="POURQUOI ÇA MARCHE"
              title="Quelques règles. Beaucoup de soupçons."
            />
            <View nativeID="landing-reasons" style={styles.grid}>
              {funReasons.map((reason, index) => (
                <View
                  key={reason.title}
                  nativeID={`landing-reason-${index + 1}`}
                  style={styles.funCard}
                >
                  <Text style={styles.cardTitle}>{reason.title}</Text>
                  <Text style={styles.cardCopy}>{reason.copy}</Text>
                </View>
              ))}
            </View>

            <View nativeID="landing-faq" style={styles.faqSection}>
              <SectionHeader eyebrow="FAQ" title="Avant de passer le téléphone." />
              <View style={styles.faqList}>
                {faqs.map((faq) => (
                  <View key={faq.question} style={styles.faqCard}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.cardCopy}>{faq.answer}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View nativeID="landing-final" style={styles.finalCard}>
              <View style={styles.finalCopy}>
                <Text style={styles.finalEyebrow}>PRÊTS À BLUFFER ?</Text>
                <Text accessibilityRole="header" aria-level={2} style={styles.finalTitle}>
                  Qui sera le meilleur Complice ?
                </Text>
                <Text style={styles.finalSubtitle}>
                  Téléchargez GuessIt sur iOS ou lancez la version web maintenant.
                </Text>
              </View>
              <View style={styles.finalAction}>
                <View style={styles.storeList}>
                  <StoreDownloadCard platform="iOS" />
                  <StoreDownloadCard platform="Android" />
                </View>
                <Link href="/play" asChild>
                  <Button variant="secondary">Jouer sur le web</Button>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>
        {title}
      </Text>
      {copy ? <Text style={styles.sectionCopy}>{copy}</Text> : null}
    </View>
  );
}

function StoreDownloadCard({ platform }: { platform: "iOS" | "Android" }) {
  const isAvailable = platform === "iOS";
  const storeName = platform === "iOS" ? "l’App Store" : "Google Play";
  const cardStyle = StyleSheet.flatten([
    styles.storeCard,
    isAvailable ? styles.storeCardAvailable : styles.storeCardUnavailable,
  ]);
  const card = (
    <Pressable
      accessibilityLabel={
        isAvailable
          ? `Télécharger GuessIt sur ${storeName}`
          : `Téléchargement ${platform}, bientôt disponible`
      }
      accessibilityRole="button"
      accessibilityState={{ disabled: !isAvailable }}
      disabled={!isAvailable}
      style={cardStyle}
    >
      <Image source={appIcon} style={styles.storeIcon} />
      <View style={styles.storeCopy}>
        <View style={[styles.storeTag, platform === "Android" && styles.storeTagAndroid]}>
          <Text style={styles.storeTagText}>{platform}</Text>
        </View>
        <Text style={styles.storeTitle}>Télécharger sur {storeName}</Text>
        {isAvailable ? (
          <View style={styles.storeStatusBadge}>
            <Text style={styles.storeStatusAvailable}>Disponible maintenant</Text>
          </View>
        ) : (
          <Text style={styles.storeStatus}>Bientôt disponible</Text>
        )}
      </View>
    </Pressable>
  );

  return isAvailable ? (
    <Link href={appStoreUrl} asChild>
      {card}
    </Link>
  ) : (
    card
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  page: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    gap: 72,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.small,
  },
  brandName: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  hero: {
    gap: spacing.xl,
  },
  heroCopy: {
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  title: {
    maxWidth: 640,
    color: colors.ink,
    fontSize: 44,
    lineHeight: 47,
    fontWeight: "900",
    letterSpacing: -1.8,
  },
  subtitle: {
    maxWidth: 620,
    color: colors.muted,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
  },
  socialProof: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "900",
  },
  downloads: {
    width: "100%",
    maxWidth: 600,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  downloadsLabel: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  heroAction: {
    width: "100%",
    maxWidth: 420,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  factList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  fact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  factText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  heroVisual: {
    position: "relative",
    width: "100%",
    maxWidth: 440,
    height: 560,
    alignSelf: "center",
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.large,
    backgroundColor: colors.violet,
    transform: [{ rotate: "1.5deg" }],
  },
  heroAccent: {
    position: "absolute",
    right: -18,
    top: -18,
    width: 86,
    height: 86,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: radii.medium,
  },
  sectionHeader: {
    maxWidth: 720,
    gap: spacing.sm,
  },
  sectionEyebrow: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
  },
  grid: {
    gap: spacing.md,
    marginTop: -48,
  },
  stepCard: {
    minHeight: 210,
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.large,
    backgroundColor: colors.surface,
  },
  stepNumber: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.small,
    backgroundColor: colors.accent,
  },
  stepNumberText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "900",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
  },
  cardCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  screenshotCard: {
    width: "100%",
    maxWidth: 372,
    alignSelf: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.large,
    backgroundColor: colors.dark,
  },
  screenshot: {
    width: "100%",
    height: 560,
  },
  screenshotLabel: {
    padding: spacing.md,
    color: colors.onDark,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  funCard: {
    minHeight: 150,
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.large,
    backgroundColor: colors.violetSoft,
  },
  faqSection: {
    gap: spacing.xl,
  },
  faqList: {
    flex: 1,
    gap: spacing.sm,
  },
  faqCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
  },
  faqQuestion: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },
  finalCard: {
    gap: spacing.xl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.large,
    backgroundColor: colors.dark,
  },
  finalCopy: {
    flex: 1,
    maxWidth: 590,
    gap: spacing.sm,
  },
  finalEyebrow: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  finalTitle: {
    color: colors.onDark,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  finalSubtitle: {
    color: colors.onDarkMuted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  finalAction: {
    width: "100%",
    maxWidth: 360,
    gap: spacing.md,
  },
  storeList: {
    gap: spacing.sm,
  },
  storeCard: {
    display: "flex",
    flex: 1,
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    textDecorationLine: "none",
  },
  storeCardAvailable: {
    borderColor: colors.violet,
  },
  storeCardUnavailable: {
    borderColor: colors.line,
    backgroundColor: colors.surfaceStrong,
    opacity: 0.55,
  },
  storeIcon: {
    width: 46,
    height: 46,
    borderRadius: radii.small,
  },
  storeCopy: {
    flex: 1,
    alignItems: "flex-start",
    gap: 2,
  },
  storeTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
    backgroundColor: colors.violetSoft,
  },
  storeTagAndroid: {
    backgroundColor: colors.accentSoft,
  },
  storeTagText: {
    color: colors.ink,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
  },
  storeTitle: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  storeStatus: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  storeStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  storeStatusAvailable: {
    color: colors.ink,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
  },
});
