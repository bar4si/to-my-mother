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
- [x] **Dificuldade Real na Memória**:
    - **Tamanho Padronizado**: Independente do nível, as cartas agora mantêm o mesmo tamanho (grid fixo de 4 colunas) para consistência visual.
    - **Ícones Gigantes**: As figuras agora aproveitam todo o espaço da carta (`w-14 h-14`), maximizando a visibilidade.
    - **Fácil**: 8 cartas (4 pares) e tempo extra para memorizar (2s).
    - **Médio**: 12 cartas (6 pares) e tempo equilibrado (1.2s).
    - **Difícil**: 16 cartas (8 pares) e tempo curto (0.8s), exigindo mais foco.
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
