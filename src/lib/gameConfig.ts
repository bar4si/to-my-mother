import { Difficulty } from './phrases';
import {
    WORD_SEARCH_DIFFICULTIES,
    MEMORY_GAME_DIFFICULTIES,
    FIGURE_FIND_DIFFICULTIES,
    HANGMAN_DIFFICULTIES,
    MATCH_THREE_DIFFICULTIES
} from './difficultyParams';

export interface WordSearchConfig {
    rows: number;
    cols: number;
    wordsPerGame: number;
    allowDiagonals: boolean;
    allowReversed: boolean;
    diagonalProbability: number;
    reverseProbability: number;
}

export interface MemoryGameConfig {
    rows: number;
    cols: number;
    flipDuration: number; // ms
    mismatchDelay: number; // ms
}

export interface FigureFindConfig {
    itemCount: number;
    gridMode: boolean;
    columns?: number;
    overlap: boolean;
    rotationEnabled: boolean;
    allowDistractorDuplicates: boolean;
}

export interface HangmanConfig {
    maxErrors: number;
    showDicaChance: number;
    wordMinLength: number;
    wordMaxLength: number;
    allowHints: boolean;
}

export interface MatchThreeConfig {
    rows: number;
    cols: number;
    moves: number;
    targetScore: number;
    itemTypes: number; // Quantidade de tipos de itens diferentes
}

/**
 * Get the specific config for a game based on difficulty
 */
export const getWordSearchConfig = (difficulty: Difficulty) => WORD_SEARCH_DIFFICULTIES[difficulty];
export const getMemoryGameConfig = (difficulty: Difficulty) => MEMORY_GAME_DIFFICULTIES[difficulty];
export const getFigureFindConfig = (difficulty: Difficulty) => FIGURE_FIND_DIFFICULTIES[difficulty];
export const getHangmanConfig = (difficulty: Difficulty) => HANGMAN_DIFFICULTIES[difficulty];
export const getMatchThreeConfig = (difficulty: Difficulty) => MATCH_THREE_DIFFICULTIES[difficulty];
