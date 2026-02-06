import { Flower, Sun, Sprout, Leaf, TreePine, Coffee, Dessert, Utensils, Bird, Feather, Cloud, Heart, Apple, CakeSlice, ChefHat, Moon, Star, Music, Camera, Pizza, Soup, Candy } from 'lucide-react';
import React from 'react';

export interface MemoryTheme {
    id: string;
    name: string;
    description: string;
    icons: React.ElementType[];
}

export const MEMORY_THEMES: MemoryTheme[] = [
    {
        id: 'jardim',
        name: 'Jardim da Vovó',
        description: 'Flores e natureza que acalmam o coração.',
        icons: [Flower, Sun, Sprout, Leaf, TreePine, Heart, Cloud, Moon]
    },
    {
        id: 'cozinha',
        name: 'Hora do Café',
        description: 'Delícias e utensílios que trazem lembranças doces.',
        icons: [Coffee, Dessert, Utensils, Apple, CakeSlice, ChefHat, Pizza, Soup]
    },
    {
        id: 'ceu',
        name: 'Olhando o Céu',
        description: 'A beleza do dia e da noite.',
        icons: [Bird, Feather, Cloud, Moon, Star, Sun, Music, Camera]
    },
    {
        id: 'hobbies',
        name: 'Tempo de Lazer',
        description: 'Momentos de alegria e criatividade.',
        icons: [Music, Camera, Heart, Star, Moon, Flower, Sun, Candy]
    }
];

export interface MemoryCard {
    id: string;
    iconIndex: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export const generateCards = (themeId: string, pairCount: number = 6): MemoryCard[] => {
    const theme = MEMORY_THEMES.find(t => t.id === themeId) || MEMORY_THEMES[0];
    const icons = theme.icons.slice(0, pairCount);

    // Create pairs
    const cards: MemoryCard[] = [];
    icons.forEach((_, index) => {
        // First card of pair
        cards.push({
            id: `card-${index}-a`,
            iconIndex: index,
            isFlipped: false,
            isMatched: false
        });
        // Second card of pair
        cards.push({
            id: `card-${index}-b`,
            iconIndex: index,
            isFlipped: false,
            isMatched: false
        });
    });

    // Shuffle
    return cards.sort(() => Math.random() - 0.5);
};
