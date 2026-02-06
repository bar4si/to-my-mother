# Memory Game Implementation Plan 🧠✨

Implement a memory matching game tailored for seniors, featuring large visual targets and nostalgic themes.

## User Review Required

> [!IMPORTANT]
> The game will use a 4x3 or 4x4 grid to keep the number of items manageable and the icons large enough for easy visibility.

## Proposed Changes

### Logic & Data

#### [NEW] [memory.ts](file:///d:/projects/anti/to-my-mother/src/lib/memory.ts)
- Define nostalgic themes (e.g., "Flores", "Café", "Passarinhos").
- Implement card shuffling and pair generation logic.

### Components

#### [NEW] [MemoryGame.tsx](file:///d:/projects/anti/to-my-mother/src/components/MemoryGame.tsx)
- Create a grid-based matching game.
- Use large cards (minimum 80x80px) with high-contrast borders.
- Implement smooth flip animations using Framer Motion.
- Add a victory state with a celebratory message.

#### [MODIFY] [GameMenu.tsx](file:///d:/projects/anti/to-my-mother/src/components/GameMenu.tsx)
- Restore/Add the "Memory Game" option to the menu.
- Ensure the icon and description match the "Nostalgic" theme.

#### [MODIFY] [App.tsx](file:///d:/projects/anti/to-my-mother/src/App.tsx)
- Add state to toggle between Word Search and Memory Game.
- Integrate the `MemoryGame` component into the main view.

### Documentation

#### [MODIFY] [todo.md](file:///d:/projects/anti/to-my-mother/docs/todo.md)
- Move "Jogo da Memória" from "Next Steps" to "Completed" (once done).

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no type errors.

### Manual Verification
- Test matching logic (match, mismatch, reset).
- Verify icon size on mobile devices.
- Experience the "Nostalgic" themes.
