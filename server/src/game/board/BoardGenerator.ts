import type {
  LetterGrid,
  WordPlacement,
} from "../../../../shared/src/types.js";

export class BoardGenerator {
  private static readonly DIRECTIONS = [
    { dx: 1, dy: 0, name: "horizontal" as const },
    { dx: 0, dy: 1, name: "vertical" as const },
    { dx: 1, dy: 1, name: "diagonal-down" as const },
    { dx: 1, dy: -1, name: "diagonal-up" as const },
  ];

  static generate(
    width: number,
    height: number,
    words: string[],
  ): { board: LetterGrid; placements: WordPlacement[] } {
    const board: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(""));
    const placements: WordPlacement[] = [];

    // Place words
    for (const word of words) {
      const placement = this.placeWord(board, word, width, height);
      if (placement) {
        placements.push(placement);
      }
    }

    // Fill empty cells with random letters
    this.fillEmptyCells(board, width, height);

    return {
      board: { width, height, cells: board },
      placements,
    };
  }

  private static placeWord(
    board: string[][],
    word: string,
    width: number,
    height: number,
  ): WordPlacement | null {
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const direction =
        this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
      const startX = Math.floor(Math.random() * width);
      const startY = Math.floor(Math.random() * height);

      if (
        this.canPlaceWord(
          board,
          word,
          startX,
          startY,
          direction.dx,
          direction.dy,
          width,
          height,
        )
      ) {
        this.placeWordOnBoard(
          board,
          word,
          startX,
          startY,
          direction.dx,
          direction.dy,
        );
        return {
          word,
          startX,
          startY,
          direction: direction.name,
        };
      }
    }

    return null;
  }

  private static canPlaceWord(
    board: string[][],
    word: string,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    width: number,
    height: number,
  ): boolean {
    const endX = startX + (word.length - 1) * dx;
    const endY = startY + (word.length - 1) * dy;

    // Check bounds
    if (endX < 0 || endX >= width || endY < 0 || endY >= height) {
      return false;
    }

    // Check if cells are empty or contain the same letter
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      const currentLetter = board[y][x];

      if (currentLetter !== "" && currentLetter !== word[i].toUpperCase()) {
        return false;
      }
    }

    return true;
  }

  private static placeWordOnBoard(
    board: string[][],
    word: string,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
  ): void {
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      board[y][x] = word[i].toUpperCase();
    }
  }

  private static fillEmptyCells(
    board: string[][],
    width: number,
    height: number,
  ): void {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (board[y][x] === "") {
          board[y][x] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  static generateWordList(count: number): string[] {
    // Sample word list - in production, this would come from a proper dictionary
    const words = [
      "JAVASCRIPT",
      "PYTHON",
      "REACT",
      "NODE",
      "EXPRESS",
      "MONGODB",
      "MYSQL",
      "HTML",
      "CSS",
      "TYPESCRIPT",
      "ANGULAR",
      "VUE",
      "SVELTE",
      "NEXT",
      "WEBPACK",
      "VITE",
      "ESLINT",
      "PRETTIER",
      "JEST",
      "CYPRESS",
      "DOCKER",
      "KUBERNETES",
      "AWS",
      "AZURE",
      "GCP",
      "NGINX",
      "REDIS",
      "POSTGRESQL",
      "FIREBASE",
      "GRAPHQL",
      "REST",
      "API",
      "JWT",
      "OAUTH",
      "GIT",
      "GITHUB",
      "GITLAB",
      "BITBUCKET",
      "CI",
      "CD",
      "DEVOPS",
      "ALGORITHM",
      "DATABASE",
      "FRONTEND",
      "BACKEND",
      "FULLSTACK",
      "RESPONSIVE",
      "MOBILE",
      "DESKTOP",
      "WEB",
      "APP",
      "FRAMEWORK",
      "LIBRARY",
      "PACKAGE",
      "MODULE",
      "COMPONENT",
      "FUNCTION",
      "CLASS",
      "OBJECT",
      "ARRAY",
      "STRING",
      "NUMBER",
      "BOOLEAN",
      "VARIABLE",
    ];

    // Shuffle and take random words
    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, words.length));
  }
}

