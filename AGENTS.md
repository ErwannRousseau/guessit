# PROJECT KNOWLEDGE BASE

## OVERVIEW

Offline French social-deduction game for one shared phone. Expo Router, React Native,
strict TypeScript, Bun.

This file records durable boundaries and workflows, not repository inventory. Before acting,
verify current files with `rg --files`, scripts and tool versions in `package.json`, and Expo
settings in `app.ts`.

## STRUCTURE

```text
src/
├── app/              # Expo Router routes; no feature logic
├── screens/          # Route-level orchestration
├── features/game/    # State machine, engine, word data, phase UI, feature tests
├── ui/               # Visual primitives shared across features
└── constants/        # Cross-cutting theme tokens
docs/
├── architecture.md   # Source boundaries and naming rules
└── agents/           # Issue, triage, and domain-doc workflows
```

## WHERE TO LOOK

| Task                      | Location                      | Notes                                             |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| App bootstrap/navigation  | `src/app/`                    | Verify current routes before editing              |
| Route-level orchestration | `src/screens/`                | Components rendered directly by routes            |
| Game domain               | `src/features/game/`          | Logic, data, internal components, colocated tests |
| Shared visuals            | `src/ui/`                     | Cross-feature visual components                   |
| Cross-cutting constants   | `src/constants/`              | Theme and other shared constants                  |
| Feature-specific rules    | `src/features/game/AGENTS.md` | Read before changing game behavior                |

## CONVENTIONS

- Keep routes in `src/app`, directly routed screens in `src/screens`, feature internals in
  `src/features/<feature>`, shared visuals in `src/ui`, and cross-cutting values in `src/constants`.
- Internal game views use `*Phase`; use `*Screen` only for components rendered by Expo Router.
- Application imports use `@/`; do not add barrel `index.ts` files.
- Tests live beside their domain in `__tests__` and import application modules through `@/`.
- Use named exports, immutable reducer updates, `StyleSheet.create`, double quotes, trailing commas.
- Oxfmt and Oxlint own formatting and linting; read their current config before changing rules.
- Use the Bun version declared in `package.json` for installs, scripts, lockfile changes, and tests.

## ANTI-PATTERNS

- Business logic or phase components in `src/app` or `src/screens`.
- Shared `src/ui` components that encode game-specific rules.
- Duplicate score or transition rules outside `game-engine.ts` / `game-state.ts`.
- npm/yarn lockfiles or dependency edits outside Bun.
- Speculative barrels; import concrete modules.

## PROJECT WORKFLOWS

- GitHub Issues use `gh`; see `docs/agents/issue-tracker.md`.
- Read current triage labels in `docs/agents/triage-labels.md`.
- Domain docs use root `CONTEXT.md` and `docs/adr/` when present; see `docs/agents/domain.md`.
- Read current commands from `package.json`; do not rely on copied command lists.

## NOTES

- Game runs offline; word data is source-controlled.
