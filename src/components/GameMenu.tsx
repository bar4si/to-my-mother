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
        }
    ];

    const difficultyConfig = [
        { id: 'FACIL', label: 'Iniciante', color: 'bg-green-100 text-green-900' },
        { id: 'MEDIO', label: 'Médio', color: 'bg-blue-100 text-blue-900' },
        { id: 'DIFICIL', label: 'Especialista', color: 'bg-purple-100 text-purple-900' },
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
                <div className="text-right">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-primary">Nível</span>
                    <p className="font-black text-primary">
                        {progress.preferredDifficulty || 'Nenhum'}
                    </p>
                </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest px-2">Configurar Nível</h3>
                <div className="grid grid-cols-3 gap-2">
                    {difficultyConfig.map((config) => (
                        <button
                            key={config.id}
                            onClick={() => onSetDifficulty(config.id as Difficulty)}
                            className={`p-3 rounded-2xl text-xs font-black transition-all border-2 ${progress.preferredDifficulty === config.id
                                ? `${config.color} border-primary shadow-md scale-105`
                                : 'bg-white border-slate-200 text-slate-600'
                                }`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Games List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest px-2">Escolha seu Jogo</h3>
                {games.map((game) => (
                    <button
                        key={game.id}
                        onClick={() => onSelectGame(game.id)}
                        className="hit-target w-full rounded-3xl p-5 flex items-center justify-between transition-all active:scale-95 bg-white shadow-md border border-slate-100 hover:shadow-lg"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${game.color}`}>
                                {game.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="text-xl font-black text-slate-900">{game.name}</h4>
                                <p className="text-sm text-slate-700 font-bold">{game.description}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-300" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameMenu;
