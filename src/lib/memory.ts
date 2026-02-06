import {
    Flower, Sun, Sprout, Leaf, TreePine, Coffee, Dessert, Utensils, Bird, Feather, Cloud, Heart, Apple, CakeSlice, ChefHat, Moon, Star, Music, Camera, Pizza, Soup, Candy, Wind, Droplets, Trees, CloudSun, Bug, Shell, Fish, Bone, Anchor, Globe, Smile, Bell, Clock, Key, Mail, Phone, Gift, Scissors, Image as ImageIcon,
    Palmtree, Mountain, Waves, Zap, Flame, Snowflake, Umbrella, ShoppingCart,
    Trash2, Search, Settings, House, ShoppingBag, Truck, Car, Bike, Plane,
    TrainFront, Bus, Ship, Tractor, MountainSnow, Telescope, Microscope,
    Book, Pencil, Brush, Music2, Headphones, Radio, Tv, Monitor, Speaker,
    Dog, Cat, Rabbit, Turtle, Snail, Crown, Diamond, Trophy, Medal, Rocket,
    Dumbbell, Gamepad2, Guitar, Drum, Piano, Mic, Headphones as HeadphonesIcon
} from 'lucide-react';
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
        icons: [
            Flower, Sun, Sprout, Leaf, TreePine, Heart, Cloud, Moon,
            Bird, Feather, Star, Wind, Droplets, Trees, CloudSun, Bug,
            Apple, Shell, Fish, Bone, Anchor, Globe, ImageIcon, Smile,
            Bell, Clock, Key, Mail, Phone, Camera, Music, Gift,
            Palmtree, Mountain, Waves, Zap, Flame, Snowflake, Umbrella, ShoppingCart,
            Trash2, Search, Settings, House, ShoppingBag, Truck, Car, Bike, Plane,
            TrainFront, Bus, Ship, Tractor, MountainSnow, Telescope, Microscope,
            Book, Pencil, Brush, Music2, Headphones, Radio, Tv, Monitor, Speaker,
            Dog, Cat, Rabbit, Turtle, Snail, Crown, Diamond, Trophy, Medal, Rocket
        ]
    },
    {
        id: 'cozinha',
        name: 'Hora do Café',
        description: 'Delícias e utensílios que trazem lembranças doces.',
        icons: [
            Coffee, Dessert, Utensils, Apple, CakeSlice, ChefHat, Pizza, Soup,
            Candy, ShoppingBag, ShoppingCart, Dog, Cat, Rabbit, Turtle, Snail,
            Crown, Diamond, Trophy, Medal, Rocket, Dumbbell, Gamepad2, Guitar,
            Drum, Piano, Mic, Telescope, Microscope, Book, Pencil, Brush,
            Music2, HeadphonesIcon, Radio, Tv, Monitor, Speaker, Trash2, Search,
            Settings, House
        ]
    },
    {
        id: 'ceu',
        name: 'Olhando o Céu',
        description: 'A beleza do dia e da noite.',
        icons: [
            Bird, Feather, Cloud, Moon, Star, Sun, Music, Camera,
            Wind, CloudSun, Palmtree, Mountain, Waves, Zap, Flame, Snowflake,
            Umbrella, Plane, Telescope, Microscope, Ship, TrainFront, Bus,
            Tractor, Dog, Cat, Rabbit, Turtle, Snail, Crown, Diamond, Trophy, Medal
        ]
    },
    {
        id: 'hobbies',
        name: 'Tempo de Lazer',
        description: 'Momentos de alegria e criatividade.',
        icons: [
            Music, Camera, Heart, Star, Moon, Flower, Sun, Candy,
            ImageIcon, Bell, Clock, Key, Mail, Phone, Gift, Scissors,
            Book, Pencil, Brush, Music2, HeadphonesIcon, Radio, Tv, Monitor, Speaker,
            Search, Settings, House, ShoppingBag, Truck, Car, Bike, Plane,
            TrainFront, Bus, Ship, Tractor, MountainSnow, Telescope, Microscope,
            Dog, Cat, Rabbit, Turtle, Snail, Crown, Diamond, Trophy, Medal, Rocket
        ]
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
