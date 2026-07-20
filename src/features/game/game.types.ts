export type CategoryId =
  | 'mix'
  | 'objects'
  | 'animals'
  | 'food'
  | 'places'
  | 'jobs'
  | 'leisure';

export type Role = 'master' | 'insider' | 'detective';

export type GamePhase =
  | 'setup'
  | 'roles'
  | 'ready'
  | 'questions'
  | 'vote'
  | 'result';

export type RoundEndReason = 'word-found' | 'time-up';

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type Round = {
  word: string;
  categoryId: Exclude<CategoryId, 'mix'>;
  masterIndex: number;
  insiderIndex: number;
  revealIndex: number;
  roleVisible: boolean;
  remainingSeconds: number;
  timerRunning: boolean;
  endReason: RoundEndReason | null;
  suspectedIndex: number | null;
  scoreApplied: boolean;
};

export type GameState = {
  phase: GamePhase;
  players: Player[];
  playerCount: number;
  categoryId: CategoryId;
  durationSeconds: number;
  roundNumber: number;
  round: Round | null;
};
