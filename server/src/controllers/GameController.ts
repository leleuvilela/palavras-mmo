import { Server as SocketIOServer, Socket } from "socket.io";
import { GameService } from "../services/index.js";
import type { WordAttempt } from "../../../shared/src/types.js";

export class GameController {
  constructor(private io: SocketIOServer) {
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      socket.on(
        "join-room",
        async (roomId: string, playerData: { nickname: string }) => {
          try {
            await this.handleJoinRoom(socket, roomId, playerData);
          } catch (error) {
            console.error("Error joining room:", error);
            socket.emit("error", "Failed to join room");
          }
        },
      );

      socket.on("leave-room", async (roomId: string) => {
        try {
          await this.handleLeaveRoom(socket, roomId);
        } catch (error) {
          console.error("Error leaving room:", error);
        }
      });

      socket.on("word-attempt", async (attempt: WordAttempt) => {
        try {
          await this.handleWordAttempt(socket, attempt);
        } catch (error) {
          console.error("Error processing word attempt:", error);
          socket.emit("error", "Failed to process word attempt");
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        this.handleDisconnect(socket);
      });
    });
  }

  private async handleJoinRoom(
    socket: Socket,
    roomId: string,
    playerData: { nickname: string },
  ): Promise<void> {
    // Add player to room
    const player = await GameService.addPlayerToRoom(
      roomId,
      socket.id,
      playerData.nickname,
    );

    // Join socket room
    socket.join(roomId);

    // Store room info in socket
    socket.data.roomId = roomId;
    socket.data.playerId = socket.id;

    // Get room data
    const room = GameService.getRoom(roomId);
    if (!room) {
      socket.emit("error", "Room not found");
      return;
    }

    // Send current game state to new player
    socket.emit("player-joined", player.toJSON());
    socket.emit("board-updated", room.board);
    socket.emit("ranking-updated", GameService.getRoomRanking(roomId));
    socket.emit("game-stats", GameService.getRoomStats(roomId));

    // Notify other players
    socket.to(roomId).emit("player-joined", player.toJSON());
    socket
      .to(roomId)
      .emit("ranking-updated", GameService.getRoomRanking(roomId));
    socket.to(roomId).emit("game-stats", GameService.getRoomStats(roomId));

    console.log(
      `User ${socket.id} (${playerData.nickname}) joined room ${roomId}`,
    );
  }

  private async handleLeaveRoom(socket: Socket, roomId: string): Promise<void> {
    socket.leave(roomId);

    await GameService.removePlayerFromRoom(roomId, socket.id);

    // Notify other players
    socket.to(roomId).emit("player-left", socket.id);
    socket
      .to(roomId)
      .emit("ranking-updated", GameService.getRoomRanking(roomId));
    socket.to(roomId).emit("game-stats", GameService.getRoomStats(roomId));

    // Clear socket data
    delete socket.data.roomId;
    delete socket.data.playerId;

    console.log(`User ${socket.id} left room ${roomId}`);
  }

  private async handleWordAttempt(
    socket: Socket,
    attempt: WordAttempt,
  ): Promise<void> {
    const roomId = socket.data.roomId;
    if (!roomId) {
      socket.emit("error", "Not in a room");
      return;
    }

    // Ensure the attempt is from the correct player
    attempt.playerId = socket.id;

    const result = await GameService.processWordAttempt(roomId, attempt);

    if (result.success && result.foundWord) {
      // Broadcast word found to all players in room
      this.io.to(roomId).emit("word-found", result.foundWord);
      this.io
        .to(roomId)
        .emit("ranking-updated", GameService.getRoomRanking(roomId));
      this.io.to(roomId).emit("game-stats", GameService.getRoomStats(roomId));

      console.log(
        `Word "${result.foundWord.word}" found by ${result.foundWord.playerNickname} in room ${roomId}`,
      );
    } else {
      socket.emit("error", result.error || "Word not found");
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    const roomId = socket.data.roomId;
    if (roomId) {
      await GameService.removePlayerFromRoom(roomId, socket.id);

      // Notify other players
      socket.to(roomId).emit("player-left", socket.id);
      socket
        .to(roomId)
        .emit("ranking-updated", GameService.getRoomRanking(roomId));
      socket.to(roomId).emit("game-stats", GameService.getRoomStats(roomId));
    }
  }
}

