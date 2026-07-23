# Mot Masqué

Un jeu mobile local de mots cachés et de déduction sociale, développé avec **Expo**, **React Native**, **Expo Router** et **TypeScript**.

## Principe

- Un **Maître du jeu** connaît le mot et répond uniquement par oui, non ou « je ne sais pas ».
- Un **Complice** connaît également le mot et aide discrètement le groupe.
- Les **Enquêteurs** doivent trouver le mot puis identifier le Complice.
- Tout se joue sur un seul téléphone, que les joueurs se passent pour découvrir leur rôle.

## Déroulement d’une partie

1. Configurez 4 à 10 joueurs, une catégorie de mots et un chronomètre de 3, 5 ou 7 minutes.
2. Passez le téléphone à chaque joueur pour révéler son rôle en privé. Le Maître du jeu et le Complice connaissent le mot ; les Enquêteurs l’ignorent.
3. Le Maître répond aux questions pendant le chronomètre, qui peut être mis en pause.
4. Si le mot est trouvé, le groupe vote pour identifier le Complice. Si le temps expire ou si le groupe abandonne, le Complice gagne la manche.
5. Les points et le classement sont calculés automatiquement et conservés pour la manche suivante.

Le jeu contient 144 mots dans 6 catégories et fonctionne hors ligne.

## Développement

Prérequis : [Bun](https://bun.com/) 1.3.14 et l’application Expo Go, ou un simulateur iOS/Android.

```bash
bun install
bun run start
```

Scannez ensuite le QR code avec Expo Go. Les dépendances sont verrouillées dans `bun.lock`; utilisez Bun pour les modifier.

### Qualité du code

```bash
bun run format:check
bun run lint
bun run test
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

`oxfmt.config.ts` fixe la largeur de ligne à 100 caractères. `oxlint.config.ts` active les règles TypeScript, React et React Performance ainsi que les recommandations React Doctor pour React et React Native.

Les conventions de structure sont détaillées dans [docs/architecture.md](./docs/architecture.md).

## Structure

```text
src/
  app/                    # Routes Expo Router
  constants/              # Thème visuel
  features/game/          # Logique, données et composants internes du jeu
  screens/                # Écrans de navigation
  ui/                     # Composants visuels partagés
```

## Règles de score

- Mot trouvé + Complice identifié : **+1 point** pour tous les joueurs sauf le Complice.
- Mot trouvé + mauvaise accusation : **+2 points** pour le Complice.
- Mot non trouvé avant la fin : **+1 point** pour le Complice.

## Indépendance

Mot Masqué est un projet original indépendant fondé sur des mécaniques génériques de mots cachés et de déduction sociale. Il n’est affilié à aucun jeu commercial existant.

## Licence

MIT — voir [LICENSE](./LICENSE).
