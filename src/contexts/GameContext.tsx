import React, { createContext, useContext, useState } from 'react';
import { GameProgress, getProgress, saveProgress as storageSaveProgress, saveDifficulty as storageSaveDifficulty, updateCelebratedLevel as storageUpdateCelebratedLevel } from '../lib/storage';
import { Difficulty } from '../lib/phrases';

interface GameContextType {
    progress: GameProgress;
    updateScore: (categoryId: string, points: number) => void;
    setDifficulty: (difficulty: Difficulty) => void;
    markLevelCelebrated: (level: number) => void;
    refreshProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState<GameProgress>(getProgress());

    const refreshProgress = () => {
        setProgress(getProgress());
    };

    const updateScore = (categoryId: string, points: number) => {
        storageSaveProgress(categoryId, points);
        refreshProgress();
    };

    const setDifficulty = (difficulty: Difficulty) => {
        storageSaveDifficulty(difficulty);
        refreshProgress();
    };

    const markLevelCelebrated = (level: number) => {
        storageUpdateCelebratedLevel(level);
        refreshProgress();
    };

    return (
        <GameContext.Provider value={{ progress, updateScore, setDifficulty, markLevelCelebrated, refreshProgress }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
