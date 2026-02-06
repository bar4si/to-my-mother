import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, Star } from 'lucide-react';
import { MEMORY_THEMES, MemoryCard, generateCards, MemoryTheme } from '../lib/memory';
import { saveProgress } from '../lib/storage';
import { VICTORY_PHRASES, Difficulty } from '../lib/phrases';

interface MemoryGameProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ difficulty, onBack }) => {
    const [currentTheme, setCurrentTheme] = useState<MemoryTheme>(MEMORY_THEMES[0]);
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isWon, setIsWon] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const getGameConfig = () => {
        switch (difficulty) {
            case 'FACIL': return { pairs: 4, time: 2000 };
            case 'DIFICIL': return { pairs: 8, time: 800 };
            default: return { pairs: 6, time: 1200 };
        }
    };

    const config = getGameConfig();

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const randomTheme = MEMORY_THEMES[Math.floor(Math.random() * MEMORY_THEMES.length)];
        setCurrentTheme(randomTheme);
        setCards(generateCards(randomTheme.id, config.pairs));
        setFlippedIndices([]);
        setIsWon(false);
        setIsProcessing(false);
    };

    const handleCardClick = (index: number) => {
        if (isProcessing || flippedIndices.includes(index) || cards[index].isMatched || flippedIndices.length === 2) {
            return;
        }

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            const [firstIndex, secondIndex] = newFlipped;

            if (cards[firstIndex].iconIndex === cards[secondIndex].iconIndex) {
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map((card, i) =>
                        (i === firstIndex || i === secondIndex) ? { ...card, isMatched: true } : card
                    ));
                    setFlippedIndices([]);
                    setIsProcessing(false);

                    // Check win
                    const allMatched = cards.every((card, i) =>
                        (i === firstIndex || i === secondIndex) ? true : card.isMatched
                    );
                    if (allMatched) {
                        setIsWon(true);
                        setVictoryMessage(VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)]);
                        saveProgress('memory-' + currentTheme.id, difficulty === 'FACIL' ? 1 : difficulty === 'MEDIO' ? 5 : 10);
                    }
                }, 600);
            } else {
                // Mismatch
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsProcessing(false);
                }, config.time);
            }
        }
    };

    const isFlipped = (index: number) => flippedIndices.includes(index) || cards[index].isMatched;

    return (
        <div className="flex flex-col gap-6 w-full h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-100 -mx-8 -mt-8 p-6 border-b-2 border-slate-200 mb-2">
                <button onClick={onBack} className="hit-target p-2 bg-white rounded-2xl shadow-md border border-slate-200 active:scale-95 transition-all">
                    <ChevronLeft className="w-8 h-8 text-primary" />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-black text-primary leading-tight uppercase tracking-tight">Memória</h2>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-600 font-extrabold">{currentTheme.name}</span>
                </div>
                <button onClick={initGame} className="hit-target p-2 bg-white rounded-2xl shadow-md border border-slate-200 active:scale-95 transition-all">
                    <RotateCcw className="w-8 h-8 text-primary" />
                </button>
            </div>

            {/* Grid Area - Taking as much space as possible */}
            <div className="flex-1 flex items-center justify-center p-2 bg-slate-50 rounded-[40px] shadow-inner border-2 border-slate-200/50">
                <div className="grid grid-cols-4 gap-2.5 w-full max-w-sm justify-center">
                    {cards.map((card, index) => {
                        const Icon = currentTheme.icons[card.iconIndex];
                        return (
                            <motion.div
                                key={card.id}
                                layout
                                onClick={() => handleCardClick(index)}
                                className="relative aspect-square perspective-1000"
                            >
                                <motion.div
                                    animate={{ rotateY: isFlipped(index) ? 180 : 0 }}
                                    transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                                    className="w-full h-full relative preserve-3d cursor-pointer"
                                >
                                    {/* Card Back (Active State) */}
                                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-md border-2 border-slate-200 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center">
                                            <Star className="w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>

                                    {/* Card Front (Revealed State) */}
                                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-lg border-4 border-primary/20 flex items-center justify-center rotate-y-180"
                                        style={{ transform: 'rotateY(180deg)' }}>
                                        <Icon className={`w-14 h-14 ${card.isMatched ? 'text-green-600' : 'text-primary'}`} strokeWidth={3} />
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Victory Modal Overlay */}
            <AnimatePresence>
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-primary/95 z-[100] flex items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[48px] p-10 shadow-2xl border-4 border-accent max-w-xs w-full"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star className="w-12 h-12 text-green-600" fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black text-primary mb-4 leading-tight">
                                {victoryMessage}
                            </h2>
                            <p className="text-slate-600 font-bold mb-8">
                                Você encontrou todos os pares do {currentTheme.name.toLowerCase()}!
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={initGame}
                                    className="hit-target w-full bg-primary text-white rounded-3xl py-4 font-black text-xl shadow-lg active:scale-95 transition-all"
                                >
                                    Jogar de Novo
                                </button>
                                <button
                                    onClick={onBack}
                                    className="hit-target w-full bg-slate-100 text-slate-700 rounded-3xl py-4 font-black text-lg active:scale-95 transition-all"
                                >
                                    Voltar ao Menu
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemoryGame;
