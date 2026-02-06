import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { Coffee, Heart, Music, Book, Flower2, Star, Sun, Moon } from 'lucide-react';
import { VICTORY_PHRASES } from '../../lib/phrases';
import { getMatchThreeConfig } from '../../lib/gameConfig';
import GameHeader from './GameHeader';
import GameModal from './GameModal';

const ITEMS = [
    { id: 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 1, icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-50' },
    { id: 2, icon: Music, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, icon: Book, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 4, icon: Flower2, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 5, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 6, icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 7, icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-50' },
];

interface Tile {
    id: string;
    typeIndex: number;
}

const MatchThree: React.FC = () => {
    const { progress, updateScore } = useGame();
    const navigate = useNavigate();
    const difficulty = progress.preferredDifficulty!;
    const config = getMatchThreeConfig(difficulty);
    const onBack = () => navigate('/');

    const [grid, setGrid] = useState<Tile[][]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(config.moves);
    const [selectedTile, setSelectedTile] = useState<{ r: number; c: number } | null>(null);
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    const generateRandomTile = useCallback(() => ({
        id: `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        typeIndex: Math.floor(Math.random() * config.itemTypes)
    }), [config.itemTypes]);

    const initGrid = useCallback(() => {
        const newGrid: Tile[][] = [];
        for (let r = 0; r < config.rows; r++) {
            newGrid[r] = [];
            for (let c = 0; c < config.cols; c++) {
                // Previne matches iniciais simples (horizontal e vertical)
                let type;
                do {
                    type = Math.floor(Math.random() * config.itemTypes);
                } while (
                    (c >= 2 && newGrid[r][c - 1].typeIndex === type && newGrid[r][c - 2].typeIndex === type) ||
                    (r >= 2 && newGrid[r - 1][c].typeIndex === type && newGrid[r - 2][c].typeIndex === type)
                );
                newGrid[r][c] = { id: `initial-${r}-${c}-${Math.random().toString(36).substr(2, 5)}`, typeIndex: type };
            }
        }
        setGrid(newGrid);
        setScore(0);
        setMoves(config.moves);
        setIsWon(false);
        setIsLost(false);
        setIsTransitioning(false);
    }, [config]);

    useEffect(() => {
        initGrid();
    }, [initGrid]);

    const checkMatches = useCallback((currentGrid: Tile[][]) => {
        const matches: { r: number; c: number }[] = [];

        // Horizontal
        for (let r = 0; r < config.rows; r++) {
            for (let c = 0; c < config.cols - 2; c++) {
                const type = currentGrid[r][c].typeIndex;
                if (type === -1) continue;
                if (type === currentGrid[r][c + 1].typeIndex && type === currentGrid[r][c + 2].typeIndex) {
                    matches.push({ r, c }, { r, c: c + 1 }, { r, c: c + 2 });
                }
            }
        }

        // Vertical
        for (let c = 0; c < config.cols; c++) {
            for (let r = 0; r < config.rows - 2; r++) {
                const type = currentGrid[r][c].typeIndex;
                if (type === -1) continue;
                if (type === currentGrid[r + 1][c].typeIndex && type === currentGrid[r + 2][c].typeIndex) {
                    matches.push({ r, c }, { r: r + 1, c }, { r: r + 2, c });
                }
            }
        }

        return Array.from(new Set(matches.map(m => `${m.r},${m.c}`))).map(s => {
            const [r, c] = s.split(',').map(Number);
            return { r, c };
        });
    }, [config]);

    const processMatches = useCallback(async (initialGrid?: Tile[][]) => {
        let currentGrid = initialGrid ? [...initialGrid.map(row => [...row])] : [...grid.map(row => [...row])];
        let foundMatch = true;

        while (foundMatch) {
            const matches = checkMatches(currentGrid);
            if (matches.length === 0) {
                foundMatch = false;
                break;
            }

            // 1. Mark matches for explosion
            matches.forEach(({ r, c }) => {
                currentGrid[r][c] = { ...currentGrid[r][c], typeIndex: -1 };
            });

            setGrid([...currentGrid.map(row => [...row])]);
            setScore(s => s + (matches.length * 10));
            // Wait for "explosion" (instant disappearance)
            await new Promise(resolve => setTimeout(resolve, 150));

            // 2. Gravity (Compact items down)
            const nextGrid = [...currentGrid.map(row => [...row])];
            for (let c = 0; c < config.cols; c++) {
                let emptyRow = config.rows - 1;
                for (let r = config.rows - 1; r >= 0; r--) {
                    if (nextGrid[r][c].typeIndex !== -1) {
                        const tileToMove = nextGrid[r][c];
                        // Só limpa se o item realmente for sair dessa linha
                        if (emptyRow !== r) {
                            nextGrid[r][c] = { id: `empty-${r}-${c}-${Date.now()}`, typeIndex: -1 };
                        }
                        nextGrid[emptyRow][c] = tileToMove;
                        emptyRow--;
                    }
                }

                // 3. Fill top with new tiles
                for (let r = emptyRow; r >= 0; r--) {
                    nextGrid[r][c] = generateRandomTile();
                }
            }

            currentGrid = nextGrid;
            setGrid([...currentGrid.map(row => [...row])]);
            // Wait for "falling" animation to complete
            await new Promise(resolve => setTimeout(resolve, 450));
        }

        setIsTransitioning(false);

        // Final Win/Loss check
        setScore(currentScore => {
            if (currentScore >= config.targetScore) {
                setIsWon(true);
                setVictoryMessage(VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)]);
                updateScore('match3', difficulty === 'FACIL' ? 1 : difficulty === 'MEDIO' ? 5 : 10);
            } else if (moves <= 0) {
                setIsLost(true);
            }
            return currentScore;
        });
    }, [grid, config, moves, checkMatches, generateRandomTile, updateScore, difficulty]);

    const handleTileClick = async (r: number, c: number) => {
        if (isWon || isLost || isTransitioning) return;

        if (!selectedTile) {
            setSelectedTile({ r, c });
            return;
        }

        const isAdjacent = (Math.abs(selectedTile.r - r) === 1 && selectedTile.c === c) ||
            (Math.abs(selectedTile.c - c) === 1 && selectedTile.r === r);

        if (isAdjacent) {
            setIsTransitioning(true);
            const swapGrid = [...grid.map(row => [...row])];
            const temp = swapGrid[r][c];
            swapGrid[r][c] = swapGrid[selectedTile.r][selectedTile.c];
            swapGrid[selectedTile.r][selectedTile.c] = temp;

            setGrid(swapGrid);
            setSelectedTile(null);

            const matches = checkMatches(swapGrid);
            if (matches.length > 0) {
                setMoves((m: number) => m - 1);
                // Give time for the swap animation to finish
                setTimeout(() => processMatches(swapGrid), 300);
            } else {
                // Return animation if no match
                setTimeout(() => {
                    setGrid([...grid.map(row => [...row])]);
                    setIsTransitioning(false);
                }, 350);
            }
        } else {
            setSelectedTile({ r, c });
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <GameHeader
                title="Combinando Lembranças"
                subtitle={`Objetivo: ${config.targetScore} pontos`}
                onBack={onBack}
            />

            {/* Stats Area */}
            <div className="flex justify-between items-center px-6 py-3 bg-white rounded-3xl shadow-sm border-2 border-slate-100">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pontuação</span>
                    <span className="text-2xl font-black text-primary">{score}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Movimentos</span>
                    <span className={`text-2xl font-black ${moves <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                        {moves}
                    </span>
                </div>
            </div>

            {/* Game Grid */}
            <div className={`
                flex-1 aspect-square bg-slate-100 rounded-[40px] p-2 shadow-inner border-2 border-slate-50
                grid gap-1.5
            `}
                style={{
                    gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`
                }}>
                <AnimatePresence mode="popLayout">
                    {grid.map((row, r) => row.map((tile, c) => (
                        <motion.button
                            key={tile.id}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: tile.typeIndex === -1 ? 0 : 1,
                                opacity: tile.typeIndex === -1 ? 0 : 1,
                                boxShadow: selectedTile?.r === r && selectedTile?.c === c
                                    ? '0 0 0 4px #ec4899'
                                    : '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            transition={{
                                layout: { type: 'spring', stiffness: 350, damping: 25 },
                                scale: { duration: 0.2 },
                                opacity: { duration: 0.2 }
                            }}
                            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTileClick(r, c)}
                            className={`
                                aspect-square rounded-2xl flex items-center justify-center overflow-hidden
                                ${tile.typeIndex !== -1 ? `${ITEMS[tile.typeIndex].bg} ${ITEMS[tile.typeIndex].color}` : 'bg-transparent shadow-none'}
                                ${selectedTile?.r === r && selectedTile?.c === c ? 'z-10 bg-white ring-4 ring-pink-500' : ''}
                            `}
                        >
                            {tile.typeIndex !== -1 && React.createElement(ITEMS[tile.typeIndex].icon, { className: "w-[70%] h-[70%] drop-shadow-sm" })}
                        </motion.button>
                    )))}
                </AnimatePresence>
            </div>

            <GameModal
                isOpen={isWon || isLost}
                isWon={isWon}
                title={isWon ? victoryMessage : "Fim de Jogo!"}
                message={isWon
                    ? `Você combinou todas as lembranças e fez ${score} pontos!`
                    : `Você quase conseguiu! Faltaram apenas ${config.targetScore - score} pontos.`}
                onRestart={initGrid}
                onBack={onBack}
                confirmText={isWon ? "Jogar Mais" : "Tentar de Novo"}
                icon={isWon
                    ? <Star className="w-12 h-12 text-yellow-500" fill="currentColor" />
                    : <Star className="w-12 h-12 text-slate-300" />}
            />
        </div>
    );
};

export default MatchThree;
