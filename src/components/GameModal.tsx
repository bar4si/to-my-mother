import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, RotateCcw } from 'lucide-react';

interface GameModalProps {
    isOpen: boolean;
    isWon: boolean;
    title: string;
    message: string;
    description?: string;
    onRestart: () => void;
    onBack: () => void;
    icon?: React.ReactNode;
    confirmText?: string;
}

const GameModal: React.FC<GameModalProps> = ({
    isOpen,
    isWon,
    title,
    message,
    description,
    onRestart,
    onBack,
    icon,
    confirmText
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-8 text-center ${isWon ? 'bg-primary/95' : 'bg-slate-900/95'
                        }`}
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[48px] p-10 shadow-2xl border-4 border-white max-w-xs w-full"
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isWon ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {icon ? icon : (
                                isWon ? (
                                    <Star className="w-12 h-12 text-green-600" fill="currentColor" />
                                ) : (
                                    <RotateCcw className="w-12 h-12 text-red-600" />
                                )
                            )}
                        </div>

                        <h2 className={`text-3xl font-black mb-4 leading-tight ${isWon ? 'text-primary' : 'text-slate-800'
                            }`}>
                            {title}
                        </h2>

                        <p className="text-slate-600 font-bold mb-2 text-xl">
                            {message}
                        </p>

                        {description && (
                            <p className="text-slate-500 font-medium mb-8">
                                {description}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 mt-6">
                            <button
                                onClick={onRestart}
                                className={`hit-target w-full rounded-3xl py-4 font-black text-xl shadow-lg active:scale-95 transition-all text-white ${isWon ? 'bg-primary' : 'bg-slate-800'
                                    }`}
                            >
                                {confirmText || (isWon ? "Jogar de Novo" : "Tentar de Novo")}
                            </button>
                            <button
                                onClick={onBack}
                                className="hit-target w-full bg-slate-100 text-slate-700 rounded-3xl py-4 font-black text-lg active:scale-95 transition-all"
                            >
                                Voltar ao Menu
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameModal;
