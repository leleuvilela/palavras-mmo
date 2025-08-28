export interface Player {
  id: string;
  nickname: string;
  score: number;
  color: string;
  roomId: string;
  connectedAt: Date;
}

export interface GameRoom {
  id: string;
  board: LetterGrid;
  players: Player[];
  words: WordPlacement[];
  foundWords: FoundWord[];
  createdAt: Date;
  isActive: boolean;
}

export interface LetterGrid {
  width: number;
  height: number;
  cells: string[][];
}

export interface WordPlacement {
  word: string;
  startX: number;
  startY: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
}

export interface FoundWord {
  word: string;
  playerId: string;
  playerNickname: string;
  playerColor: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  foundAt: Date;
  points: number;
}

export interface PlayerRanking {
  playerId: string;
  nickname: string;
  score: number;
  wordsFound: number;
  rank: number;
}

export interface WordAttempt {
  playerId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  selectedLetters: string;
}

export interface GameStats {
  totalWords: number;
  foundWords: number;
  totalPlayers: number;
  activePlayers: number;
  completionPercentage: number;
}

export type SocketEvents = {
  'join-room': (roomId: string, playerData: { nickname: string }) => void;
  'leave-room': (roomId: string) => void;
  'word-attempt': (attempt: WordAttempt) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'word-found': (foundWord: FoundWord) => void;
  'ranking-updated': (ranking: PlayerRanking[]) => void;
  'board-updated': (board: LetterGrid) => void;
  'game-stats': (stats: GameStats) => void;
  'error': (message: string) => void;
};