import {
    GraduationCap,
    Flower,
    Candy,
    BookOpen,
    MessageCircle,
    Image,
    Sun,
    Heart,
    PenTool,
    Brain,
    Star,
    Crown,
    Gem,
    Sparkles,
    Infinity
} from 'lucide-react';

export interface Badge {
    level: number;
    title: string;
    description: string;
    icon: any;
    minScore: number;
}

export const BADGES: Badge[] = [
    { level: 1, title: 'Doutora em Carinho', description: 'O começo de uma jornada cheia de amor.', icon: GraduationCap, minScore: 0 },
    { level: 2, title: 'Flor do Jardim', description: 'Seu conhecimento está florescendo!', icon: Flower, minScore: 101 },
    { level: 3, title: 'Doce de Vovó', description: 'Tão doce quanto encontrar uma palavra difícil.', icon: Candy, minScore: 301 },
    { level: 4, title: 'Exploradora de Histórias', description: 'Desbravando o mundo das letras e memórias.', icon: BookOpen, minScore: 601 },
    { level: 5, title: 'Mestra dos Provérbios', description: 'A sabedoria popular brilha em você.', icon: MessageCircle, minScore: 1001 },
    { level: 6, title: 'Guardiã de Lembranças', description: 'Protegendo as memórias mais queridas.', icon: Image, minScore: 1501 },
    { level: 7, title: 'Raio de Sol', description: 'Sua mente ilumina o nosso dia!', icon: Sun, minScore: 2101 },
    { level: 8, title: 'Coração de Ouro', description: 'Um tesouro de dedicação e foco.', icon: Heart, minScore: 2801 },
    { level: 9, title: 'Sábia das Palavras', description: 'Mestre na arte de encontrar e lembrar.', icon: PenTool, minScore: 3601 },
    { level: 10, title: 'Gênio da Família', description: 'O orgulho de todos nós está aqui!', icon: Brain, minScore: 4501 },
    { level: 11, title: 'Estrela da Manhã', description: 'Um brilho constante de inteligência.', icon: Star, minScore: 5501 },
    { level: 12, title: 'Rainha do Saber', description: 'Soberana absoluta nos desafios da mente.', icon: Crown, minScore: 6601 },
    { level: 13, title: 'Tesouro Precioso', description: 'Raridade e valor em cada acerto.', icon: Gem, minScore: 7801 },
    { level: 14, title: 'Inspiração da Vida', description: 'Um exemplo de vitalidade e alegria.', icon: Sparkles, minScore: 9101 },
    { level: 15, title: 'Lenda do Amor Infinito', description: 'O ápice da jornada. Amor que não tem fim.', icon: Infinity, minScore: 10001 },
];

export interface AchievementStatus {
    currentBadge: Badge;
    nextBadge: Badge | null;
    progress: number; // 0 to 100
    prestigeStars: number;
    pointsToNext: number;
}

export const getAchievementStatus = (score: number): AchievementStatus => {
    // Find current badge
    let currentIdx = 0;
    for (let i = BADGES.length - 1; i >= 0; i--) {
        if (score >= BADGES[i].minScore) {
            currentIdx = i;
            break;
        }
    }

    const currentBadge = BADGES[currentIdx];
    const nextBadge = currentIdx < BADGES.length - 1 ? BADGES[currentIdx + 1] : null;

    let progress = 0;
    let pointsToNext = 0;
    let prestigeStars = 0;

    if (nextBadge) {
        const range = nextBadge.minScore - currentBadge.minScore;
        const currentProgress = score - currentBadge.minScore;
        progress = Math.min(Math.round((currentProgress / range) * 100), 100);
        pointsToNext = nextBadge.minScore - score;
    } else {
        // Infinite progression mode (10,000+)
        progress = 100;
        prestigeStars = Math.floor((score - 10000) / 1000);
        if (prestigeStars < 0) prestigeStars = 0;
    }

    return {
        currentBadge,
        nextBadge,
        progress,
        prestigeStars,
        pointsToNext
    };
};
