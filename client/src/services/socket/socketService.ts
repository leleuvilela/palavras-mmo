import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS, GAME_CONFIG } from '../../constants/index.js';
import type { SocketEvents, WordAttempt } from '../../types/index.js';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;

  connect(serverUrl: string = 'http://localhost:3001'): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string, playerData: { nickname: string }): void {
    this.socket?.emit(SOCKET_EVENTS.JOIN_ROOM, roomId, playerData);
  }

  leaveRoom(roomId: string): void {
    this.socket?.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
  }

  submitWordAttempt(attempt: WordAttempt): void {
    this.socket?.emit(SOCKET_EVENTS.WORD_ATTEMPT, attempt);
  }

  onPlayerJoined(callback: (player: any) => void): void {
    this.socket?.on(SOCKET_EVENTS.PLAYER_JOINED, callback);
  }

  onPlayerLeft(callback: (playerId: string) => void): void {
    this.socket?.on(SOCKET_EVENTS.PLAYER_LEFT, callback);
  }

  onWordFound(callback: (foundWord: any) => void): void {
    this.socket?.on(SOCKET_EVENTS.WORD_FOUND, callback);
  }

  onRankingUpdated(callback: (ranking: any[]) => void): void {
    this.socket?.on(SOCKET_EVENTS.RANKING_UPDATED, callback);
  }

  onBoardUpdated(callback: (board: any) => void): void {
    this.socket?.on(SOCKET_EVENTS.BOARD_UPDATED, callback);
  }

  onGameStats(callback: (stats: any) => void): void {
    this.socket?.on(SOCKET_EVENTS.GAME_STATS, callback);
  }

  onError(callback: (error: string) => void): void {
    this.socket?.on(SOCKET_EVENTS.ERROR, callback);
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < GAME_CONFIG.SOCKET.RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.socket?.connect();
      }, GAME_CONFIG.SOCKET.RECONNECT_DELAY * this.reconnectAttempts);
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();