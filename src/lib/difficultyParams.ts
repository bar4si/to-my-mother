import { Difficulty } from './phrases';
import { WordSearchConfig, MemoryGameConfig, FigureFindConfig, HangmanConfig } from './gameConfig';

export const WORD_SEARCH_DIFFICULTIES: Record<Difficulty, WordSearchConfig> = {
    FACIL: {
        rows: 6,
        cols: 6,
        wordsPerGame: 3, // Menos palavras para não cansar
        allowDiagonals: false,
        allowReversed: false,
        diagonalProbability: 0,
        reverseProbability: 0
    },
    MEDIO: {
        rows: 8, // Reduzido de 10 para 8 para manter letras maiores no celular
        cols: 7,
        wordsPerGame: 4,
        allowDiagonals: true,
        allowReversed: false,
        diagonalProbability: 0.3,
        reverseProbability: 0
    },
    DIFICIL: {
        rows: 10, // Reduzido de 12 para 10 para garantir legibilidade
        cols: 8,
        wordsPerGame: 5,
        allowDiagonals: true,
        allowReversed: true,
        diagonalProbability: 0.4,
        reverseProbability: 0.3
    }
};

export const MEMORY_GAME_DIFFICULTIES: Record<Difficulty, MemoryGameConfig> = {
    FACIL: {
        rows: 4,
        cols: 3, // 12 cartas (6 pares) - mais amigável que 16
        flipDuration: 400,
        mismatchDelay: 2000
    },
    MEDIO: {
        rows: 4,
        cols: 5, // 20 cartas (10 pares) - salto equilibrado
        flipDuration: 400,
        mismatchDelay: 1500
    },
    DIFICIL: {
        rows: 6,
        cols: 6, // 36 cartas (18 pares) - limite de conforto visual no celular
        flipDuration: 400,
        mismatchDelay: 1000
    }
};

export const FIGURE_FIND_DIFFICULTIES: Record<Difficulty, FigureFindConfig> = {
    FACIL: {
        itemCount: 8,
        gridMode: true,
        columns: 2,
        overlap: false,
        rotationEnabled: false,
        allowDistractorDuplicates: true
    },
    MEDIO: {
        itemCount: 15,
        gridMode: false,
        overlap: false,
        rotationEnabled: false,
        allowDistractorDuplicates: false
    },
    DIFICIL: {
        itemCount: 25, // Reduzido de 45 para 25 para evitar poluição visual excessiva
        gridMode: false,
        overlap: true,
        rotationEnabled: true,
        allowDistractorDuplicates: false
    }
};

export const HANGMAN_DIFFICULTIES: Record<Difficulty, HangmanConfig> = {
    FACIL: {
        maxErrors: 8,
        showDicaChance: 1.0,
        wordMinLength: 3,
        wordMaxLength: 5,
        allowHints: true
    },
    MEDIO: {
        maxErrors: 7, // Mantido 7 para as 7 pétalas da flor
        showDicaChance: 0.7,
        wordMinLength: 5,
        wordMaxLength: 8,
        allowHints: true
    },
    DIFICIL: {
        maxErrors: 6,
        showDicaChance: 0.4,
        wordMinLength: 8,
        wordMaxLength: 12,
        allowHints: true // Permitir dicas sempre, mas com chance reduzida de aparecer automático
    }
};
