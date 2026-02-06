import React, { useEffect } from 'react';
import { Sprout, Coffee, Brain, Search, Grid2X2, Star, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameProgress, updateCelebratedLevel } from '../lib/storage';
import { Difficulty } from '../lib/phrases';
import { getAchievementStatus } from '../lib/achievement';

interface GameMenuProps {
    progress: GameProgress;
    onSelectGame: (gameId: string) => void;
    onSetDifficulty: (difficulty: Difficulty) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ progress, onSelectGame, onSetDifficulty }) => {
    const status = getAchievementStatus(progress.score);
    const BadgeIcon = status.currentBadge.icon;

    // Master Touch: Level-Up Celebration
    useEffect(() => {
        const currentLevel = status.currentBadge.level;
        const lastCelebrated = progress.lastCelebratedLevel || 1;

        if (currentLevel > lastCelebrated) {
            // Trigger 3 bursts of confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            // Persist that we celebrated this level
            updateCelebratedLevel(currentLevel);
        }
    }, [status.currentBadge.level, progress.lastCelebratedLevel]);

    const games = [
        {
            id: 'wordsearch',
            name: 'Caça-Palavras',
            description: 'Encontre palavras escondidas e treine seu olhar.',
            icon: Search,
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            id: 'memory',
            name: 'Jogo da Memória',
            description: 'Exercite sua mente combinando figuras nostálgicas.',
            icon: Grid2X2,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'hangman',
            name: 'Forca das Flores',
            description: 'Adivinhe a palavra para manter a árvore florida.',
            icon: Flower2,
            color: 'bg-pink-100 text-pink-600'
        }
    ];

    const difficultyConfig = [
        { id: 'FACIL', label: 'Iniciante', icon: Sprout, color: 'bg-green-100 text-green-900' },
        { id: 'MEDIO', label: 'Médio', icon: Coffee, color: 'bg-blue-100 text-blue-900' },
        { id: 'DIFICIL', label: 'Especialista', icon: Brain, color: 'bg-purple-100 text-purple-900' },
    ];

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Integrated Achievement & Control Center - Unified for Senior UX */}
            <div className="bg-white rounded-[40px] p-5 shadow-xl shadow-primary/5 border-2 border-primary/10 overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50" />

                <div className="flex flex-col gap-4 relative z-10">
                    {/* Top Row: Compact Achievement & Score integrated */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center relative shrink-0 shadow-inner">
                            <BadgeIcon className="w-7 h-7 text-primary drop-shadow-sm" strokeWidth={2.5} />
                            {status.prestigeStars > 0 && (
                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full px-1.5 py-0.5 text-[8px] font-black flex items-center gap-0.5 shadow-md border border-white">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    {status.prestigeStars}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex justify-between items-center min-w-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[9px] uppercase tracking-[0.15em] font-black text-primary/60 block">Nível {status.currentBadge.level}</span>
                                </div>
                                <h2 className="text-lg font-black text-slate-900 leading-tight h-10 flex items-center">
                                    {status.currentBadge.title}
                                </h2>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-tight">Pontos</span>
                                <span className="text-xl font-black text-primary leading-none">{progress.score}</span>
                            </div>
                        </div>
                    </div>

                    {/* Compact Difficulty Selector */}
                    <div className="bg-slate-50/80 rounded-2xl p-1.5 border border-slate-100 flex gap-1 shadow-inner">
                        {difficultyConfig.map((config) => {
                            const Icon = config.icon;
                            const isSelected = progress.preferredDifficulty === config.id;
                            return (
                                <button
                                    key={config.id}
                                    onClick={() => onSetDifficulty(config.id as Difficulty)}
                                    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all active:scale-95 ${isSelected
                                        ? `${config.color} shadow-sm border-2 border-white scale-105 z-10`
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isSelected ? 'animate-bounce' : ''}`} strokeWidth={3} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">
                                        {config.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Streamlined Progress Section */}
                    <div className="space-y-2">
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                                style={{ width: `${status.progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            {status.nextBadge ? (
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                    Faltam <span className="text-primary font-black">{status.pointsToNext}</span> para <span className="text-slate-600 font-extrabold">{status.nextBadge.title}</span>
                                </p>
                            ) : (
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Caminho do Amor Infinito</p>
                            )}
                            <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">{status.progress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Games Grid - Mobile Icon Style */}
            <div className="grid grid-cols-2 gap-8 px-2">
                {games.map((game) => {
                    const GameIcon = game.icon;
                    return (
                        <button
                            key={game.id}
                            onClick={() => onSelectGame(game.id)}
                            className="hit-target flex flex-col items-center gap-4 transition-all active:scale-90 group"
                        >
                            <div className={`w-full aspect-square rounded-[40px] flex items-center justify-center ${game.color} shadow-xl shadow-slate-200/50 border-b-8 border-black/5 group-hover:shadow-2xl group-hover:-translate-y-1 group-active:translate-y-0.5 group-active:border-b-0 transition-all relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <GameIcon className="w-16 h-16 drop-shadow-md" strokeWidth={2.5} />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 text-center leading-[1.1] px-2 h-10 flex items-start justify-center overflow-hidden">
                                {game.name}
                            </h4>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GameMenu;
