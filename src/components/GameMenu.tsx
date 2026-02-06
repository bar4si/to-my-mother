import { Sprout, Coffee, Brain, Search, Grid2X2, Star } from 'lucide-react';
import { GameProgress } from '../lib/storage';
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

    const games = [
        {
            id: 'wordsearch',
            name: 'Caça-Palavras',
            description: 'Encontre as palavras escondidas!',
            icon: Search,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'memory',
            name: 'Jogo da Memória',
            description: 'Encontre o par de cada figura!',
            icon: Grid2X2,
            color: 'bg-rose-100 text-rose-600'
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
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-primary/5 border-2 border-primary/10 overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50" />

                <div className="flex flex-col gap-6 relative z-10">
                    {/* Top Row: Achievement Badge */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center relative shrink-0 shadow-inner">
                            <BadgeIcon className="w-10 h-10 text-primary drop-shadow-sm" strokeWidth={2.5} />
                            {status.prestigeStars > 0 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full px-2 py-0.5 text-[10px] font-black flex items-center gap-0.5 shadow-md border-2 border-white">
                                    <Star className="w-3 h-3 fill-current" />
                                    {status.prestigeStars}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/60 mb-1 block">Sua Conquista</span>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                {status.currentBadge.title}
                            </h2>
                        </div>
                    </div>

                    {/* Integrated Difficulty Selector (Segmented look) */}
                    <div className="bg-slate-50/80 rounded-3xl p-2 border border-slate-100 flex gap-1 shadow-inner">
                        {difficultyConfig.map((config) => {
                            const Icon = config.icon;
                            const isSelected = progress.preferredDifficulty === config.id;
                            return (
                                <button
                                    key={config.id}
                                    onClick={() => onSetDifficulty(config.id as Difficulty)}
                                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl transition-all active:scale-95 ${isSelected
                                        ? `${config.color} shadow-md border-2 border-white scale-105 z-10`
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isSelected ? 'animate-bounce' : ''}`} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                        {config.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress Detail Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Pontos Totais</span>
                                <span className="text-2xl font-black text-primary">{progress.score}</span>
                            </div>

                            {status.nextBadge && (
                                <div className="text-right flex flex-col items-end max-w-[50%]">
                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Próximo Título</span>
                                    <span className="text-xs font-black text-slate-800 leading-tight bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                        {status.nextBadge.title}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner p-1">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                                style={{ width: `${status.progress}%` }}
                            />
                        </div>

                        {status.nextBadge && (
                            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-[0.15em]">
                                Faltam <span className="text-primary font-black">{status.pointsToNext}</span> pontos para subir de nível
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Games List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest px-4">Escolha seu Jogo</h3>
                {games.map((game) => {
                    const GameIcon = game.icon;
                    return (
                        <button
                            key={game.id}
                            onClick={() => onSelectGame(game.id)}
                            className="hit-target w-full h-32 rounded-[32px] p-6 flex items-center justify-start gap-6 transition-all active:scale-95 bg-white shadow-md border border-slate-100 hover:shadow-lg"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${game.color} shrink-0 shadow-sm`}>
                                <GameIcon className="w-8 h-8" strokeWidth={3} />
                            </div>
                            <div className="text-left pt-1 flex-1">
                                <h4 className="text-xl font-black text-slate-900 leading-none mb-1.5">{game.name}</h4>
                                <p className="text-sm text-slate-700 font-bold leading-tight line-clamp-2">{game.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GameMenu;
