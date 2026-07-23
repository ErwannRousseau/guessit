import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { colors } from "@/constants/theme";
import { LegalPage, LegalSection } from "@/ui/legal-page";

export default function SupportScreen() {
  return (
    <LegalPage
      title="Support"
      intro="Une question ou un problème avec GuessIt ? Nous vous répondrons par e-mail."
    >
      <LegalSection title="Nous contacter">
        Écrivez à erwannrousseau@icloud.com en indiquant votre appareil et le problème rencontré.
      </LegalSection>
      <LegalSection title="Confidentialité">
        Consultez notre{" "}
        <Link href="./privacy" style={styles.privacyLink}>
          politique de confidentialité
        </Link>
        .
      </LegalSection>
      <LegalSection title="À propos de GuessIt">
        GuessIt est un jeu de mots et de déduction conçu pour jouer à plusieurs sur un seul
        téléphone, sans compte et sans connexion internet.
      </LegalSection>
    </LegalPage>
  );
}

const styles = StyleSheet.create({
  privacyLink: {
    color: colors.primary,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
