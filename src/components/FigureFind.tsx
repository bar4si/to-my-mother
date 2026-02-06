import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FIGURE_THEMES, FigureTheme, GameFigure } from '../lib/figures';
import { RotateCcw, Lightbulb } from 'lucide-react';
import { Difficulty, VICTORY_PHRASES } from '../lib/phrases';
import { getFigureFindConfig } from '../lib/gameConfig';
import { saveProgress } from '../lib/storage';
import GameHeader from './GameHeader';

interface FigureFindProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const FigureFind: React.FC<FigureFindProps> = ({ difficulty, onBack }) => {
    const [theme, setTheme] = useState<FigureTheme>(
        FIGURE_THEMES[Math.floor(Math.random() * FIGURE_THEMES.length)]
    );
    const [figures, setFigures] = useState<GameFigure[]>([]);
    const [target, setTarget] = useState<GameFigure | null>(null);
    const [isWon, setIsWon] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [showHint, setShowHint] = useState(false);

    const initGame = useCallback(() => {
        const config = getFigureFindConfig(difficulty);
        const newFigures: GameFigure[] = [];

        // 1. Select a random icon from the theme to be the target
        const targetIcon = theme.icons[Math.floor(Math.random() * theme.icons.length)];

        // 2. Prepare distractors pool (all icons except the target one)
        const distractorsPool = theme.icons.filter(icon => icon !== targetIcon);

        // Generate positions
        if (config.gridMode) {
            // Simple Grid for Beginners
            const cols = config.columns || 3;
            const size = 300 / cols;
            const targetIdx = Math.floor(Math.random() * config.itemCount);

            for (let i = 0; i < config.itemCount; i++) {
                // For beginners, we want absolute diversity if possible (by default)
                // If allowDistractorDuplicates is true, we pick randomly
                const icon = i === targetIdx
                    ? targetIcon
                    : config.allowDistractorDuplicates
                        ? distractorsPool[Math.floor(Math.random() * distractorsPool.length)]
                        : distractorsPool[i % distractorsPool.length];

                newFigures.push({
                    id: `fig-${i}`,
                    icon,
                    x: (i % cols) * size + size / 2,
                    y: Math.floor(i / cols) * size + size / 2,
                    rotation: 0,
                    scale: 1,
                    isTarget: i === targetIdx
                });
            }
        } else {
            // Random Scattering for higher difficulties
            const padding = 40;
            const width = 300;
            const height = 300;

            const targetIdxInShuffle = Math.floor(Math.random() * config.itemCount);

            for (let i = 0; i < config.itemCount; i++) {
                const isTarget = i === targetIdxInShuffle;
                const icon = isTarget
                    ? targetIcon
                    : config.allowDistractorDuplicates
                        ? distractorsPool[Math.floor(Math.random() * distractorsPool.length)]
                        : distractorsPool[i % distractorsPool.length];

                newFigures.push({
                    id: `fig-${i}`,
                    icon,
                    x: padding + Math.random() * (width - padding * 2),
                    y: padding + Math.random() * (height - padding * 2),
                    rotation: difficulty === 'DIFICIL' ? Math.random() * 360 : 0,
                    scale: 0.8 + Math.random() * 0.4,
                    isTarget
                });
            }
        }

        setFigures(newFigures);
        setTarget(newFigures.find(f => f.isTarget) || null);
        setIsWon(false);
        setShowHint(false);
    }, [difficulty, theme]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleFigureClick = (figure: GameFigure) => {
        if (isWon) return;

        if (figure.isTarget) {
            setIsWon(true);
            setVictoryMessage(VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)]);
            saveProgress('figures', difficulty === 'FACIL' ? 1 : difficulty === 'MEDIO' ? 5 : 10);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <GameHeader
                title="Caça-Figuras"
                subtitle={theme.name}
                onBack={onBack}
                actionIcon={RotateCcw}
                onAction={initGame}
            />

            {/* Target Display */}
            <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Encontre este objeto:</span>
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-primary/20 p-4 ring-8 ring-primary/5">
                    {target && <target.icon className="w-12 h-12 text-primary animate-pulse" strokeWidth={3} />}
                </div>
            </div>

            {/* Game Canvas */}
            <div className={`relative w-[300px] h-[300px] mx-auto rounded-[40px] shadow-inner overflow-hidden border-2 border-slate-100 ${theme.color}`}>
                <AnimatePresence>
                    {figures.map((fig) => {
                        const Icon = fig.icon;
                        return (
                            <motion.button
                                key={fig.id}
                                layoutId={fig.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: fig.scale,
                                    rotate: fig.rotation,
                                    x: fig.x - 30, // Offset for center positioning (approx)
                                    y: fig.y - 30
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleFigureClick(fig)}
                                className={`absolute w-14 h-14 flex items-center justify-center rounded-2xl transition-all
                                    ${fig.isTarget ? 'z-20' : 'z-0'}
                                    ${showHint && fig.isTarget ? 'ring-4 ring-yellow-400 ring-offset-4 animate-bounce !z-50 bg-white shadow-xl' : ''}
                                `}
                                style={{
                                    left: 0,
                                    top: 0
                                }}
                            >
                                <Icon className={`w-8 h-8 ${fig.isTarget ? 'text-inherit' : 'opacity-80'}`} strokeWidth={2.5} />
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setShowHint(true)}
                    disabled={showHint || isWon}
                    className={`hit-target flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-sm transition-all
                        ${showHint || isWon
                            ? 'bg-slate-100 text-slate-300'
                            : 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200 active:scale-95'
                        }
                    `}
                >
                    <Lightbulb className="w-5 h-5" />
                    Me ajude
                </button>
            </div>

            {/* Victory Modal */}
            <AnimatePresence>
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-10 rounded-[48px] shadow-2xl text-center flex flex-col items-center gap-6 max-w-[360px] w-full border border-slate-100"
                        >
                            <div className="w-28 h-28 bg-yellow-400 rounded-[32px] flex items-center justify-center text-6xl shadow-xl border-4 border-white rotate-3">
                                ✨
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Parabéns!</h3>
                                <p className="text-xl text-slate-700 italic font-bold max-w-[240px]">"{victoryMessage}"</p>
                            </div>
                            <div className="w-full flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        setTheme(FIGURE_THEMES[Math.floor(Math.random() * FIGURE_THEMES.length)]);
                                        initGame();
                                    }}
                                    className="hit-target bg-primary text-white w-full rounded-[24px] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Novo Tema
                                </button>
                                <button
                                    onClick={onBack}
                                    className="text-slate-500 font-black text-sm hover:text-primary uppercase tracking-widest transition-colors"
                                >
                                    Voltar ao Início
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FigureFind;
