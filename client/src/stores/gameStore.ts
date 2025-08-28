import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Player,
  GameRoom,
  FoundWord,
  PlayerRanking,
  GameStats,
} from "../types/index.js";

interface GameState {
  // Connection state
  isConnected: boolean;
  connectionError: string | null;

  // Room state
  currentRoom: GameRoom | null;
  roomId: string | null;

  // Player state
  currentPlayer: Player | null;
  players: Player[];

  // Game state
  board: string[][] | null;
  foundWords: FoundWord[];
  ranking: PlayerRanking[];
  gameStats: GameStats | null;

  // UI state
  isLoading: boolean;
  selectedCells: { x: number; y: number }[];

  // Actions
  setConnectionState: (connected: boolean, error?: string | null) => void;
  setCurrentRoom: (room: GameRoom | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setBoard: (board: string[][]) => void;
  addFoundWord: (word: FoundWord) => void;
  updateRanking: (ranking: PlayerRanking[]) => void;
  updateGameStats: (stats: GameStats) => void;
  setSelectedCells: (cells: { x: number; y: number }[]) => void;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
}

const initialState = {
  isConnected: false,
  connectionError: null,
  currentRoom: null,
  roomId: null,
  currentPlayer: null,
  players: [],
  board: null,
  foundWords: [],
  ranking: [],
  gameStats: null,
  isLoading: false,
  selectedCells: [],
};

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setConnectionState: (connected, error = null) =>
        set({ isConnected: connected, connectionError: error }),

      setCurrentRoom: (room) =>
        set({ currentRoom: room, roomId: room?.id || null }),

      setCurrentPlayer: (player) => set({ currentPlayer: player }),

      addPlayer: (player) =>
        set((state) => ({
          players: [...state.players.filter((p) => p.id !== player.id), player],
        })),

      removePlayer: (playerId) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== playerId),
        })),

      setBoard: (board) => set({ board }),

      addFoundWord: (word) =>
        set((state) => ({
          foundWords: [...state.foundWords, word],
        })),

      updateRanking: (ranking) => set({ ranking }),

      updateGameStats: (stats) => set({ gameStats: stats }),

      setSelectedCells: (cells) => set({ selectedCells: cells }),

      setLoading: (loading) => set({ isLoading: loading }),

      resetGame: () => set(initialState),
    }),
    { name: "game-store" },
  ),
);

