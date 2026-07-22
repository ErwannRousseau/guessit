# Architecture

Le projet sépare les routes, les écrans de navigation et les fonctionnalités métier.

## Frontières

- `src/app/` contient uniquement les routes Expo Router.
- `src/screens/` contient les écrans directement rendus par une route.
- `src/features/<feature>/` regroupe la logique métier, les données et les composants internes d’une fonctionnalité.
- `src/ui/` contient les composants visuels partagés entre plusieurs fonctionnalités.
- `src/constants/` contient les constantes transversales, comme le thème.

Une phase interne du jeu reste dans `src/features/game/`. Elle ne devient un écran dans `src/screens/` que si Expo Router la rend directement.

## Imports

Les modules applicatifs utilisent l’alias `@/` défini dans `tsconfig.json`. Aucun fichier `index.ts` de réexport n’est nécessaire.

## Tests

Les tests sont colocalisés dans un dossier `__tests__` sous le domaine testé :

```text
src/screens/__tests__/game-screen.test.tsx
src/features/game/__tests__/game-state.test.ts
```

Les tests importent les modules applicatifs avec l’alias `@/`.
