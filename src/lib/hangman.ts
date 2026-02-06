export interface HangmanCategory {
    id: string;
    name: string;
    description: string;
    words: { term: string; hint: string }[];
}

export const HANGMAN_CATEGORIES: HangmanCategory[] = [
    {
        id: 'flores',
        name: 'Flores e Jardim',
        description: 'Belezas da natureza para colorir o dia.',
        words: [
            { term: 'ROSA', hint: 'A rainha das flores, tem espinhos.' },
            { term: 'LIRIO', hint: 'Uma flor branca associada à pureza.' },
            { term: 'CRAVO', hint: 'Muito comum em festas e lapelas.' },
            { term: 'MARGARIDA', hint: 'Uma flor branca com miolo amarelo.' },
            { term: 'ORQUIDEA', hint: 'Uma flor elegante e muito variada.' },
            { term: 'GIRASSOL', hint: 'A flor que segue a luz do sol.' },
            { term: 'HORTENSIA', hint: 'Famosa em jardins de Gramado, pode ser azul ou rosa.' },
            { term: 'AZALEIA', hint: 'Uma flor muito comum em jardins brasileiros.' },
            { term: 'PRIMAVERA', hint: 'A estação em que as flores nascem.' },
            { term: 'MANJERICAO', hint: 'Uma erva cheirosa para o jardim e a cozinha.' },
            { term: 'LAVANDA', hint: 'Conhecida pelo seu perfume relaxante.' },
            { term: 'CRISANTEMO', hint: 'Uma flor com muitas pétalas, comum no outono.' },
            { term: 'BOUGAINVILLE', hint: 'Uma trepadeira muito florida e colorida.' }
        ]
    },
    {
        id: 'cozinha',
        name: 'Receitas de Família',
        description: 'Aromas e sabores que trazem boas lembranças.',
        words: [
            { term: 'PURA', hint: 'Água sem gás ou algo sem misturas.' },
            { term: 'CAFE', hint: 'A bebida preta preferida de manhã.' },
            { term: 'PAO', hint: 'O alimento mais básico da mesa.' },
            { term: 'BROA', hint: 'Um bolinho de milho delicioso com café.' },
            { term: 'QUINDIM', hint: 'Um doce amarelo brilhante feito com ovos.' },
            { term: 'POLENTA', hint: 'Feita de milho, muito comum em reuniões de família.' },
            { term: 'FEIJOADA', hint: 'O prato brasileiro mais famoso do sábado.' },
            { term: 'CANJICA', hint: 'Doce típico de festa junina feito com milho branco.' },
            { term: 'PUDIM', hint: 'A sobremessa clássica de domingo.' },
            { term: 'LASANHA', hint: 'Massa em camadas que todo mundo adora.' },
            { term: 'TUTU', hint: 'Feijão batido com farinha de mandioca.' },
            { term: 'STROGONOFF', hint: 'Prato de carne com creme de leite e batata palha.' },
            { term: 'BRIGADEIRO', hint: 'O docinho de chocolate mais amado das festas.' }
        ]
    },
    {
        id: 'familia',
        name: 'Amor e Família',
        description: 'O que há de mais precioso na vida.',
        words: [
            { term: 'MAI', hint: 'Forma carinhosa de falar mãe em algumas regiões.' },
            { term: 'PAI', hint: 'O herói de muitos filhos.' },
            { term: 'VOVÓ', hint: 'Quem faz os melhores doces do mundo.' },
            { term: 'FILHO', hint: 'O fruto do amor dos pais.' },
            { term: 'GRATIDAO', hint: 'O sentimento de agradecer pelas coisas boas.' },
            { term: 'CARINHO', hint: 'Um gesto de afeto e cuidado.' },
            { term: 'ABRACO', hint: 'Um aperto gostoso que conforta.' },
            { term: 'FELICIDADE', hint: 'O que desejamos para quem amamos.' },
            { term: 'PACIENCIA', hint: 'Uma virtude importante para a harmonia.' },
            { term: 'RESPEITO', hint: 'A base de qualquer bom relacionamento.' },
            { term: 'SAUDADE', hint: 'O que sentimos de quem está longe.' },
            { term: 'ALEGRIA', hint: 'O sorriso que ilumina a casa.' },
            { term: 'COMPREENSAO', hint: 'Entender o lado do outro com amor.' },
            { term: 'CONFRATERNIZACAO', hint: 'O ato de reunir a família para celebrar.' }
        ]
    },
    {
        id: 'casa',
        name: 'Coisas de Casa',
        description: 'Objetos que fazem parte do nosso dia a dia.',
        words: [
            { term: 'LAR', hint: 'Onde nosso coração se sente seguro.' },
            { term: 'CAMA', hint: 'Lugar de descanso e sonhos.' },
            { term: 'MESA', hint: 'Onde a família se reúne para comer.' },
            { term: 'BALEIRO', hint: 'Onde guardamos os doces para os netos.' },
            { term: 'CRISTALEIRA', hint: 'Móvel onde ficam as louças bonitas.' },
            { term: 'POLTRONA', hint: 'O lugar preferido para descansar e ler.' },
            { term: 'ALMOFADA', hint: 'Para deixar o sofá mais aconchegante.' },
            { term: 'VARANDA', hint: 'Lugar bom para ver o movimento e tomar um ar.' },
            { term: 'RELOGIO', hint: 'Aquele que marca as horas na parede.' },
            { term: 'QUADRO', hint: 'Uma pintura ou foto que enfeita a sala.' },
            { term: 'CHAMINÉ', hint: 'Por onde sai a fumaça do fogão a lenha.' },
            { term: 'GELADEIRA', hint: 'Onde guardamos os alimentos gelados.' },
            { term: 'ESCRIVANINHA', hint: 'Móvel pequeno para escrever cartas ou estudar.' }
        ]
    }
];

export const getRandomWord = (category: HangmanCategory) => {
    const randomIndex = Math.floor(Math.random() * category.words.length);
    return category.words[randomIndex];
};

export const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * HANGMAN_CATEGORIES.length);
    return HANGMAN_CATEGORIES[randomIndex];
};
