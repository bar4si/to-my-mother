import { Difficulty } from './phrases';

export interface GameProgress {
    completedCategories: string[];
    totalWins: number;
    score: number;
    preferredDifficulty: Difficulty | null;
}

const STORAGE_KEY = 'to_my_mother_progress';

export const saveProgress = (categoryId: string, points: number = 10) => {
    const current = getProgress();
    if (!current.completedCategories.includes(categoryId)) {
        current.completedCategories.push(categoryId);
    }
    current.totalWins += 1;
    current.score += points;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const saveDifficulty = (difficulty: Difficulty) => {
    const current = getProgress();
    current.preferredDifficulty = difficulty;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const getProgress = (): GameProgress => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
        completedCategories: [],
        totalWins: 0,
        score: 0,
        preferredDifficulty: null
    };
};
