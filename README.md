# Sudoku Master

A modern, responsive web-based Sudoku game built with vanilla HTML, CSS, and JavaScript.

## Features

- **Dynamic Puzzle Generation**: Generates a new unique Sudoku puzzle every game.
- **Smart Solver**: Includes a backtracking algorithm to solve or verify the board.
- **Interactive UI**:
    - Real-time input checking (prevents invalid characters).
    - Timer to track your speed.
    - highlighting for initial vs user numbers.
    - Error indication for incorrect moves when checking.
- **Responsive Design**: Playable on desktop and mobile devices.

## How to Play

1.  **New Game**: Click the "New Game" button to start a fresh puzzle. The timer will reset and start automatically.
2.  **Fill the Board**: Click on any empty cell (white background) to select it, then type a number from 1 to 9.
3.  **Check Solution**: Click "Check" to verify your current progress.
    -   If you solution is correct and complete, you win!
    -   If there are errors, they will briefly flash red.
4.  **Reset**: Click "Reset" to clear your input and restart the current puzzle from the beginning.

## Technologies Used

-   **HTML5**: Semantic structure.
-   **CSS3**: Flexbox, Grid, Variables, and Animations.
-   **JavaScript (ES6+)**: Game logic, DOM manipulation, and backtracking algorithm.

## Installation

No installation required! Just clone the repository and open `index.html` in your browser.

```bash
git clone https://github.com/femisowems/sudoku-game.git
cd sudoku-game
open index.html
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
