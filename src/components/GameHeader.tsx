import { LucideIcon, ChevronLeft } from 'lucide-react';

interface GameHeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
    actionIcon?: LucideIcon;
    onAction?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ title, subtitle, onBack, actionIcon: ActionIcon, onAction }) => {
    return (
        <div className="flex justify-between items-center bg-slate-100 -mx-8 -mt-8 px-6 py-4 border-b-2 border-slate-200 mb-0">
            <button
                onClick={onBack}
                className="hit-target p-1.5 bg-white rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-all"
                aria-label="Voltar"
            >
                <ChevronLeft className="w-7 h-7 text-primary" />
            </button>
            <div className="text-center flex-1">
                <h2 className="text-lg font-black text-primary leading-tight uppercase tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-extrabold block">
                        {subtitle}
                    </span>
                )}
            </div>

            {ActionIcon && onAction ? (
                <button
                    onClick={onAction}
                    className="hit-target p-1.5 bg-white rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-all"
                >
                    <ActionIcon className="w-7 h-7 text-primary" />
                </button>
            ) : (
                <div className="w-10" />
            )}
        </div>
    );
};

export default GameHeader;
