import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import GameHeader from './GameHeader';
import { MEMORY_THEMES, MemoryCard, generateCards, MemoryTheme } from '../lib/memory';
import { saveProgress } from '../lib/storage';
import { getMemoryGameConfig } from '../lib/gameConfig';
import { VICTORY_PHRASES, Difficulty } from '../lib/phrases';

interface MemoryGameProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ difficulty, onBack }) => {
    const config = getMemoryGameConfig(difficulty);
    const [currentTheme, setCurrentTheme] = useState<MemoryTheme>(MEMORY_THEMES[0]);
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isWon, setIsWon] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const randomTheme = MEMORY_THEMES[Math.floor(Math.random() * MEMORY_THEMES.length)];
        setCurrentTheme(randomTheme);
        const pairs = Math.floor((config.rows * config.cols) / 2);
        setCards(generateCards(randomTheme.id, pairs));
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
                }, config.mismatchDelay);
            }
        }
    };

    const isFlipped = (index: number) => flippedIndices.includes(index) || cards[index].isMatched;

    return (
        <div className="flex flex-col gap-6 w-full h-full relative">
            <GameHeader
                title="Memória"
                subtitle={currentTheme.name}
                onBack={onBack}
            />

            {/* Grid Area - Taking as much space as possible */}
            <div className="flex-1 flex items-center justify-center p-2 bg-slate-50 rounded-[40px] shadow-inner border-2 border-slate-200/50">
                <div
                    className="grid gap-1.5 w-full max-w-2xl justify-center"
                    style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
                >
                    {cards.map((card, index) => {
                        const Icon = currentTheme.icons[card.iconIndex];
                        // Dynamic icon size based on grid density
                        const iconSize = config.cols > 8 ? "w-6 h-6 sm:w-8 sm:h-8" :
                            config.cols > 5 ? "w-8 h-8 sm:w-10 sm:h-10" :
                                "w-12 h-12 sm:w-14 sm:h-14";

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
                                        <Icon className={`${iconSize} ${card.isMatched ? 'text-green-600' : 'text-primary'}`} strokeWidth={3} />
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
