import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WordSearch from './components/game/WordSearch'
import MemoryGame from './components/game/MemoryGame'
import Hangman from './components/game/Hangman'
import FigureFind from './components/game/FigureFind'
import GameMenu from './components/features/GameMenu'
import { getProgress, saveDifficulty, GameProgress } from './lib/storage'
import { Difficulty } from './lib/phrases'

function App() {
    const [currentGame, setCurrentGame] = useState<string | null>(null)
    const [progress, setProgress] = useState<GameProgress>(getProgress())

    // Update progress state when returning to menu
    const refreshProgress = () => {
        setProgress(getProgress());
    }

    const handleSetDifficulty = (diff: Difficulty) => {
        saveDifficulty(diff);
        refreshProgress();
    }

    const handleSelectGame = (gameId: string) => {
        if (!progress.preferredDifficulty) {
            alert("Por favor, selecione um nível antes de começar!");
            return;
        }
        setCurrentGame(gameId);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <motion.main
                layout
                className="w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden p-8 border border-accent relative"
            >
                <AnimatePresence mode="wait">
                    {currentGame === 'wordsearch' && progress.preferredDifficulty ? (
                        <motion.div
                            key="wordsearch"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <WordSearch
                                difficulty={progress.preferredDifficulty}
                                onBack={() => {
                                    setCurrentGame(null);
                                    refreshProgress();
                                }}
                            />
                        </motion.div>
                    ) : currentGame === 'memory' && progress.preferredDifficulty ? (
                        <motion.div
                            key="memory"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <MemoryGame
                                difficulty={progress.preferredDifficulty}
                                onBack={() => {
                                    setCurrentGame(null);
                                    refreshProgress();
                                }}
                            />
                        </motion.div>
                    ) : currentGame === 'hangman' && progress.preferredDifficulty ? (
                        <motion.div
                            key="hangman"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Hangman
                                difficulty={progress.preferredDifficulty}
                                onBack={() => {
                                    setCurrentGame(null);
                                    refreshProgress();
                                }}
                            />
                        </motion.div>
                    ) : currentGame === 'figures' && progress.preferredDifficulty ? (
                        <motion.div
                            key="figures"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <FigureFind
                                difficulty={progress.preferredDifficulty}
                                onBack={() => {
                                    setCurrentGame(null);
                                    refreshProgress();
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <GameMenu
                                progress={progress}
                                onSelectGame={handleSelectGame}
                                onSetDifficulty={handleSetDifficulty}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>

            <AnimatePresence>
                {!currentGame && (
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="mt-10 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500"
                    >
                        Criado com todo amor do mundo • 2026
                    </motion.footer>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
