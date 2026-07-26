# GuessIt

A local hidden-word and social-deduction mobile game built with **Expo**, **React Native**,
**Expo Router**, and **TypeScript**.

## How it works

- A **Game Master** knows the word and can answer only yes, no, or "I don't know."
- An **Insider** also knows the word and discreetly helps the group.
- The **Detectives** must find the word, then identify the Insider.
- The entire game is played on a single phone, which players pass around to discover their roles.

## Game flow

1. Set up 4 to 10 players, a word category, and a 3-, 5-, or 7-minute timer.
2. Pass the phone to each player to reveal their role privately. The Game Master and the Insider
   know the word; the Detectives do not.
3. The Game Master answers questions while the timer runs. The timer can be paused.
4. If the word is found, the group votes to identify the Insider. If time runs out or the group
   gives up, the Insider wins the round.
5. Points and rankings are calculated automatically and carried over to the next round.

The game contains 144 words across 6 categories and works offline.

## Development

Requirements: [Bun](https://bun.com/) 1.3.14 and the Expo Go app, or an iOS/Android
simulator.

```bash
bun install
bun run start
```

Then scan the QR code with Expo Go. Dependencies are locked in `bun.lock`; use Bun to modify
them.

### Code quality

```bash
bun run format:check
bun run lint
bun run test
bun run typecheck
```

To apply Oxfmt formatting automatically:

```bash
bun run format
```

### Platforms

```bash
bun run ios
bun run android
bun run web
```

To generate the static web export:

```bash
bun run export:web
```

`oxfmt.config.ts` sets the line width to 100 characters. `oxlint.config.ts` enables the
TypeScript, React, and React Performance rules, along with the React Doctor recommendations for
React and React Native.

The structural conventions are detailed in
[docs/architecture.md](./docs/architecture.md).

## Structure

```text
src/
  app/                    # Expo Router routes
  constants/              # Visual theme
  features/game/          # Game logic, data, and internal components
  screens/                # Navigation screens
  ui/                     # Shared visual components
```

## Scoring rules

- Word found + Insider identified: **+1 point** for every player except the Insider.
- Word found + wrong accusation: **+2 points** for the Insider.
- Word not found before time runs out: **+1 point** for the Insider.

## Independence

GuessIt is an original, independent project based on generic hidden-word and social-deduction
mechanics. It is not affiliated with any existing commercial game.

## License

MIT — see [LICENSE](./LICENSE).
