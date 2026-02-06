import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import WordSearch from './components/game/WordSearch'
import MemoryGame from './components/game/MemoryGame'
import Hangman from './components/game/Hangman'
import FigureFind from './components/game/FigureFind'
import MatchThree from './components/game/MatchThree'
import GameMenu from './components/features/GameMenu'
import { GameProvider } from './contexts/GameContext'

function AppContent() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <motion.main
                layout
                className="w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden p-8 border border-accent relative"
            >
                <Routes>
                    <Route path="/" element={<GameMenu />} />
                    <Route path="/game/word-search" element={<WordSearch />} />
                    <Route path="/game/memory-game" element={<MemoryGame />} />
                    <Route path="/game/hangman" element={<Hangman />} />
                    <Route path="/game/figure-find" element={<FigureFind />} />
                    <Route path="/game/match-three" element={<MatchThree />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </motion.main>

            {location.pathname === '/' && (
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="mt-10 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500"
                >
                    Criado com todo amor do mundo • 2026
                </motion.footer>
            )}
        </div>
    )
}

function App() {
    return (
        <GameProvider>
            <Router>
                <AppContent />
            </Router>
        </GameProvider>
    )
}

export default App
