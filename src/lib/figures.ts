import {
    Coffee, Utensils, Flower2, Sprout, Sun,
    Scissors, Bird, Apple, Heart, Star,
    Home, Gift, Music,
    Bug, Cloud,
    Wind, TrainFront, Plane, Car, Bike,
    Smile, Clock, Bell, Camera,
    Phone, Key, Mail, Flag, Globe,
    Image, Droplets,
    Leaf, Trees, CloudSun, Shirt, Anchor,
    Fish, Shell, Bone
} from 'lucide-react';
import { Difficulty } from './phrases';

export interface FigureTheme {
    id: string;
    name: string;
    description: string;
    icons: any[];
    color: string;
}

// Mocking icons that might not be in basic lucide-react or need specific imports
const CupSoda = Coffee;
const GlassWater = Droplets;

export const FIGURE_THEMES: FigureTheme[] = [
    {
        id: 'cozinha',
        name: 'Cozinha da Vovó',
        description: 'Encontre utensílios e guloseimas que lembram o lanche da tarde.',
        icons: [Coffee, Utensils, Apple, Gift, Bell, Clock, CupSoda, GlassWater, Image, Phone],
        color: 'bg-orange-100 text-orange-600'
    },
    {
        id: 'jardim',
        name: 'Jardim Florido',
        description: 'Procure por flores, pássaros e elementos da natureza.',
        icons: [Flower2, Sprout, Sun, Bird, Bug, Cloud, Leaf, Trees, CloudSun, Wind],
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 'casa',
        name: 'Coisas de Casa',
        description: 'Objetos do dia a dia e itens de costura.',
        icons: [Scissors, Home, Heart, Star, Music, Key, Mail, Flag, Shirt, Anchor],
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 'passeio',
        name: 'Um Passeio no Parque',
        description: 'Carros, bicicletas e tudo o que vemos lá fora.',
        icons: [Car, Bike, TrainFront, Plane, Globe, Camera, Smile, Fish, Shell, Bone],
        color: 'bg-purple-100 text-purple-600'
    }
];

export interface GameFigure {
    id: string;
    icon: any;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    isTarget: boolean;
}

export const getFigureDifficultyConfig = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'FACIL':
            return { itemCount: 9, gridMode: true, columns: 3 };
        case 'MEDIO':
            return { itemCount: 20, gridMode: false, overlap: false };
        case 'DIFICIL':
            return { itemCount: 45, gridMode: false, overlap: true };
        default:
            return { itemCount: 9, gridMode: true, columns: 3 };
    }
};
