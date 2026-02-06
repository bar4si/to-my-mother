import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Star, Lightbulb, Flower2 } from 'lucide-react';
import GameHeader from './GameHeader';
import GameModal from './GameModal';
import { HANGMAN_CATEGORIES, getRandomCategory, getRandomWord, HangmanCategory } from '../lib/hangman';
import { saveProgress } from '../lib/storage';
import { getHangmanConfig } from '../lib/gameConfig';
import { VICTORY_PHRASES, Difficulty } from '../lib/phrases';

interface HangmanProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Hangman: React.FC<HangmanProps> = ({ difficulty, onBack }) => {
    const config = getHangmanConfig(difficulty);
    const [category, setCategory] = useState<HangmanCategory>(HANGMAN_CATEGORIES[0]);
    const [wordData, setWordData] = useState({ term: "", hint: "" });
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [errors, setErrors] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const randomCategory = getRandomCategory();
        setCategory(randomCategory);

        // Filter words based on difficulty length constraints
        const suitableWords = randomCategory.words.filter(w =>
            w.term.length >= config.wordMinLength &&
            w.term.length <= config.wordMaxLength
        );

        // Fallback to any word if none match (shouldn't happen with current data)
        const selectedWord = suitableWords.length > 0
            ? suitableWords[Math.floor(Math.random() * suitableWords.length)]
            : getRandomWord(randomCategory);

        setWordData(selectedWord);
        setGuessedLetters([]);
        setErrors(0);
        setIsWon(false);
        setIsLost(false);
        setShowHint(false);
    };

    const handleGuess = (letter: string) => {
        if (isWon || isLost || guessedLetters.includes(letter)) return;

        const newGuessed = [...guessedLetters, letter];
        setGuessedLetters(newGuessed);

        if (!wordData.term.includes(letter)) {
            const newErrors = errors + 1;
            setErrors(newErrors);
            if (newErrors >= config.maxErrors) {
                setIsLost(true);
            }
        } else {
            // Check win
            const allLettersGuessed = wordData.term
                .split("")
                .every(l => newGuessed.includes(l) || l === " " || l === "-");

            if (allLettersGuessed) {
                setIsWon(true);
                setVictoryMessage(VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)]);
                saveProgress('hangman-' + category.id, difficulty === 'FACIL' ? 2 : difficulty === 'MEDIO' ? 6 : 12);
            }
        }
    };


    // For the tree visual: total flowers = maxErrors
    const flowersLeft = config.maxErrors - errors;

    const renderKey = (letter: string) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && wordData.term.includes(letter);

        return (
            <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || isWon || isLost}
                className={`
                    w-9 h-12 flex items-center justify-center rounded-xl text-lg font-black transition-all shadow-sm
                    ${!isGuessed
                        ? 'bg-white text-slate-700 shadow-[0_4px_0_0_#e2e8f0] active:shadow-none active:translate-y-1'
                        : isCorrect
                            ? 'bg-green-500 text-white opacity-60'
                            : 'bg-slate-300 text-slate-500 opacity-30'}
                `}
            >
                {letter}
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full relative">
            <GameHeader
                title="Forca das Flores"
                subtitle={category.name}
                onBack={onBack}
            />

            {/* Tree Area - Compact Visual */}
            <div className="flex-1 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-white to-blue-50/10 rounded-[40px] shadow-inner border-2 border-slate-100 relative overflow-hidden min-h-0">
                {/* Visual Tree Metafor */}
                <div className="relative w-full h-[180px] flex items-center justify-center pt-2">
                    <svg viewBox="0 0 200 200" className="w-56 h-56 drop-shadow-xl">
                        {/* Ground shadow */}
                        <ellipse cx="100" cy="180" rx="70" ry="12" fill="#e2e8f0" opacity="0.4" />
                        <path d="M30 180 Q100 165 170 180" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeLinecap="round" />

                        {/* Trunk - Organic Shape */}
                        <defs>
                            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#78350f" />
                                <stop offset="50%" stopColor="#92400e" />
                                <stop offset="100%" stopColor="#78350f" />
                            </linearGradient>
                            <filter id="shadow">
                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
                            </filter>
                        </defs>
                        <path
                            d="M88 180 L92 90 Q100 75 108 90 L112 180 Z"
                            fill="url(#trunkGrad)"
                        />

                        {/* Canopy Layers - Larger */}
                        <circle cx="100" cy="75" r="65" fill="#22c55e" opacity="0.1" />
                        <circle cx="100" cy="75" r="55" fill="#16a34a" opacity="0.15" />
                        <path
                            d="M45 85 Q100 20 155 85 Q165 130 100 145 Q35 130 45 85"
                            fill="#4ade80"
                            opacity="0.25"
                            filter="url(#shadow)"
                        />
                    </svg>

                    {/* Flowers Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <AnimatePresence>
                            {Array.from({ length: config.maxErrors }).map((_, i) => {
                                // Reduzir radius e ajustar centro para manter dentro da copa maior
                                const angle = (i / config.maxErrors) * Math.PI * 2;
                                const radius = 30 + Math.sin(i * 2) * 12;
                                const x = 50 + Math.cos(angle) * (radius * 0.9);
                                const y = 32 + Math.sin(angle) * (radius * 0.6);

                                return i < flowersLeft ? (
                                    <motion.div
                                        key={`flower-${i}`}
                                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        exit={{
                                            y: 450,
                                            x: i % 2 === 0 ? -50 : 50,
                                            rotate: i % 2 === 0 ? -180 : 180,
                                            opacity: 0,
                                            transition: {
                                                duration: 2,
                                                ease: [0.36, 0, 0.66, -0.56],
                                                opacity: { duration: 0.8, delay: 1.2 }
                                            }
                                        }}
                                        className="absolute text-pink-400"
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                    >
                                        <div className="relative">
                                            <Flower2
                                                className="w-8 h-8 drop-shadow-md"
                                                fill="currentColor"
                                                strokeWidth={1.5}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : null;
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Word Display Area - Larger Letters */}
                <div className="w-full flex flex-col items-center gap-4 pb-1">
                    <div className="flex flex-wrap justify-center gap-2">
                        {wordData.term.split("").map((letter, i) => {
                            const isRevealed = guessedLetters.includes(letter) || letter === " " || letter === "-";
                            return (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: isRevealed ? [1, 1.1, 1] : 1,
                                        color: isRevealed ? "#1e293b" : "#94a3b8"
                                    }}
                                    className={`
                                        w-12 h-16 border-b-[6px] flex items-center justify-center text-5xl font-black
                                        ${letter === " " ? "border-transparent w-4" :
                                            isRevealed ? "border-primary" : "border-slate-200"}
                                    `}
                                >
                                    {isRevealed ? letter : ""}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Hint Button / Message - Slimmer */}
                    <div className="h-12 flex items-center justify-center w-full">
                        <AnimatePresence mode="wait">
                            {(showHint || isLost) ? (
                                <motion.div
                                    key="hint-box"
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="bg-amber-50/80 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-xl border-2 border-amber-200 shadow-sm flex items-center gap-2 max-w-sm"
                                >
                                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                                    <div className="text-left leading-tight">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60 block">Dica</span>
                                        <span className="text-xs font-bold">{wordData.hint}</span>
                                    </div>
                                </motion.div>
                            ) : !isWon && config.allowHints && (
                                <motion.button
                                    key="hint-button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowHint(true)}
                                    className="flex items-center gap-2 px-5 py-2 bg-white text-amber-700 rounded-full font-black text-xs border-2 border-amber-100 shadow-sm active:scale-95 transition-all hover:bg-amber-50"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    PRECISA DE UMA DICA?
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Premium Keyboard - Optimized for Senior Touch UX - More Compact */}
            <div className="flex flex-col gap-1.5 p-2 bg-slate-100/80 backdrop-blur-sm rounded-[28px] shadow-lg border border-white">
                {/* Row 1 */}
                <div className="flex justify-center gap-1">
                    {ALPHABET.slice(0, 9).map(renderKey)}
                </div>
                {/* Row 2 */}
                <div className="flex justify-center gap-1 ml-4">
                    {ALPHABET.slice(9, 18).map(renderKey)}
                </div>
                {/* Row 3 */}
                <div className="flex justify-center gap-1 pl-4">
                    {ALPHABET.slice(18).map(renderKey)}
                </div>
            </div>

            <GameModal
                isOpen={isWon || isLost}
                isWon={isWon}
                title={isWon ? victoryMessage : "Não foi dessa vez!"}
                message={isWon
                    ? `Você salvou todas as flores do tema ${category.name.toLowerCase()}!`
                    : `A palavra era: ${wordData.term}`}
                description={isLost ? "As flores caíram, mas você pode tentar novamente!" : undefined}
                onRestart={initGame}
                onBack={onBack}
                confirmText={isWon ? "Jogar de Novo" : "Tentar de Novo"}
                icon={isWon ? <Star className="w-12 h-12 text-green-600" fill="currentColor" /> : <RotateCcw className="w-12 h-12 text-red-600" />}
            />
        </div>
    );
};

export default Hangman;
