import { Sprout, Coffee, Brain, Search, Grid2X2 } from 'lucide-react';
import { GameProgress } from '../lib/storage';
import { Difficulty } from '../lib/phrases';

interface GameMenuProps {
    progress: GameProgress;
    onSelectGame: (gameId: string) => void;
    onSetDifficulty: (difficulty: Difficulty) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ progress, onSelectGame, onSetDifficulty }) => {
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
            {/* Status Card */}
            <div className="bg-primary/5 rounded-[32px] p-6 border-2 border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                        🏆
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-wider font-extrabold text-primary">Sua Pontuação</span>
                        <p className="text-3xl font-black text-primary">{progress.score}</p>
                    </div>
                </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest px-2">Configurar Nível</h3>
                <div className="grid grid-cols-3 gap-3">
                    {difficultyConfig.map((config) => {
                        const Icon = config.icon;
                        const isSelected = progress.preferredDifficulty === config.id;
                        return (
                            <button
                                key={config.id}
                                onClick={() => onSetDifficulty(config.id as Difficulty)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-[32px] transition-all border-4 active:scale-95 ${isSelected
                                    ? `${config.color} border-slate-900 shadow-xl -translate-y-1`
                                    : 'bg-white border-slate-100 text-slate-400 opacity-60'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                                    <Icon className={`w-8 h-8 ${isSelected ? 'text-slate-900' : 'text-slate-300'}`} strokeWidth={3} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {config.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Games List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest px-2">Escolha seu Jogo</h3>
                {games.map((game) => {
                    const GameIcon = game.icon;
                    return (
                        <button
                            key={game.id}
                            onClick={() => onSelectGame(game.id)}
                            className="hit-target w-full rounded-3xl p-5 flex items-start justify-start gap-5 transition-all active:scale-95 bg-white shadow-md border border-slate-100 hover:shadow-lg"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${game.color} shrink-0`}>
                                <GameIcon className="w-8 h-8" strokeWidth={3} />
                            </div>
                            <div className="text-left pt-1">
                                <h4 className="text-xl font-black text-slate-900 leading-none mb-1">{game.name}</h4>
                                <p className="text-sm text-slate-700 font-bold leading-tight">{game.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GameMenu;
