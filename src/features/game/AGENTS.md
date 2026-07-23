# GAME FEATURE KNOWLEDGE

## OVERVIEW

Game domain: state transitions, round rules, catalog, internal phase UI, and colocated tests.

Treat implementation details as live state. Discover current files and symbols before editing;
this file keeps only durable domain boundaries and invariants.

## WHERE TO LOOK

| Change                      | Location                             | Constraint                                      |
| --------------------------- | ------------------------------------ | ----------------------------------------------- |
| State transitions           | `game-state.ts`                      | Preserve exhaustive action handling             |
| Role assignment and scoring | `game-engine.ts`                     | Keep domain arithmetic out of UI                |
| Domain shapes               | `game.types.ts`                      | Trace all references before changing            |
| Vocabulary                  | `words.ts`                           | Keep labels, playable IDs, and catalogs aligned |
| Internal game UI            | `*-phase.tsx`, supporting components | Keep secret information private                 |
| Behavior tests              | `__tests__/`                         | Follow current local fixtures and mocks         |

## CONVENTIONS

- Keep feature-only components here with `Phase` suffix; promote to `screens/` only if routed.
- Pass data and callbacks into phases; phases do not own parallel game state.
- Keep random selection and score arithmetic as pure engine functions.
- Add one focused Bun test for non-trivial reducer, scoring, or catalog behavior changes.

## ANTI-PATTERNS

- Applying scores in UI components or dispatch call sites.
- Mutating players, rounds, state, or test fixtures.
- Allowing master and insider indices to match.
- Exposing the secret word in hidden-role UI states.
- Moving reusable visuals here when they are genuinely cross-feature; use `src/ui` then.

## VERIFY

Run the current feature tests plus typecheck and lint commands declared in root `package.json`.
