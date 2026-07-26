# Architecture

The project separates routes, navigation screens, and domain features.

## Boundaries

- `src/app/` contains only Expo Router routes.
- `src/screens/` contains screens rendered directly by a route.
- `src/features/<feature>/` contains a feature's domain logic, data, and internal components.
- `src/ui/` contains visual components shared across multiple features.
- `src/constants/` contains cross-cutting constants, such as the theme.

An internal game phase stays in `src/features/game/` and uses the `Phase` suffix. It becomes a
screen with the `Screen` suffix in `src/screens/` only when rendered directly by Expo Router.

## Imports

Application modules use the `@/` alias defined in `tsconfig.json`. No re-exporting `index.ts`
file is needed.

## Tests

Tests are colocated in a `__tests__` directory under the domain being tested:

```text
src/screens/__tests__/game-screen.test.tsx
src/features/game/__tests__/game-state.test.ts
```

Tests import application modules using the `@/` alias.
