export const GAME_CONFIG = {
  BOARD: {
    DEFAULT_WIDTH: 300,
    DEFAULT_HEIGHT: 1000,
    CELL_SIZE: 32,
    MIN_ZOOM: 0.5,
    MAX_ZOOM: 2.0,
  },
  PLAYER: {
    COLORS: [
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#8b5cf6', // purple
      '#f97316', // orange
      '#06b6d4', // cyan
      '#84cc16', // lime
    ],
  },
  SOCKET: {
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000,
  },
} as const;

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  WORD_ATTEMPT: 'word-attempt',
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  WORD_FOUND: 'word-found',
  RANKING_UPDATED: 'ranking-updated',
  BOARD_UPDATED: 'board-updated',
  GAME_STATS: 'game-stats',
  ERROR: 'error',
} as const;