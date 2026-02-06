# Plano: Caça-Palavras Nostalgia 1941 (Mobile First + UX Senior)

Este projeto visa criar um jogo de caça-palavras digital otimizado para **dispositivos móveis**, personalizado para uma pessoa nascida em 1941.

## Índice
1. [Arquitetura Sugerida](#1-arquitetura-sugerida)
2. [Diretrizes de Design UX Senior](#2-diretrizes-de-design-ux-senior)
3. [User Review Required](#3-user-review-required)
4. [Mudanças Propostas](#4-mudanças-propostas)
5. [Plano de Verificação](#5-plano-de-verificação)

---

## 1. Arquitetura Sugerida
Recomendamos o uso do **Vite** com **React** e **TypeScript**, complementado por:

> [!TIP]
> **Por que TypeScript?**
> - **Robustez**: Evita erros comuns de digitação e lógica, garantindo que o jogo funcione sempre perfeitamente para sua mãe.
> - **Manutenibilidade**: Facilita a adição de novas palavras ou funcionalidades no futuro.

> [!TIP]
> **Framework de Componentes: Shadcn/UI (Radix UI)**
> - **Acessibilidade Nativa**: Garantia de que cada interação seja amigável a tecnologias assistivas e navegação por toque.
> - **Customização**: Hit targets de **60px** configurados em todos os elementos clicáveis.
>
> **Animações: Framer Motion**
> - Feedback cognitivo suave para sucessos e erros.

## 2. Diretrizes de Design UX Senior (85+ anos)
Assumindo o papel de **UX Designer Senior**, aplicaremos os seguintes pilares:

> [!IMPORTANT]
> **2.1 Acessibilidade Visual**: Contraste 7:1 (Azul Marinho sobre Creme), fontes Sans-Serif peso médio, letras do grid em 28px+.
> **2.2 Ergonomia Táctil**: Hit targets de 60px. Seleção flexível (Arraste ou Toque Sequencial).
> **2.3 Evolução e Recompensa**: Salvaremos o progresso no `localStorage` para que ela possa ver sua "Galeria de Vitórias".

## 3. User Review Required
> [!IMPORTANT]
> **Offline Total**: O jogo funcionará 100% sem internet após o primeiro acesso.
> **Persistência**: Gostaríamos de salvar cada jogo completado em uma "Galeria". Você acha legal se cada vitória mostrasse uma frase carinhosa ou uma foto de família?

## 4. Mudanças Propostas

### 4.1 Interface, Persistência e Afeto (React + Shadcn/UI)
#### [NEW] [storage.ts](file:///d:/projects/anti/power-ai/to-my-mother/src/lib/storage.ts)
- Lógica para salvar progresso e histórico de jogos completados no navegador.

#### [NEW] [phrases.ts](file:///d:/projects/anti/power-ai/to-my-mother/src/lib/phrases.ts)
- Coleção de frases carinhosas e encorajadoras para serem exibidas após cada vitória.

#### [NEW] [WordSearch.tsx](file:///d:/projects/anti/power-ai/to-my-mother/src/components/WordSearch.tsx)
- Componente principal com suporte a Toque Sequencial e exibição da mensagem de vitória.

### 4.2 Infraestrutura Offline (PWA)
#### [NEW] [vite.config.ts](file:///d:/projects/anti/power-ai/to-my-mother/vite.config.ts)
- Configuração do `vite-plugin-pwa` para suporte offline total.

## 5. Plano de Verificação

### 5.1 Verificação Manual
- Validar se ao fechar e abrir o app o progresso é mantido.
- Verificar se o histórico de vitórias é exibido corretamente.
- Testar legibilidade com "filtro de visão reduzida".
