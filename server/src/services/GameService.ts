import { GameRoom, Player } from "../models/index.js";
import { BoardGenerator, WordValidator } from "../game/index.js";
import { redisClient } from "../config/index.js";
import type { WordAttempt, FoundWord } from "../../../shared/src/types.js";

export class GameService {
  private static rooms = new Map<string, GameRoom>();

  static async createRoom(
    roomId: string,
    width: number = 300,
    height: number = 1000,
  ): Promise<GameRoom> {
    // Generate words and board
    const words = BoardGenerator.generateWordList(50); // 50 words for the game
    const { board, placements } = BoardGenerator.generate(width, height, words);

    const room = new GameRoom(roomId, board, placements);
    this.rooms.set(roomId, room);

    // Cache room data in Redis
    await this.cacheRoomData(room);

    return room;
  }

  static getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  static async getOrCreateRoom(roomId: string): Promise<GameRoom> {
    let room = this.getRoom(roomId);

    if (!room) {
      // Try to load from Redis first
      room = await this.loadRoomFromCache(roomId);

      if (!room) {
        room = await this.createRoom(roomId);
      } else {
        this.rooms.set(roomId, room);
      }
    }

    return room;
  }

  static async addPlayerToRoom(
    roomId: string,
    playerId: string,
    nickname: string,
  ): Promise<Player> {
    const room = await this.getOrCreateRoom(roomId);

    const color = Player.generateColor(playerId);
    const player = new Player(playerId, nickname, roomId, color);

    room.addPlayer(player);

    // Update cache
    await this.cacheRoomData(room);

    return player;
  }

  static async removePlayerFromRoom(
    roomId: string,
    playerId: string,
  ): Promise<void> {
    const room = this.getRoom(roomId);
    if (room) {
      room.removePlayer(playerId);
      await this.cacheRoomData(room);
    }
  }

  static async processWordAttempt(
    roomId: string,
    attempt: WordAttempt,
  ): Promise<{
    success: boolean;
    foundWord?: FoundWord;
    error?: string;
  }> {
    const room = this.getRoom(roomId);
    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const player = room.getPlayer(attempt.playerId);
    if (!player) {
      return { success: false, error: "Player not found" };
    }

    // Validate the word attempt
    const validation = WordValidator.validateAttempt(
      attempt,
      room.board,
      room.words,
    );

    if (!validation.isValid || !validation.word) {
      return { success: false, error: "Invalid word selection" };
    }

    // Check if word was already found
    if (room.isWordFound(validation.word)) {
      return { success: false, error: "Word already found" };
    }

    // Create found word record
    const foundWord: FoundWord = {
      word: validation.word,
      playerId: attempt.playerId,
      playerNickname: player.nickname,
      playerColor: player.color,
      startX: attempt.startX,
      startY: attempt.startY,
      endX: attempt.endX,
      endY: attempt.endY,
      foundAt: new Date(),
      points: validation.points || 0,
    };

    // Add to room
    room.addFoundWord(foundWord);

    // Update cache
    await this.cacheRoomData(room);

    return { success: true, foundWord };
  }

  static getRoomRanking(roomId: string) {
    const room = this.getRoom(roomId);
    return room ? room.getRanking() : [];
  }

  static getRoomStats(roomId: string) {
    const room = this.getRoom(roomId);
    return room ? room.getStats() : null;
  }

  private static async cacheRoomData(room: GameRoom): Promise<void> {
    try {
      await redisClient.setEx(
        `room:${room.id}`,
        3600,
        JSON.stringify(room.toJSON()),
      ); // 1 hour TTL
    } catch (error) {
      console.error("Failed to cache room data:", error);
    }
  }

  private static async loadRoomFromCache(
    roomId: string,
  ): Promise<GameRoom | null> {
    try {
      const cached = await redisClient.get(`room:${roomId}`);
      if (!cached) return null;

      const data = JSON.parse(cached);
      const room = new GameRoom(
        data.id,
        data.board,
        data.words,
        data.foundWords,
        new Date(data.createdAt),
        data.isActive,
      );

      // Restore players
      for (const playerData of data.players) {
        const player = new Player(
          playerData.id,
          playerData.nickname,
          playerData.roomId,
          playerData.color,
          playerData.score,
          new Date(playerData.connectedAt),
        );
        room.addPlayer(player);
      }

      return room;
    } catch (error) {
      console.error("Failed to load room from cache:", error);
      return null;
    }
  }
}

