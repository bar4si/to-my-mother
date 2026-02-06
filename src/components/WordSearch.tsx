import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, VICTORY_PHRASES, Difficulty, WordCategory } from '../lib/phrases';
import { saveProgress } from '../lib/storage';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const GRID_SIZE = 8;

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
        const wordsPerGame = difficulty === 'FACIL' ? 4 : difficulty === 'MEDIO' ? 5 : 6;

        // Pick words that fit in current grid size (max length 8)
        const validWords = currentCategory.words.filter(w => w.length <= GRID_SIZE);
        const wordPool = [...validWords].sort(() => Math.random() - 0.5);
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
                const isDiagonal = difficulty === 'DIFICIL' && Math.random() > 0.7;

                let dir = isHorizontal ? 'H' : 'V';
                if (isDiagonal) dir = 'D';

                const rowLimit = dir === 'H' ? GRID_SIZE : GRID_SIZE - word.length + 1;
                const colLimit = dir === 'V' ? GRID_SIZE : GRID_SIZE - word.length + 1;

                const row = Math.floor(Math.random() * rowLimit);
                const col = Math.floor(Math.random() * colLimit);

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
                    const cell = grid[Math.round(r)]?.[Math.round(c)];
                    if (cell) newSelection.push(cell);
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
        <div className="flex flex-col gap-6 w-full h-full">
            <div className="flex justify-between items-center bg-slate-100 -mx-8 -mt-8 p-6 border-b-2 border-slate-200 mb-2">
                <button onClick={onBack} className="hit-target p-2 bg-white rounded-2xl shadow-md border border-slate-200 active:scale-95 transition-all">
                    <ChevronLeft className="w-8 h-8 text-primary" />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-black text-primary leading-tight uppercase tracking-tight">{currentCategory.name}</h2>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-600 font-extrabold">{difficulty}</span>
                </div>
                <button onClick={initGame} className="hit-target p-2 bg-white rounded-2xl shadow-md border border-slate-200 active:scale-95 transition-all">
                    <RotateCcw className="w-8 h-8 text-primary" />
                </button>
            </div>

            {/* Maximized Grid */}
            <div
                className="grid gap-1.5 bg-slate-200 p-2 rounded-[32px] shadow-inner select-none touch-none border-y-4 border-white -mx-8 w-[calc(100%+64px)] justify-center"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                }}
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
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center 
              text-3xl font-black rounded-xl transition-all
              ${isSelected(r, c)
                                ? 'bg-primary text-white scale-110 z-10 shadow-lg'
                                : isCellFound(r, c)
                                    ? 'bg-blue-600/30 text-blue-900 ring-2 ring-blue-500/20'
                                    : 'bg-white text-slate-900 border border-slate-100 shadow-sm'
                            }
              cursor-pointer active:scale-95
            `}
                    >
                        {cell.char}
                    </div>
                )))}
            </div>

            {/* Simplified Word List */}
            <div className="flex flex-wrap gap-2 justify-center py-2 px-2">
                {activeWords.map((word: string) => (
                    <span
                        key={word}
                        className={`px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all ${foundWords.includes(word)
                            ? 'bg-green-100 text-green-900 border-green-500/30 line-through opacity-40'
                            : 'bg-white text-slate-900 border-slate-200 shadow-md ring-2 ring-slate-50'
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
                            className="bg-white p-10 rounded-[48px] shadow-2xl text-center flex flex-col items-center gap-6 max-w-[360px] w-full border border-slate-100"
                        >
                            <div className="w-28 h-28 bg-yellow-400 rounded-[32px] flex items-center justify-center text-6xl shadow-xl border-4 border-white rotate-3">
                                🏆
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Incrível!</h3>
                                <p className="text-xl text-slate-700 italic font-bold max-w-[240px]">"{victoryMessage}"</p>
                            </div>
                            <div className="w-full flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        const next = availableCategories[Math.floor(Math.random() * availableCategories.length)];
                                        setCurrentCategory(next);
                                        initGame();
                                    }}
                                    className="hit-target bg-primary text-white w-full rounded-[24px] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Próximo Jogo
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

export default WordSearch;
