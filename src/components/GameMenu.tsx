import React from 'react';
import { ChevronRight } from 'lucide-react';
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
            icon: '🔍',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'memory',
            name: 'Jogo da Memória',
            description: 'Em breve...',
            icon: '🧠',
            color: 'bg-slate-100 text-slate-400',
            disabled: true
        }
    ];

    const difficultyConfig = [
        { id: 'FACIL', label: 'Iniciante', color: 'bg-green-100 text-green-700' },
        { id: 'MEDIO', label: 'Médio', color: 'bg-blue-100 text-blue-700' },
        { id: 'DIFICIL', label: 'Especialista', color: 'bg-purple-100 text-purple-700' },
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
                        <span className="text-xs uppercase tracking-wider font-bold text-primary opacity-60">Sua Pontuação</span>
                        <p className="text-2xl font-black text-primary">{progress.score}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs uppercase tracking-wider font-bold text-primary opacity-60">Nível</span>
                    <p className="font-bold text-primary">
                        {progress.preferredDifficulty || 'Nenhum'}
                    </p>
                </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Configurar Nível</h3>
                <div className="grid grid-cols-3 gap-2">
                    {difficultyConfig.map((config) => (
                        <button
                            key={config.id}
                            onClick={() => onSetDifficulty(config.id as Difficulty)}
                            className={`p-3 rounded-2xl text-xs font-black transition-all border-2 ${progress.preferredDifficulty === config.id
                                ? `${config.color} border-current shadow-sm scale-105`
                                : 'bg-white border-slate-100 text-slate-400 opacity-60'
                                }`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Games List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Escolha seu Jogo</h3>
                {games.map((game) => (
                    <button
                        key={game.id}
                        disabled={game.disabled}
                        onClick={() => onSelectGame(game.id)}
                        className={`hit-target w-full rounded-3xl p-5 flex items-center justify-between transition-all active:scale-95 ${game.disabled ? 'opacity-50 grayscale' : 'bg-white shadow-md border border-slate-100 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${game.color}`}>
                                {game.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="text-lg font-bold text-slate-800">{game.name}</h4>
                                <p className="text-sm text-slate-500 font-medium">{game.description}</p>
                            </div>
                        </div>
                        {!game.disabled && <ChevronRight className="w-6 h-6 text-slate-300" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameMenu;
