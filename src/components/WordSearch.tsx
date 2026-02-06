import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, VICTORY_PHRASES, Difficulty, WordCategory } from '../lib/phrases';
import { saveProgress } from '../lib/storage';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 10;

interface Cell {
    char: string;
    row: number;
    col: number;
}

interface WordSearchProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const WordSearch: React.FC<WordSearchProps> = ({ difficulty, onBack }) => {
    // Filter categories by selected difficulty
    const availableCategories = CATEGORIES.filter(c => c.difficulty === difficulty);
    const [currentCategory, setCurrentCategory] = useState<WordCategory>(
        availableCategories[Math.floor(Math.random() * availableCategories.length)]
    );
    const [activeWords, setActiveWords] = useState<string[]>([]);

    const [grid, setGrid] = useState<Cell[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selection, setSelection] = useState<Cell[]>([]);
    const [isWon, setIsWon] = useState(false);
    const [victoryMessage, setVictoryMessage] = useState("");
    const [foundCells, setFoundCells] = useState<Set<string>>(new Set());

    const isDragging = useRef(false);

    useEffect(() => {
        initGame();
    }, [currentCategory]);

    const initGame = () => {
        // Determin words per game based on difficulty
        const wordsPerGame = difficulty === 'FACIL' ? 4 : difficulty === 'MEDIO' ? 6 : 8;

        // Pick random subset of words from category pool
        const wordPool = [...currentCategory.words].sort(() => Math.random() - 0.5);
        const selectedWords = wordPool.slice(0, wordsPerGame);
        setActiveWords(selectedWords);

        const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

        // Place words
        selectedWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                attempts++;
                const isHorizontal = Math.random() > 0.5;
                const isDiagonal = difficulty === 'DIFICIL' && Math.random() > 0.6;

                let dir = isHorizontal ? 'H' : 'V';
                if (isDiagonal) dir = 'D';

                const row = Math.floor(Math.random() * (dir === 'H' ? GRID_SIZE : GRID_SIZE - word.length + 1));
                const col = Math.floor(Math.random() * (dir === 'V' ? GRID_SIZE : GRID_SIZE - word.length + 1));

                // Check if fits
                let fits = true;
                for (let i = 0; i < word.length; i++) {
                    const r = dir === 'V' ? row + i : dir === 'D' ? row + i : row;
                    const c = dir === 'H' ? col + i : dir === 'D' ? col + i : col;

                    if (r >= GRID_SIZE || c >= GRID_SIZE || (newGrid[r][c] !== '' && newGrid[r][c] !== word[i])) {
                        fits = false;
                        break;
                    }
                }

                if (fits) {
                    for (let i = 0; i < word.length; i++) {
                        const r = dir === 'V' ? row + i : dir === 'D' ? row + i : row;
                        const c = dir === 'H' ? col + i : dir === 'D' ? col + i : col;
                        newGrid[r][c] = word[i];
                    }
                    placed = true;
                }
            }
        });

        // Fill empty
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const finalGrid: Cell[][] = newGrid.map((rowArr, r) =>
            rowArr.map((char, c) => ({
                char: char === '' ? letters[Math.floor(Math.random() * letters.length)] : char,
                row: r,
                col: c
            }))
        );

        setGrid(finalGrid);
        setFoundWords([]);
        setSelection([]);
        setFoundCells(new Set());
        setIsWon(false);
    };

    const handleTouchStart = (cell: Cell) => {
        isDragging.current = true;
        setSelection([cell]);
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging.current || selection.length === 0) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const element = document.elementFromPoint(clientX, clientY);
        if (element && element.hasAttribute('data-row')) {
            const row = parseInt(element.getAttribute('data-row')!);
            const col = parseInt(element.getAttribute('data-col')!);

            const startCell = selection[0];
            const dr = row - startCell.row;
            const dc = col - startCell.col;

            // Check if it's a valid line (H, V, or D)
            const isHorizontal = dr === 0;
            const isVertical = dc === 0;
            const isDiagonal = Math.abs(dr) === Math.abs(dc);

            if (isHorizontal || isVertical || isDiagonal) {
                const steps = Math.max(Math.abs(dr), Math.abs(dc));
                const newSelection: Cell[] = [];

                const stepR = dr === 0 ? 0 : dr / steps;
                const stepC = dc === 0 ? 0 : dc / steps;

                for (let i = 0; i <= steps; i++) {
                    const r = startCell.row + (i * stepR);
                    const c = startCell.col + (i * stepC);
                    newSelection.push(grid[Math.round(r)][Math.round(c)]);
                }

                setSelection(newSelection);
            }
        }
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        if (selection.length < 2) {
            setSelection([]);
            return;
        }

        const selectedWord = selection.map(s => s.char).join('');
        const reversedWord = selectedWord.split('').reverse().join('');

        const isMatch = activeWords.includes(selectedWord) || activeWords.includes(reversedWord);

        if (isMatch) {
            const word = activeWords.includes(selectedWord) ? selectedWord : reversedWord;
            if (!foundWords.includes(word)) {
                const newFound = [...foundWords, word];
                setFoundWords(newFound);

                // Persist selection highlight
                const newFoundCells = new Set(foundCells);
                selection.forEach(s => newFoundCells.add(`${s.row}-${s.col}`));
                setFoundCells(newFoundCells);

                if (newFound.length === activeWords.length) {
                    setIsWon(true);
                    setVictoryMessage(VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)]);
                    saveProgress(currentCategory.id, difficulty === 'FACIL' ? 1 : difficulty === 'MEDIO' ? 5 : 10); // Save by ID with specific points
                }
            }
        }
        setSelection([]);
    };

    const isSelected = (r: number, c: number) => selection.some(s => s.row === r && s.col === c);
    const isCellFound = (r: number, c: number) => foundCells.has(`${r}-${c}`);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center bg-slate-50 -mx-6 -mt-6 p-4 border-b border-accent mb-2">
                <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-primary leading-tight">{currentCategory.name}</h2>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{difficulty}</span>
                </div>
                <button onClick={initGame} className="p-2 bg-white rounded-full shadow-sm">
                    <RotateCcw className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <div
                className="grid grid-cols-10 gap-1 bg-slate-100 p-1.5 rounded-2xl shadow-inner select-none touch-none"
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {grid.map((row, r) => row.map((cell, c) => (
                    <div
                        key={`${r}-${c}`}
                        data-row={r}
                        data-col={c}
                        onMouseDown={() => handleTouchStart(cell)}
                        onTouchStart={() => handleTouchStart(cell)}
                        className={`
              w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
              text-lg font-bold rounded-lg transition-all
              ${isSelected(r, c)
                                ? 'bg-primary text-white scale-110 z-10'
                                : isCellFound(r, c)
                                    ? 'bg-blue-500/20 text-blue-700'
                                    : 'bg-white text-slate-700'
                            }
              cursor-pointer active:scale-95
            `}
                    >
                        {cell.char}
                    </div>
                )))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {activeWords.map((word: string) => (
                    <span
                        key={word}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${foundWords.includes(word)
                            ? 'bg-green-100 text-green-700 border-green-200 line-through scale-95 opacity-60'
                            : 'bg-white text-slate-600 border-slate-200 shadow-sm'
                            }`}
                    >
                        {word}
                    </span>
                ))}
            </div>

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
                            className="bg-white p-8 rounded-[40px] shadow-2xl text-center flex flex-col items-center gap-6 max-w-[320px] w-full"
                        >
                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
                                🏆
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Incrível!</h3>
                                <p className="text-lg text-slate-600 italic font-medium">"{victoryMessage}"</p>
                            </div>
                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        const next = availableCategories[Math.floor(Math.random() * availableCategories.length)];
                                        setCurrentCategory(next);
                                        initGame();
                                    }}
                                    className="hit-target bg-primary text-white w-full rounded-2xl font-bold text-lg shadow-md"
                                >
                                    Próximo Nível
                                </button>
                                <button
                                    onClick={onBack}
                                    className="text-slate-400 font-bold text-sm hover:text-slate-600"
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

export default WordSearch;
