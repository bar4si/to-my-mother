import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { CATEGORIES, VICTORY_PHRASES, WordCategory } from '../../lib/phrases';
import { getWordSearchConfig } from '../../lib/gameConfig';
import GameHeader from './GameHeader';
import GameModal from './GameModal';

interface Cell {
    char: string;
    row: number;
    col: number;
}

const WordSearch: React.FC = () => {
    const { progress, updateScore } = useGame();
    const navigate = useNavigate();
    const difficulty = progress.preferredDifficulty!;
    const onBack = () => navigate('/');
    const config = getWordSearchConfig(difficulty);
    const ROWS = config.rows;
    const COLS = config.cols;

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
        const wordsPerGame = config.wordsPerGame;

        // Pick words that fit in current grid size
        const maxLen = Math.max(ROWS, COLS);
        const validWords = currentCategory.words.filter(w => w.length <= maxLen);
        const wordPool = [...validWords].sort(() => Math.random() - 0.5);

        const newGrid: string[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
        const placedWords: string[] = [];

        // Try to place words from the pool until we reach wordsPerGame or run out of pool
        for (const wordPoolItem of wordPool) {
            if (placedWords.length >= wordsPerGame) break;

            let placed = false;
            let attempts = 0;

            // Expert logic defined by config
            const shouldReverse = config.allowReversed && Math.random() < config.reverseProbability;
            const wordToPlace = shouldReverse ? wordPoolItem.split('').reverse().join('') : wordPoolItem;

            while (!placed && attempts < 100) {
                attempts++;
                const isHorizontal = Math.random() > 0.5;
                const isDiagonal = config.allowDiagonals && Math.random() < config.diagonalProbability;

                let dir = isHorizontal ? 'H' : 'V';
                if (isDiagonal) dir = 'D';

                const rowLimit = dir === 'H' ? ROWS : ROWS - wordToPlace.length + 1;
                const colLimit = dir === 'V' ? COLS : COLS - wordToPlace.length + 1;

                if (rowLimit <= 0 || colLimit <= 0) continue;

                const row = Math.floor(Math.random() * rowLimit);
                const col = Math.floor(Math.random() * colLimit);

                // Check if fits (including overlapping same characters)
                let fits = true;
                for (let i = 0; i < wordToPlace.length; i++) {
                    const r = dir === 'V' ? row + i : dir === 'D' ? row + i : row;
                    const c = dir === 'H' ? col + i : dir === 'D' ? col + i : col;

                    if (r >= ROWS || c >= COLS || (newGrid[r][c] !== '' && newGrid[r][c] !== wordToPlace[i])) {
                        fits = false;
                        break;
                    }
                }

                if (fits) {
                    for (let i = 0; i < wordToPlace.length; i++) {
                        const r = dir === 'V' ? row + i : dir === 'D' ? row + i : row;
                        const c = dir === 'H' ? col + i : dir === 'D' ? col + i : col;
                        newGrid[r][c] = wordToPlace[i];
                    }
                    placed = true;
                    placedWords.push(wordPoolItem);
                }
            }
        }

        setActiveWords(placedWords);

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
                    updateScore(currentCategory.id, difficulty === 'FACIL' ? 1 : difficulty === 'MEDIO' ? 5 : 10); // Save by ID with specific points
                }
            }
        }
        setSelection([]);
    };

    const isSelected = (r: number, c: number) => selection.some(s => s.row === r && s.col === c);
    const isCellFound = (r: number, c: number) => foundCells.has(`${r}-${c}`);

    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <GameHeader
                title={currentCategory.name}
                subtitle={difficulty}
                onBack={onBack}
            />

            {/* Maximized Grid */}
            <div
                className="grid gap-1.5 bg-slate-200 p-2 rounded-[32px] shadow-inner select-none touch-none border-y-4 border-white -mx-8 w-[calc(100%+64px)] justify-center"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`
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

            {/* Refined Word List for better readability */}
            <div className="flex flex-wrap gap-3 justify-center py-4 px-2">
                {activeWords.map((word: string) => (
                    <span
                        key={word}
                        className={`px-5 py-2.5 rounded-2xl text-base font-bold border transition-all ${foundWords.includes(word)
                            ? 'bg-green-50 text-green-700 border-green-200 line-through opacity-50'
                            : 'bg-white text-slate-800 border-slate-200 shadow-sm'
                            }`}
                    >
                        {word}
                    </span>
                ))}
            </div>

            <GameModal
                isOpen={isWon}
                isWon={true}
                title="Incrível!"
                message={victoryMessage}
                onRestart={() => {
                    const next = availableCategories[Math.floor(Math.random() * availableCategories.length)];
                    setCurrentCategory(next);
                    initGame();
                }}
                onBack={onBack}
                confirmText="Próximo Jogo"
            />
        </div>
    );
};

export default WordSearch;
