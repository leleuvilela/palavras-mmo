import type {
  GameRoom as GameRoomType,
  LetterGrid,
  WordPlacement,
  FoundWord,
  GameStats,
} from "../../../shared/src/types.js";
import { Player } from "./Player.js";

export class GameRoom implements Omit<GameRoomType, "players"> {
  public players: Map<string, Player> = new Map();

  constructor(
    public id: string,
    public board: LetterGrid,
    public words: WordPlacement[],
    public foundWords: FoundWord[] = [],
    public createdAt: Date = new Date(),
    public isActive: boolean = true,
  ) {}

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  addFoundWord(foundWord: FoundWord): void {
    this.foundWords.push(foundWord);
    const player = this.getPlayer(foundWord.playerId);
    if (player) {
      player.addScore(foundWord.points);
    }
  }

  getStats(): GameStats {
    return {
      totalWords: this.words.length,
      foundWords: this.foundWords.length,
      totalPlayers: this.players.size,
      activePlayers: this.players.size, // All connected players are active
      completionPercentage: Math.round(
        (this.foundWords.length / this.words.length) * 100,
      ),
    };
  }

  getRanking() {
    return Array.from(this.players.values())
      .map((player, index) => ({
        playerId: player.id,
        nickname: player.nickname,
        score: player.score,
        wordsFound: this.foundWords.filter((w) => w.playerId === player.id)
          .length,
        rank: index + 1,
      }))
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  isWordFound(word: string): boolean {
    return this.foundWords.some(
      (fw) => fw.word.toLowerCase() === word.toLowerCase(),
    );
  }

  toJSON(): GameRoomType {
    return {
      id: this.id,
      board: this.board,
      words: this.words,
      foundWords: this.foundWords,
      players: Array.from(this.players.values()).map((p) => p.toJSON()),
      createdAt: this.createdAt,
      isActive: this.isActive,
    };
  }
}

