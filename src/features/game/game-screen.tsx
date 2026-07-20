import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, spacing } from '@/constants/theme';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';

import {
  applyRoundScore,
  createPlayers,
  createRound,
  formatTime,
  getRole,
} from './game-engine';
import type { CategoryId, GameState, Player, Role, Round } from './game.types';
import { categoryLabels } from './words';

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 10;
const durations = [180, 300, 420] as const;
const categories: CategoryId[] = [
  'mix',
  'objects',
  'animals',
  'food',
  'places',
  'jobs',
  'leisure',
];

const initialState: GameState = {
  phase: 'setup',
  players: createPlayers(MIN_PLAYERS),
  playerCount: MIN_PLAYERS,
  categoryId: 'mix',
  durationSeconds: 300,
  roundNumber: 0,
  round: null,
};

export function GameScreen() {
  const [game, setGame] = useState<GameState>(initialState);

  useEffect(() => {
    if (
      game.phase !== 'questions' ||
      !game.round?.timerRunning ||
      game.round.remainingSeconds <= 0
    ) {
      return;
    }

    const interval = setInterval(() => {
      setGame((current) => {
        if (current.phase !== 'questions' || !current.round?.timerRunning) {
          return current;
        }

        const nextSeconds = Math.max(0, current.round.remainingSeconds - 1);
        if (nextSeconds === 0) {
          return {
            ...current,
            phase: 'result',
            round: {
              ...current.round,
              remainingSeconds: 0,
              timerRunning: false,
              endReason: 'time-up',
              scoreApplied: true,
            },
            players: applyRoundScore(current.players, {
              ...current.round,
              remainingSeconds: 0,
              timerRunning: false,
              endReason: 'time-up',
            }),
          };
        }

        return {
          ...current,
          round: { ...current.round, remainingSeconds: nextSeconds },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [game.phase, game.round?.timerRunning, game.round?.remainingSeconds]);

  const updatePlayerCount = (nextCount: number) => {
    const count = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, nextCount));
    setGame((current) => ({
      ...current,
      playerCount: count,
      players: createPlayers(count, current.players),
    }));
  };

  const updatePlayerName = (index: number, value: string) => {
    setGame((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) =>
        playerIndex === index ? { ...player, name: value } : player,
      ),
    }));
  };

  const normalizedPlayers = (players: Player[]) =>
    players.map((player, index) => ({
      ...player,
      name: player.name.trim() || `Joueur ${index + 1}`,
    }));

  const startRound = () => {
    setGame((current) => {
      const players = normalizedPlayers(current.players);
      return {
        ...current,
        phase: 'roles',
        players,
        roundNumber: current.roundNumber + 1,
        round: createRound(
          current.playerCount,
          current.categoryId,
          current.durationSeconds,
        ),
      };
    });
  };

  const resetGame = () => {
    Alert.alert(
      'Revenir à l’accueil ?',
      'Les scores de cette partie seront effacés.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: () => setGame(initialState) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {game.phase === 'setup' ? (
          <SetupScreen
            game={game}
            onPlayerCountChange={updatePlayerCount}
            onPlayerNameChange={updatePlayerName}
            onCategoryChange={(categoryId) =>
              setGame((current) => ({ ...current, categoryId }))
            }
            onDurationChange={(durationSeconds) =>
              setGame((current) => ({ ...current, durationSeconds }))
            }
            onStart={startRound}
          />
        ) : null}

        {game.phase === 'roles' && game.round ? (
          <RoleRevealScreen
            players={game.players}
            round={game.round}
            onShowRole={() =>
              setGame((current) =>
                current.round
                  ? {
                      ...current,
                      round: { ...current.round, roleVisible: true },
                    }
                  : current,
              )
            }
            onHideAndContinue={() =>
              setGame((current) => {
                if (!current.round) return current;
                const isLastPlayer =
                  current.round.revealIndex === current.players.length - 1;

                if (isLastPlayer) {
                  return {
                    ...current,
                    phase: 'ready',
                    round: { ...current.round, roleVisible: false },
                  };
                }

                return {
                  ...current,
                  round: {
                    ...current.round,
                    revealIndex: current.round.revealIndex + 1,
                    roleVisible: false,
                  },
                };
              })
            }
          />
        ) : null}

        {game.phase === 'ready' && game.round ? (
          <ReadyScreen
            players={game.players}
            round={game.round}
            roundNumber={game.roundNumber}
            onStart={() =>
              setGame((current) =>
                current.round
                  ? {
                      ...current,
                      phase: 'questions',
                      round: { ...current.round, timerRunning: true },
                    }
                  : current,
              )
            }
          />
        ) : null}

        {game.phase === 'questions' && game.round ? (
          <QuestionsScreen
            players={game.players}
            round={game.round}
            onToggleTimer={() =>
              setGame((current) =>
                current.round
                  ? {
                      ...current,
                      round: {
                        ...current.round,
                        timerRunning: !current.round.timerRunning,
                      },
                    }
                  : current,
              )
            }
            onWordFound={() =>
              setGame((current) =>
                current.round
                  ? {
                      ...current,
                      phase: 'vote',
                      round: {
                        ...current.round,
                        timerRunning: false,
                        endReason: 'word-found',
                      },
                    }
                  : current,
              )
            }
            onGiveUp={() =>
              setGame((current) => {
                if (!current.round) return current;
                const completedRound: Round = {
                  ...current.round,
                  timerRunning: false,
                  endReason: 'time-up',
                  scoreApplied: true,
                };
                return {
                  ...current,
                  phase: 'result',
                  round: completedRound,
                  players: applyRoundScore(current.players, completedRound),
                };
              })
            }
          />
        ) : null}

        {game.phase === 'vote' && game.round ? (
          <VoteScreen
            players={game.players}
            round={game.round}
            onSelect={(suspectedIndex) =>
              setGame((current) =>
                current.round
                  ? {
                      ...current,
                      round: { ...current.round, suspectedIndex },
                    }
                  : current,
              )
            }
            onReveal={() =>
              setGame((current) => {
                if (!current.round || current.round.suspectedIndex === null) {
                  return current;
                }
                const completedRound: Round = {
                  ...current.round,
                  scoreApplied: true,
                };
                return {
                  ...current,
                  phase: 'result',
                  round: completedRound,
                  players: applyRoundScore(current.players, completedRound),
                };
              })
            }
          />
        ) : null}

        {game.phase === 'result' && game.round ? (
          <ResultScreen
            players={game.players}
            round={game.round}
            onNextRound={startRound}
            onReset={resetGame}
          />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type SetupScreenProps = {
  game: GameState;
  onPlayerCountChange: (count: number) => void;
  onPlayerNameChange: (index: number, value: string) => void;
  onCategoryChange: (category: CategoryId) => void;
  onDurationChange: (seconds: number) => void;
  onStart: () => void;
};

function SetupScreen({
  game,
  onPlayerCountChange,
  onPlayerNameChange,
  onCategoryChange,
  onDurationChange,
  onStart,
}: SetupScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.hero}>
        <View style={styles.logoMark}>
          <Text style={styles.logoQuestion}>?</Text>
          <View style={styles.logoDot} />
        </View>
        <View style={styles.heroCopy}>
          <Text selectable style={styles.eyebrow}>JEU DE MOTS & DÉDUCTION</Text>
          <Text selectable style={styles.title}>Mot Masqué</Text>
          <Text selectable style={styles.subtitle}>
            Aidez le groupe à trouver le mot… sans révéler qui est le complice.
          </Text>
        </View>
      </View>

      <Card>
        <SectionTitle number="1" title="Combien de joueurs ?" />
        <View style={styles.stepperRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retirer un joueur"
            disabled={game.playerCount <= MIN_PLAYERS}
            onPress={() => onPlayerCountChange(game.playerCount - 1)}
            style={({ pressed }) => [
              styles.stepperButton,
              pressed && styles.controlPressed,
              game.playerCount <= MIN_PLAYERS && styles.controlDisabled,
            ]}
          >
            <Text style={styles.stepperSymbol}>−</Text>
          </Pressable>
          <View style={styles.playerCountBlock}>
            <Text selectable style={styles.playerCount}>{game.playerCount}</Text>
            <Text selectable style={styles.playerCountLabel}>joueurs</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter un joueur"
            disabled={game.playerCount >= MAX_PLAYERS}
            onPress={() => onPlayerCountChange(game.playerCount + 1)}
            style={({ pressed }) => [
              styles.stepperButton,
              pressed && styles.controlPressed,
              game.playerCount >= MAX_PLAYERS && styles.controlDisabled,
            ]}
          >
            <Text style={styles.stepperSymbol}>+</Text>
          </Pressable>
        </View>

        <View style={styles.namesGrid}>
          {game.players.map((player, index) => (
            <TextInput
              key={player.id}
              accessibilityLabel={`Nom du joueur ${index + 1}`}
              value={player.name}
              onChangeText={(value) => onPlayerNameChange(index, value)}
              maxLength={18}
              selectTextOnFocus
              returnKeyType="done"
              style={styles.nameInput}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle number="2" title="Choisissez les mots" />
        <View style={styles.chipWrap}>
          {categories.map((category) => (
            <ChoiceChip
              key={category}
              label={categoryLabels[category]}
              selected={game.categoryId === category}
              onPress={() => onCategoryChange(category)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle number="3" title="Durée de la manche" />
        <View style={styles.durationRow}>
          {durations.map((duration) => (
            <ChoiceChip
              key={duration}
              label={`${duration / 60} min`}
              selected={game.durationSeconds === duration}
              onPress={() => onDurationChange(duration)}
              grow
            />
          ))}
        </View>
      </Card>

      <Card tone="accent">
        <Text selectable style={styles.rulesTitle}>Comment jouer ?</Text>
        <RuleLine number="1" text="Le Maître du jeu et le Complice voient le mot." />
        <RuleLine number="2" text="Les autres posent uniquement des questions fermées." />
        <RuleLine number="3" text="Le Complice guide discrètement le groupe sans se faire repérer." />
      </Card>

      <Button onPress={onStart}>Distribuer les rôles</Button>
      <Text selectable style={styles.legalNote}>
        Jeu original indépendant, inspiré des mécaniques classiques de mots cachés et de déduction sociale.
      </Text>
    </ScrollView>
  );
}

function RoleRevealScreen({
  players,
  round,
  onShowRole,
  onHideAndContinue,
}: {
  players: Player[];
  round: Round;
  onShowRole: () => void;
  onHideAndContinue: () => void;
}) {
  const player = players[round.revealIndex];
  const role = getRole(round, round.revealIndex);
  const isLastPlayer = round.revealIndex === players.length - 1;

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <ProgressDots current={round.revealIndex} total={players.length} />

      {!round.roleVisible ? (
        <>
          <View style={styles.secretIcon}>
            <Text style={styles.secretIconText}>•••</Text>
          </View>
          <Text selectable style={styles.eyebrow}>PASSE LE TÉLÉPHONE</Text>
          <Text selectable style={styles.centerTitle}>{player.name}</Text>
          <Text selectable style={styles.centerSubtitle}>
            Vérifie que personne ne regarde l’écran, puis découvre ton rôle.
          </Text>
          <Button onPress={onShowRole}>Voir mon rôle</Button>
        </>
      ) : (
        <RoleCard role={role} word={round.word} playerName={player.name} />
      )}

      {round.roleVisible ? (
        <Button onPress={onHideAndContinue}>
          {isLastPlayer ? 'J’ai mémorisé — continuer' : 'J’ai mémorisé — joueur suivant'}
        </Button>
      ) : null}
    </ScrollView>
  );
}

function RoleCard({
  role,
  word,
  playerName,
}: {
  role: Role;
  word: string;
  playerName: string;
}) {
  const content = {
    master: {
      badge: 'MAÎTRE DU JEU',
      title: 'Tu connais le mot',
      description: 'Réponds seulement par oui, non ou je ne sais pas.',
      tone: 'accent' as const,
    },
    insider: {
      badge: 'COMPLICE',
      title: 'Aide sans te trahir',
      description: 'Oriente subtilement le groupe vers la réponse.',
      tone: 'danger' as const,
    },
    detective: {
      badge: 'ENQUÊTEUR',
      title: 'Trouve le mot secret',
      description: 'Pose des questions fermées et observe qui aide un peu trop.',
      tone: 'success' as const,
    },
  }[role];

  return (
    <Card tone={content.tone} style={styles.roleCard}>
      <Text selectable style={styles.rolePlayer}>{playerName}</Text>
      <Text selectable style={styles.roleBadge}>{content.badge}</Text>
      <Text selectable style={styles.roleTitle}>{content.title}</Text>
      {role !== 'detective' ? (
        <View style={styles.wordPanel}>
          <Text selectable style={styles.wordLabel}>LE MOT SECRET</Text>
          <Text selectable style={styles.word}>{word}</Text>
        </View>
      ) : (
        <View style={styles.hiddenWordPanel}>
          <Text selectable style={styles.hiddenWord}>? ? ?</Text>
        </View>
      )}
      <Text selectable style={styles.roleDescription}>{content.description}</Text>
    </Card>
  );
}

function ReadyScreen({
  players,
  round,
  roundNumber,
  onStart,
}: {
  players: Player[];
  round: Round;
  roundNumber: number;
  onStart: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <Text selectable style={styles.eyebrow}>MANCHE {roundNumber}</Text>
      <Text selectable style={styles.centerTitle}>Tout le monde est prêt ?</Text>
      <Text selectable style={styles.centerSubtitle}>
        Posez des questions auxquelles le Maître du jeu peut répondre par oui, non ou je ne sais pas.
      </Text>

      <Card tone="dark" style={styles.hostCard}>
        <Text selectable style={styles.hostLabel}>MAÎTRE DU JEU</Text>
        <Text selectable style={styles.hostName}>{players[round.masterIndex].name}</Text>
        <Text selectable style={styles.hostHint}>Garde le mot secret et lance le chrono.</Text>
      </Card>

      <Card>
        <RuleLine number="✓" text="Une seule question à la fois" />
        <RuleLine number="✓" text="Aucun geste, mime ou indice direct" />
        <RuleLine number="✓" text="Quand le mot est trouvé, arrêtez le chrono" />
      </Card>

      <Button onPress={onStart}>Lancer la manche</Button>
    </ScrollView>
  );
}

function QuestionsScreen({
  players,
  round,
  onToggleTimer,
  onWordFound,
  onGiveUp,
}: {
  players: Player[];
  round: Round;
  onToggleTimer: () => void;
  onWordFound: () => void;
  onGiveUp: () => void;
}) {
  const progress = round.remainingSeconds / Math.max(round.remainingSeconds, 1);
  void progress;

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, styles.centeredContent]}>
      <View style={styles.timerTopRow}>
        <View>
          <Text selectable style={styles.eyebrow}>QUESTIONS EN COURS</Text>
          <Text selectable style={styles.timerHost}>
            Maître : {players[round.masterIndex].name}
          </Text>
        </View>
        <View style={[styles.liveDot, !round.timerRunning && styles.pausedDot]} />
      </View>

      <View style={styles.timerRing}>
        <Text selectable style={styles.timerText}>{formatTime(round.remainingSeconds)}</Text>
        <Text selectable style={styles.timerStatus}>
          {round.timerRunning ? 'TEMPS RESTANT' : 'EN PAUSE'}
        </Text>
      </View>

      <Card tone="accent">
        <Text selectable style={styles.questionReminder}>
          « Est-ce que ça se mange ? »{`\n`}« Est-ce plus grand qu’une voiture ? »
        </Text>
        <Text selectable style={styles.questionHint}>
          Le Complice connaît la réponse. Observez qui pose les questions les plus utiles.
        </Text>
      </Card>

      <Button variant="secondary" onPress={onToggleTimer}>
        {round.timerRunning ? 'Mettre en pause' : 'Reprendre le chrono'}
      </Button>
      <Button onPress={onWordFound}>Le mot a été trouvé</Button>
      <Button variant="ghost" onPress={onGiveUp}>Temps écoulé / abandonner</Button>
    </ScrollView>
  );
}

function VoteScreen({
  players,
  round,
  onSelect,
  onReveal,
}: {
  players: Player[];
  round: Round;
  onSelect: (index: number) => void;
  onReveal: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.voteHeader}>
        <Text selectable style={styles.eyebrow}>LE MOT A ÉTÉ TROUVÉ</Text>
        <Text selectable style={styles.title}>Qui est le Complice ?</Text>
        <Text selectable style={styles.subtitle}>
          Débattez ensemble, puis désignez une seule personne. Le Maître du jeu ne peut pas être suspecté.
        </Text>
      </View>

      <View style={styles.suspectGrid}>
        {players.map((player, index) => {
          const isMaster = index === round.masterIndex;
          const selected = round.suspectedIndex === index;
          return (
            <Pressable
              key={player.id}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: isMaster }}
              disabled={isMaster}
              onPress={() => onSelect(index)}
              style={({ pressed }) => [
                styles.suspectCard,
                selected && styles.suspectCardSelected,
                isMaster && styles.suspectCardDisabled,
                pressed && !isMaster && styles.controlPressed,
              ]}
            >
              <View style={[styles.avatar, selected && styles.avatarSelected]}>
                <Text style={[styles.avatarText, selected && styles.avatarTextSelected]}>
                  {player.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <Text selectable numberOfLines={1} style={styles.suspectName}>{player.name}</Text>
              <Text selectable style={styles.suspectMeta}>
                {isMaster ? 'Maître du jeu' : selected ? 'Votre choix' : 'Suspect'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button disabled={round.suspectedIndex === null} onPress={onReveal}>
        Révéler le Complice
      </Button>
    </ScrollView>
  );
}

function ResultScreen({
  players,
  round,
  onNextRound,
  onReset,
}: {
  players: Player[];
  round: Round;
  onNextRound: () => void;
  onReset: () => void;
}) {
  const detectivesWon =
    round.endReason === 'word-found' &&
    round.suspectedIndex === round.insiderIndex;
  const winnerTitle = detectivesWon
    ? 'Les Enquêteurs gagnent !'
    : 'Le Complice s’en sort !';
  const winnerDescription = detectivesWon
    ? 'Le mot et le Complice ont tous les deux été trouvés.'
    : round.endReason === 'time-up'
      ? 'Le groupe n’a pas trouvé le mot avant la fin du temps.'
      : `${players[round.suspectedIndex ?? 0].name} a été accusé à tort.`;

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players],
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card tone={detectivesWon ? 'success' : 'danger'} style={styles.resultHero}>
        <Text selectable style={styles.resultKicker}>
          {detectivesWon ? 'ENQUÊTE RÉUSSIE' : 'MISSION ACCOMPLIE'}
        </Text>
        <Text selectable style={styles.resultTitle}>{winnerTitle}</Text>
        <Text selectable style={styles.resultDescription}>{winnerDescription}</Text>
      </Card>

      <Card>
        <RevealLine label="Mot secret" value={round.word} emphasis />
        <View style={styles.divider} />
        <RevealLine label="Complice" value={players[round.insiderIndex].name} />
        <RevealLine label="Maître du jeu" value={players[round.masterIndex].name} />
        {round.suspectedIndex !== null ? (
          <RevealLine label="Personne accusée" value={players[round.suspectedIndex].name} />
        ) : null}
      </Card>

      <Card>
        <Text selectable style={styles.scoreTitle}>Classement</Text>
        {sortedPlayers.map((player, index) => (
          <View key={player.id} style={styles.scoreRow}>
            <View style={styles.rankBadge}>
              <Text selectable style={styles.rankText}>{index + 1}</Text>
            </View>
            <Text selectable style={styles.scoreName}>{player.name}</Text>
            <Text selectable style={styles.scoreValue}>{player.score} pt{player.score > 1 ? 's' : ''}</Text>
          </View>
        ))}
      </Card>

      <Button onPress={onNextRound}>Nouvelle manche</Button>
      <Button variant="ghost" onPress={onReset}>Terminer la partie</Button>
    </ScrollView>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>{number}</Text>
      </View>
      <Text selectable style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
  grow = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  grow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        grow && styles.chipGrow,
        selected && styles.chipSelected,
        pressed && styles.controlPressed,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function RuleLine({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.ruleLine}>
      <View style={styles.ruleNumber}>
        <Text style={styles.ruleNumberText}>{number}</Text>
      </View>
      <Text selectable style={styles.ruleText}>{text}</Text>
    </View>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index < current && styles.progressDotDone,
            index === current && styles.progressDotCurrent,
          ]}
        />
      ))}
    </View>
  );
}

function RevealLine({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.revealLine}>
      <Text selectable style={styles.revealLabel}>{label}</Text>
      <Text selectable style={[styles.revealValue, emphasis && styles.revealValueEmphasis]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroCopy: { flex: 1, gap: spacing.xs },
  logoMark: {
    width: 74,
    height: 74,
    borderRadius: 25,
    borderCurve: 'continuous',
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  logoQuestion: { color: colors.accent, fontSize: 42, fontWeight: '900', lineHeight: 48 },
  logoDot: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: { color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: { color: colors.white, fontSize: 14, fontWeight: '800' },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: '800' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: { color: colors.ink, fontSize: 29, lineHeight: 32, fontWeight: '500' },
  playerCountBlock: { minWidth: 84, alignItems: 'center' },
  playerCount: { color: colors.ink, fontSize: 42, lineHeight: 46, fontWeight: '900', fontVariant: ['tabular-nums'] },
  playerCountLabel: { color: colors.muted, fontSize: 13, lineHeight: 17, fontWeight: '600' },
  namesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  nameInput: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 130,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.small,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceStrong,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  durationRow: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGrow: { flex: 1 },
  chipSelected: { backgroundColor: colors.dark, borderColor: colors.dark },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  chipTextSelected: { color: colors.white },
  rulesTitle: { color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: '900' },
  ruleLine: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  ruleNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(23, 32, 51, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  ruleText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  legalNote: { color: colors.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', paddingHorizontal: spacing.md },
  controlPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  controlDisabled: { opacity: 0.35 },
  progressDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingBottom: spacing.md },
  progressDot: { width: 18, height: 5, borderRadius: 3, backgroundColor: colors.line },
  progressDotDone: { backgroundColor: colors.success },
  progressDotCurrent: { width: 34, backgroundColor: colors.primary },
  secretIcon: {
    width: 92,
    height: 92,
    alignSelf: 'center',
    borderRadius: 31,
    borderCurve: 'continuous',
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  secretIconText: { color: colors.accent, fontSize: 32, lineHeight: 36, fontWeight: '900', letterSpacing: 3 },
  centerTitle: { color: colors.ink, fontSize: 36, lineHeight: 42, fontWeight: '900', textAlign: 'center', letterSpacing: -0.8 },
  centerSubtitle: { color: colors.muted, fontSize: 17, lineHeight: 25, textAlign: 'center', paddingHorizontal: spacing.sm },
  roleCard: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  rolePlayer: { color: colors.muted, fontSize: 15, lineHeight: 20, fontWeight: '700' },
  roleBadge: { color: colors.primary, fontSize: 12, lineHeight: 16, fontWeight: '900', letterSpacing: 1.5 },
  roleTitle: { color: colors.ink, fontSize: 29, lineHeight: 34, fontWeight: '900', textAlign: 'center' },
  wordPanel: {
    alignSelf: 'stretch',
    padding: spacing.lg,
    borderRadius: radii.medium,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    gap: spacing.xs,
  },
  wordLabel: { color: colors.muted, fontSize: 11, lineHeight: 15, fontWeight: '800', letterSpacing: 1.2 },
  word: { color: colors.dark, fontSize: 35, lineHeight: 41, fontWeight: '900', textAlign: 'center' },
  hiddenWordPanel: {
    alignSelf: 'stretch',
    padding: spacing.lg,
    borderRadius: radii.medium,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.58)',
    alignItems: 'center',
  },
  hiddenWord: { color: colors.ink, fontSize: 33, lineHeight: 39, fontWeight: '900', letterSpacing: 5 },
  roleDescription: { color: colors.ink, fontSize: 16, lineHeight: 23, fontWeight: '600', textAlign: 'center' },
  hostCard: { alignItems: 'center', paddingVertical: spacing.xl },
  hostLabel: { color: colors.accent, fontSize: 12, lineHeight: 16, fontWeight: '900', letterSpacing: 1.4 },
  hostName: { color: colors.white, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
  hostHint: { color: '#C7CFDD', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  timerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch' },
  timerHost: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: '700', paddingTop: 3 },
  liveDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.success },
  pausedDot: { backgroundColor: colors.accent },
  timerRing: {
    width: 246,
    height: 246,
    alignSelf: 'center',
    borderRadius: 123,
    backgroundColor: colors.dark,
    borderWidth: 10,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  timerText: { color: colors.white, fontSize: 61, lineHeight: 67, fontWeight: '900', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  timerStatus: { color: colors.accent, fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 1.5 },
  questionReminder: { color: colors.ink, fontSize: 19, lineHeight: 28, fontWeight: '800', textAlign: 'center' },
  questionHint: { color: colors.ink, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  voteHeader: { gap: spacing.sm, paddingVertical: spacing.sm },
  suspectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suspectCard: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 135,
    padding: spacing.md,
    borderRadius: radii.medium,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: spacing.xs,
  },
  suspectCardSelected: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  suspectCardDisabled: { opacity: 0.43 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarSelected: { backgroundColor: colors.primary },
  avatarText: { color: colors.ink, fontSize: 21, lineHeight: 25, fontWeight: '900' },
  avatarTextSelected: { color: colors.white },
  suspectName: { maxWidth: 120, color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  suspectMeta: { color: colors.muted, fontSize: 12, lineHeight: 16, fontWeight: '600' },
  resultHero: { paddingVertical: spacing.xl, alignItems: 'center' },
  resultKicker: { color: colors.primary, fontSize: 12, lineHeight: 16, fontWeight: '900', letterSpacing: 1.4 },
  resultTitle: { color: colors.ink, fontSize: 31, lineHeight: 37, fontWeight: '900', textAlign: 'center' },
  resultDescription: { color: colors.ink, fontSize: 16, lineHeight: 23, textAlign: 'center' },
  revealLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  revealLabel: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  revealValue: { flexShrink: 1, color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: '800', textAlign: 'right' },
  revealValueEmphasis: { color: colors.primary, fontSize: 25, lineHeight: 30, fontWeight: '900' },
  divider: { height: 1, backgroundColor: colors.line },
  scoreTitle: { color: colors.ink, fontSize: 20, lineHeight: 25, fontWeight: '900' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rankBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: colors.ink, fontSize: 12, lineHeight: 16, fontWeight: '900', fontVariant: ['tabular-nums'] },
  scoreName: { flex: 1, color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: '700' },
  scoreValue: { color: colors.primary, fontSize: 16, lineHeight: 21, fontWeight: '900', fontVariant: ['tabular-nums'] },
});
