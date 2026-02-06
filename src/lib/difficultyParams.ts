import { Difficulty } from './phrases';
import { WordSearchConfig, MemoryGameConfig, FigureFindConfig, HangmanConfig } from './gameConfig';

export const WORD_SEARCH_DIFFICULTIES: Record<Difficulty, WordSearchConfig> = {
    FACIL: {
        rows: 8,
        cols: 8,
        wordsPerGame: 4,
        allowDiagonals: false,
        allowReversed: false,
        diagonalProbability: 0,
        reverseProbability: 0
    },
    MEDIO: {
        rows: 10,
        cols: 8,
        wordsPerGame: 5,
        allowDiagonals: true,
        allowReversed: false,
        diagonalProbability: 0.5,
        reverseProbability: 0.5
    },
    DIFICIL: {
        rows: 12,
        cols: 8,
        wordsPerGame: 6,
        allowDiagonals: true,
        allowReversed: true,
        diagonalProbability: 0.6,
        reverseProbability: 0.6
    }
};

export const MEMORY_GAME_DIFFICULTIES: Record<Difficulty, MemoryGameConfig> = {
    FACIL: {
        rows: 4,
        cols: 4,
        flipDuration: 400,
        mismatchDelay: 2000
    },
    MEDIO: {
        rows: 6,
        cols: 6,
        flipDuration: 400,
        mismatchDelay: 1200
    },
    DIFICIL: {
        rows: 8,
        cols: 8,
        flipDuration: 400,
        mismatchDelay: 800
    }
};

export const FIGURE_FIND_DIFFICULTIES: Record<Difficulty, FigureFindConfig> = {
    FACIL: {
        itemCount: 9,
        gridMode: true,
        columns: 3,
        overlap: false,
        rotationEnabled: false
    },
    MEDIO: {
        itemCount: 20,
        gridMode: false,
        overlap: false,
        rotationEnabled: false
    },
    DIFICIL: {
        itemCount: 45,
        gridMode: false,
        overlap: true,
        rotationEnabled: true
    }
};

export const HANGMAN_DIFFICULTIES: Record<Difficulty, HangmanConfig> = {
    FACIL: {
        maxErrors: 8,
        showDicaChance: 1.0,
        wordMinLength: 3,
        wordMaxLength: 6,
        allowHints: true
    },
    MEDIO: {
        maxErrors: 6,
        showDicaChance: 0.5,
        wordMinLength: 6,
        wordMaxLength: 9,
        allowHints: true
    },
    DIFICIL: {
        maxErrors: 5,
        showDicaChance: 0.2,
        wordMinLength: 9,
        wordMaxLength: 15,
        allowHints: false
    }
};
