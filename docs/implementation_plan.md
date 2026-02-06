# Improve Visual Contrast and Accessibility

Enhance the visual accessibility of the application, especially for seniors, by increasing color contrast and refining UI elements on the home screen.

## Proposed Changes

### Styling & Theme

#### [MODIFY] [tailwind.config.js](file:///d:/projects/anti/to-my-mother/tailwind.config.js)
- Increase background contrast: change `#fdfbf7` (soft cream) to a cleaner white or higher-contrast light shade if needed.
- Darken primary and foreground colors for maximum legibility.
- Update `accent` colors for better distinction from the background.

#### [MODIFY] [index.css](file:///d:/projects/anti/to-my-mother/src/index.css)
- Add accessibility-focused utility classes if necessary (e.g., higher font weights, clearer focus states).

### Components

#### [MODIFY] [App.tsx](file:///d:/projects/anti/to-my-mother/src/App.tsx)
- Ensure background colors and text colors are applied following the new contrast-heavy theme.
- Enhance hierarchy of titles and subtitles.

#### [MODIFY] [GameMenu.tsx](file:///d:/projects/anti/to-my-mother/src/components/GameMenu.tsx)
- [x] Improve contrast of buttons and icons.
- [x] Make the "Status Card" and "Difficulty Selector" more prominent.
- [x] Increase font weight for important labels.

#### [MODIFY] [WordSearch.tsx](file:///d:/projects/anti/to-my-mother/src/components/WordSearch.tsx)
- [x] Darken header background and text.
- [x] Increase grid cell font weight and contrast.
- [x] Improve visibility of found words (use darker greens).
- [x] Enhance the word list at the bottom with higher contrast borders and text.
- [x] Update victory modal colors for maximum clarity.
- [MODIFY] Lock `GRID_SIZE` to 8 for all levels.
- [MODIFY] Use negative margins (`-mx-8`) on the grid container to bleed to the edges of the main card.
- [MODIFY] Increase cell size to `w-10 h-10` (or larger if possible) and font size to `text-3xl`.
- [MODIFY] Adjust word placement logic to handle 8x8 exclusively.
- [MODIFY] Simplify the word list to avoid overcrowding below the large grid.

## Verification Plan

### Automated Checks
- Ensure the build completes without errors.

### Manual Verification
- Test all difficulties to verify the grid adjusts correctly.
- Verify that letters are significantly larger and easier to read.
