export type Difficulty = 'FACIL' | 'MEDIO' | 'DIFICIL';

export interface WordCategory {
    id: string;
    name: string;
    difficulty: Difficulty;
    words: string[];
}

export const CATEGORIES: WordCategory[] = [
    // FACIL
    {
        id: 'cozinha-1',
        name: "Cozinha Simples",
        difficulty: 'FACIL',
        words: ["BOLO", "CAFÉ", "PÃO", "DOCE", "MEL", "SAL", "SOPA", "CHÁ", "OVO", "LEITE", "PUDIM", "BOLA", "FACA", "MESA", "PIA"]
    },
    {
        id: 'familia-1',
        name: "Família",
        difficulty: 'FACIL',
        words: ["MÃE", "PAI", "VÓ", "VÔ", "TIA", "TIO", "NETO", "FILHO", "CASA", "AMOR", "VIDA", "NOME", "FOTO", "BEM", "LAR"]
    },
    {
        id: 'casa-1',
        name: "No Lar",
        difficulty: 'FACIL',
        words: ["MESA", "SOFÁ", "CAMA", "PIA", "LUZ", "RUA", "PORTA", "CHAVE", "SALA", "COPO", "PRATO", "VILA", "SOL", "LUA", "CEU"]
    },
    {
        id: 'natureza-1',
        name: "Céu e Sol",
        difficulty: 'FACIL',
        words: ["SOL", "LUA", "CÉU", "MAR", "RIO", "FLOR", "MATO", "AR", "DIA", "LUZ", "NUVEM", "ROSA", "VALE", "AZUL", "PAZ"]
    },

    // MEDIO
    {
        id: 'cozinha-2',
        name: "Fogão a Lenha",
        difficulty: 'MEDIO',
        words: ["FEIJÃO", "ARROZ", "LEITE", "PUDIM", "FOGÃO", "LENHA", "SOPA", "PANELA", "FORNO", "PRATO", "COLHER", "GARFO", "BANHA", "MILHO", "BROA", "DOCES", "BALAS"]
    },
    {
        id: 'nostalgia-2',
        name: "Anos de Ouro",
        difficulty: 'MEDIO',
        words: ["RÁDIO", "DISCO", "VALSA", "BAILE", "FESTA", "CANTAR", "SORRIR", "AMIGOS", "MUSICA", "CINEMA", "JORNAL", "BONDE", "PRAÇA", "CORETO", "DANCAR", "VIOLAO"]
    },
    {
        id: 'jardim-2',
        name: "No Quintal",
        difficulty: 'MEDIO',
        words: ["ÁRVORE", "FRUTA", "HORTA", "TERRA", "JARDIM", "GRAMA", "MANHÃ", "FLORES", "POMAR", "FOLHA", "PASSARO", "PORTAO", "MURO", "CERCA", "VASO", "CHUVA"]
    },
    {
        id: 'oficio-2',
        name: "Trabalho Manual",
        difficulty: 'MEDIO',
        words: ["LINHA", "AGULHA", "COSTURA", "TECIDO", "PONTO", "CROCHÊ", "RENDAS", "TRICO", "TESOURA", "MODA", "VESTIDO", "ROUPA", "MANTA", "BORDAR", "DEDAL", "RETALHO"]
    },

    // DIFICIL
    {
        id: 'cidade-3',
        name: "Passeio na Cidade",
        difficulty: 'DIFICIL',
        words: ["CINEMA", "TEATRO", "PRAÇA", "CORETO", "PASSEIO", "BONDE", "CALÇADA", "ESQUINAS", "AVENIDA", "CARRETA", "VIAGEM", "ESTAÇÃO", "DESTINO", "CAMINHO", "CIDADE", "IGREJA", "MERCADO"]
    },
    {
        id: 'sentimento-3',
        name: "Grandes Lembranças",
        difficulty: 'DIFICIL',
        words: ["SAUDADE", "CARINHO", "AMIZADE", "ALEGRIA", "TESOURO", "HISTÓRIA", "MEMÓRIA", "ESPERANÇA", "ETERNIDADE", "FELICIDADE", "GRATIDÃO", "RESPEITO", "CORAÇÃO", "PRESENTE", "PASSADO"]
    },
    {
        id: 'natureza-3',
        name: "Belezas Naturais",
        difficulty: 'DIFICIL',
        words: ["CASCATA", "FLORESTA", "ORQUÍDEA", "PASSARINHO", "BORBOLETA", "VAGA-LUME", "NATUREZA", "ESTRELAS", "HORIZONTE", "MONTANHA", "ARCO-IRIS", "ENTARDECER", "AMANHECER", "ALVORADA"]
    },
    {
        id: 'casa-3',
        name: "Aconchego do Lar",
        difficulty: 'DIFICIL',
        words: ["TELEFONE", "VITROLA", "MÁQUINA", "ESCREVER", "ALMOFADA", "RETRATO", "PASSEIO", "VARANDA", "ORATÓRIO", "JANELAS", "QUINTAL", "ESCADAS", "PINTURA", "FAMÍLIA", "DESCANSO"]
    }
];

export const VICTORY_PHRASES = [
    "Você é maravilhosa!",
    "Parabéns, Mamãe!",
    "Seu coração é de ouro!",
    "Que memória incrível!",
    "Você é nosso maior tesouro!",
    "Muito bem, campeã!",
    "Obrigado por ser nossa luz!",
    "Sua inteligência nos orgulha!",
    "Um exemplo para todos nós!",
    "Você brilha mais que o sol!"
];
