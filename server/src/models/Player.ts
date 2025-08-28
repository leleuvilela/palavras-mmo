import type { Player as PlayerType } from "../../../shared/src/types.js";

export class Player implements PlayerType {
  constructor(
    public id: string,
    public nickname: string,
    public roomId: string,
    public color: string,
    public score: number = 0,
    public connectedAt: Date = new Date(),
  ) {}

  addScore(points: number): void {
    this.score += points;
  }

  toJSON(): PlayerType {
    return {
      id: this.id,
      nickname: this.nickname,
      roomId: this.roomId,
      color: this.color,
      score: this.score,
      connectedAt: this.connectedAt,
    };
  }

  static generateColor(playerId: string): string {
    const colors = [
      "#ef4444",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#f97316",
      "#06b6d4",
      "#84cc16",
    ];
    const hash = playerId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}

