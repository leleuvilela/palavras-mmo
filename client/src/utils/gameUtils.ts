import { GAME_CONFIG } from '../constants/index.js';

export const generatePlayerColor = (playerId: string): string => {
  const colors = GAME_CONFIG.PLAYER.COLORS;
  const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const calculateWordPoints = (word: string): number => {
  const basePoints = word.length * 10;
  const lengthBonus = word.length > 5 ? (word.length - 5) * 5 : 0;
  return basePoints + lengthBonus;
};

export const isValidWordSelection = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  boardWidth: number,
  boardHeight: number
): boolean => {
  // Check bounds
  if (startX < 0 || startX >= boardWidth || startY < 0 || startY >= boardHeight) {
    return false;
  }
  if (endX < 0 || endX >= boardWidth || endY < 0 || endY >= boardHeight) {
    return false;
  }

  const deltaX = Math.abs(endX - startX);
  const deltaY = Math.abs(endY - startY);

  // Must be horizontal, vertical, or diagonal
  return deltaX === 0 || deltaY === 0 || deltaX === deltaY;
};

export const getSelectedLetters = (
  board: string[][],
  startX: number,
  startY: number,
  endX: number,
  endY: number
): string => {
  const letters: string[] = [];
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  if (steps === 0) {
    return board[startY][startX];
  }

  const stepX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
  const stepY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);

  for (let i = 0; i <= steps; i++) {
    const x = startX + Math.round(stepX * i);
    const y = startY + Math.round(stepY * i);
    letters.push(board[y][x]);
  }

  return letters.join('');
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};