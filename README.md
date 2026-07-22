# Mot Masqué

Un jeu mobile local de mots cachés et de déduction sociale, développé avec **Expo**, **React Native**, **Expo Router** et **TypeScript**.

## Principe

- Un **Maître du jeu** connaît le mot et répond uniquement par oui, non ou « je ne sais pas ».
- Un **Complice** connaît également le mot et aide discrètement le groupe.
- Les **Enquêteurs** doivent trouver le mot puis identifier le Complice.
- Tout se joue sur un seul téléphone, que les joueurs se passent pour découvrir leur rôle.

## Fonctionnalités du MVP

- 4 à 10 joueurs avec prénoms personnalisables
- 144 mots répartis dans 6 catégories
- Distribution aléatoire des rôles
- Révélation privée, joueur par joueur
- Chronomètre de 3, 5 ou 7 minutes
- Pause, mot trouvé ou abandon
- Vote collectif pour désigner le Complice
- Calcul automatique des points
- Classement conservé entre les manches
- Fonctionnement entièrement hors ligne

## Développement

Prérequis : [Bun](https://bun.com/) 1.3.9 et l’application Expo Go, ou un simulateur iOS/Android.

```bash
bun install
bun run start
```

Scannez ensuite le QR code avec Expo Go.

### Qualité du code

```bash
bun run format:check
bun run lint
bun run typecheck
```

Pour appliquer automatiquement le formatage Oxfmt :

```bash
bun run format
```

### Plateformes

```bash
bun run ios
bun run android
bun run web
```

Pour générer l’export web statique :

```bash
bun run export:web
```

Les dépendances sont verrouillées dans `bun.lock`. Utilisez Bun pour toute modification afin de garder ce fichier synchronisé.

## Structure

```text
src/
  app/                    # Routes Expo Router
  constants/              # Thème visuel
  features/game/          # Logique, données et écrans du jeu
  ui/                     # Composants visuels partagés
```

## Règles de score proposées

- Mot trouvé + Complice identifié : **+1 point** pour tous les joueurs sauf le Complice.
- Mot trouvé + mauvaise accusation : **+2 points** pour le Complice.
- Mot non trouvé avant la fin : **+1 point** pour le Complice.

Ces règles sont volontairement simples et peuvent être adaptées.

## Indépendance

Mot Masqué est un projet original indépendant fondé sur des mécaniques génériques de mots cachés et de déduction sociale. Il n’est affilié à aucun jeu commercial existant.

## Licence

MIT — voir [LICENSE](./LICENSE).
