import { LegalPage, LegalSection } from "@/ui/legal-page";

export default function PrivacyScreen() {
  return (
    <LegalPage title="Politique de confidentialité" intro="Dernière mise à jour : 23 juillet 2026">
      <LegalSection title="Éditeur">
        GuessIt est une application éditée par Erwann Rousseau.
      </LegalSection>
      <LegalSection title="Aucune donnée collectée">
        GuessIt est un jeu hors ligne. L’application ne collecte, n’enregistre ni ne partage de
        données personnelles. Aucun compte n’est nécessaire pour jouer.
      </LegalSection>
      <LegalSection title="Aucun suivi tiers">
        GuessIt n’utilise pas d’analytics, de publicité, de suivi publicitaire, ni de service
        externe qui transmettrait des données utilisateur.
      </LegalSection>
      <LegalSection title="Données de jeu">
        Les réglages et la partie restent sur l’appareil pendant l’utilisation et ne sont pas
        envoyés à un serveur. Il n’existe pas de profil utilisateur à supprimer.
      </LegalSection>
      <LegalSection title="Contact">
        Pour toute question concernant cette politique, écrivez à erwannrousseau@icloud.com.
      </LegalSection>
    </LegalPage>
  );
}
