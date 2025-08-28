import type {
  WordAttempt,
  LetterGrid,
  WordPlacement,
} from "../../../../shared/src/types.js";

export class WordValidator {
  static validateAttempt(
    attempt: WordAttempt,
    board: LetterGrid,
    validWords: WordPlacement[],
  ): { isValid: boolean; word?: string; points?: number } {
    const { startX, startY, endX, endY, selectedLetters } = attempt;

    // Check if selection is within bounds
    if (
      !this.isWithinBounds(
        startX,
        startY,
        endX,
        endY,
        board.width,
        board.height,
      )
    ) {
      return { isValid: false };
    }

    // Check if selection is a valid direction (horizontal, vertical, or diagonal)
    if (!this.isValidDirection(startX, startY, endX, endY)) {
      return { isValid: false };
    }

    // Extract letters from the board
    const actualLetters = this.getLettersFromBoard(
      board,
      startX,
      startY,
      endX,
      endY,
    );

    // Check if selected letters match board letters
    if (actualLetters !== selectedLetters.toUpperCase()) {
      return { isValid: false };
    }

    // Check if it matches any valid word
    const matchingWord = this.findMatchingWord(
      validWords,
      startX,
      startY,
      endX,
      endY,
      actualLetters,
    );

    if (matchingWord) {
      const points = this.calculatePoints(actualLetters);
      return {
        isValid: true,
        word: matchingWord.word,
        points,
      };
    }

    return { isValid: false };
  }

  private static isWithinBounds(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    height: number,
  ): boolean {
    return (
      startX >= 0 &&
      startX < width &&
      startY >= 0 &&
      startY < height &&
      endX >= 0 &&
      endX < width &&
      endY >= 0 &&
      endY < height
    );
  }

  private static isValidDirection(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): boolean {
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    // Must be horizontal, vertical, or diagonal
    return deltaX === 0 || deltaY === 0 || deltaX === deltaY;
  }

  private static getLettersFromBoard(
    board: LetterGrid,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): string {
    const letters: string[] = [];
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    if (steps === 0) {
      return board.cells[startY][startX];
    }

    const stepX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
    const stepY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);

    for (let i = 0; i <= steps; i++) {
      const x = startX + Math.round(stepX * i);
      const y = startY + Math.round(stepY * i);
      letters.push(board.cells[y][x]);
    }

    return letters.join("");
  }

  private static findMatchingWord(
    validWords: WordPlacement[],
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    letters: string,
  ): WordPlacement | null {
    return (
      validWords.find((word) => {
        // Check if positions match
        const wordEndX = this.getWordEndX(word);
        const wordEndY = this.getWordEndY(word);

        const forwardMatch =
          word.startX === startX &&
          word.startY === startY &&
          wordEndX === endX &&
          wordEndY === endY &&
          word.word.toUpperCase() === letters;

        const backwardMatch =
          word.startX === endX &&
          word.startY === endY &&
          wordEndX === startX &&
          wordEndY === startY &&
          word.word.toUpperCase() === letters.split("").reverse().join("");

        return forwardMatch || backwardMatch;
      }) || null
    );
  }

  private static getWordEndX(word: WordPlacement): number {
    switch (word.direction) {
      case "horizontal":
      case "diagonal-down":
      case "diagonal-up":
        return word.startX + word.word.length - 1;
      default:
        return word.startX;
    }
  }

  private static getWordEndY(word: WordPlacement): number {
    switch (word.direction) {
      case "vertical":
      case "diagonal-down":
        return word.startY + word.word.length - 1;
      case "diagonal-up":
        return word.startY - word.word.length + 1;
      default:
        return word.startY;
    }
  }

  private static calculatePoints(word: string): number {
    const basePoints = word.length * 10;
    const lengthBonus = word.length > 5 ? (word.length - 5) * 5 : 0;
    return basePoints + lengthBonus;
  }
}

