import { useEffect, useCallback } from "react";
import { socketService } from "../services/index.js";
import { useGameStore } from "../stores/index.js";

export const useSocket = () => {
  const {
    setConnectionState,
    addPlayer,
    removePlayer,
    addFoundWord,
    updateRanking,
    setBoard,
    updateGameStats,
  } = useGameStore();

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => {
      setConnectionState(true);
    };

    const handleDisconnect = () => {
      setConnectionState(false);
    };

    const handleConnectError = (error: any) => {
      setConnectionState(false, error.message || "Connection failed");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socketService.onPlayerJoined(addPlayer);
    socketService.onPlayerLeft(removePlayer);
    socketService.onWordFound(addFoundWord);
    socketService.onRankingUpdated(updateRanking);
    socketService.onBoardUpdated(setBoard);
    socketService.onGameStats(updateGameStats);

    socketService.onError((error) => {
      console.error("Socket error:", error);
      setConnectionState(false, error);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socketService.disconnect();
    };
  }, [
    setConnectionState,
    addPlayer,
    removePlayer,
    addFoundWord,
    updateRanking,
    setBoard,
    updateGameStats,
  ]);

  const joinRoom = useCallback((roomId: string, nickname: string) => {
    socketService.joinRoom(roomId, { nickname });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketService.leaveRoom(roomId);
  }, []);

  const submitWordAttempt = useCallback((attempt: any) => {
    socketService.submitWordAttempt(attempt);
  }, []);

  return {
    isConnected: socketService.isConnected,
    joinRoom,
    leaveRoom,
    submitWordAttempt,
  };
};

