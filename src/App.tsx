import { useState } from 'react'
import WordSearch from './components/WordSearch'
import GameMenu from './components/GameMenu'
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <header className="mb-6 text-center">
                <h1 className="mb-1 text-4xl font-black text-primary">Para Mamãe</h1>
                <p className="text-slate-700 italic font-bold">Momentos de alegria e diversão</p>
            </header>

            <main className="w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden p-8 border border-accent">
                {currentGame === 'wordsearch' && progress.preferredDifficulty ? (
                    <WordSearch
                        difficulty={progress.preferredDifficulty}
                        onBack={() => {
                            setCurrentGame(null);
                            refreshProgress();
                        }}
                    />
                ) : (
                    <GameMenu
                        progress={progress}
                        onSelectGame={handleSelectGame}
                        onSetDifficulty={handleSetDifficulty}
                    />
                )}
            </main>

            <footer className="mt-10 text-[10px] opacity-40 uppercase tracking-[0.2em] font-black text-slate-500">
                Criado com todo amor do mundo • 2026
            </footer>
        </div>
    )
}

export default App
