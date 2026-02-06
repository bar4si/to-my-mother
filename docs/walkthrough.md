# Publicação no GitHub Pages

O projeto "to-my-mother" já está preparado para publicação automática.

## Mudanças Realizadas / Verificadas
- [x] **Configuração de Build**: `base: './'` no `vite.config.ts` verificado.
- [x] **Workflow de Deployment**: Arquivo `.github/workflows/deploy.yml` configurado para GitHub Actions.
- [x] **Verificação de Build**: Build local executado com sucesso.
- [x] **Documentação Atualizada**: `README.md` e `README_pt.md` atualizados com o link de acesso, detalhes do PWA e roadmap.
- [x] **Contraste Aprimorado**: Cores do tema ajustadas para máxima legibilidade (fundo branco puro e textos em tons de slate escuro).
- [x] **Acessibilidade Visível**: Aumentado o peso das fontes e a clareza dos botões no menu principal e no jogo de caça-palavras.
- [x] **Caça-Palavras Gigante**: Grid travado em 8x8 com letras em tamanho `text-3xl`. O tabuleiro agora expande até as bordas da tela no celular, aproveitando 100% do espaço disponível.
- [x] **Mural de Conquistas Afetivas**: 
    - **15 Insígnias**: Uma jornada poética desde "Doutora em Carinho" até "Lenda do Amor Infinito".
    - **Barra de Progresso**: Feedback visual imediato do avanço cognitivo.
    - **Sistema 10.000+**: Progressão infinita com estrelas de prestígio, garantindo que o jogo continue recompensador para sempre.
- [x] **Painel de Controle Unificado**:
    - **Integração Inteligente**: Seletor de dificuldade movido para dentro do Mural de Conquistas, centralizando todas as configurações e progressos em um só lugar.
    - **UX para Idosos**: Botões de nível agora são horizontais e compactos, mas preservam uma área de toque ampla e ícones claros.
    - **Feedback Dinâmico**: O botão do nível selecionado agora possui uma animação sutil (bounce) e cor de destaque, facilitando a identificação visual.
- [x] **PWA e Metadados**: Pasta `public` criada, manifesto configurado e ícone SVG adicionado para suporte completo a PWA.
- [x] **Remoção de Placeholders**: Removido o jogo da memória ("Em breve") do menu e da documentação para focar na experiência atual.

## Passos Finais (No GitHub) ⚙️

Como estamos usando o **GitHub Actions** para fazer o build, você precisa avisar o GitHub:

1. Acesse o seu repositório no GitHub.
2. Clique na aba **Settings** (Configurações) no menu superior.
3. No menu lateral esquerdo, clique em **Pages**.
4. Procure a seção **Build and deployment > Source**.
5. Mude de "Deploy from a branch" para **GitHub Actions**.

### Por que isso é necessário?
Por padrão, o GitHub tenta publicar arquivos que já estão prontos em uma branch. Mas como seu projeto precisa ser "compilado" (build) antes de rodar, o arquivo `.github/workflows/deploy.yml` que eu criei faz esse trabalho. Ativar essa opção permite que o GitHub use o resultado dessa automação.

> [!TIP]
> Após mudar essa configuração, o GitHub Actions deve disparar um novo build automaticamente. Você pode acompanhar na aba **Actions**.
