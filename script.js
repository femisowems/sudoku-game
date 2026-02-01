document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.querySelector(".sudoku-board");
    const solveButton = document.getElementById("solve-button");
    const newGameButton = document.getElementById("new-game-button");
    const resetButton = document.getElementById("reset-button");
    const message = document.getElementById("message");
    const timerElement = document.querySelector(".timer");

    let initialBoard = [];
    let currentBoard = [];
    let solutionBoard = [];
    let startTime = 0;
    let timerInterval;
    let gameActive = false;

    // --- Sudoku Logic ---

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num ||
                board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function solve(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (solve(board)) return true;
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function generateSudoku() {
        // Start with empty board
        let board = Array.from({ length: 9 }, () => Array(9).fill(0));

        // Fill diagonal 3x3 matrices (independent of each other)
        for (let i = 0; i < 9; i = i + 3) {
            fillBox(board, i, i);
        }

        // Solve the rest to get a complete valid board
        solve(board);
        return board;
    }

    function fillBox(board, row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!isSafeInBox(board, row, col, num));
                board[row + i][col + j] = num;
            }
        }
    }

    function isSafeInBox(board, rowStart, colStart, num) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[rowStart + i][colStart + j] === num) return false;
            }
        }
        return true;
    }

    function removeNumbers(board, count = 40) {
        let puzzle = JSON.parse(JSON.stringify(board));
        let attempts = count;
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (puzzle[row][col] === 0) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }
            puzzle[row][col] = 0;
            attempts--;
        }
        return puzzle;
    }

    // --- UI Logic ---

    function startNewGame() {
        stopTimer();
        solutionBoard = generateSudoku();
        // Deep copy solution for checking later
        const fullBoard = JSON.parse(JSON.stringify(solutionBoard));

        // Create puzzle by removing numbers
        initialBoard = removeNumbers(fullBoard, 40); // 40 removed numbers = Medium?
        currentBoard = JSON.parse(JSON.stringify(initialBoard)); // Track current state

        renderBoard();
        resetTimer();
        startTimer();
        message.textContent = "";
        gameActive = true;
    }

    function renderBoard() {
        boardElement.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement("td");
                const value = initialBoard[i][j];

                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add("initial");
                    cell.setAttribute("contenteditable", "false");
                } else {
                    cell.textContent = "";
                    cell.classList.add("editable");
                    cell.setAttribute("contenteditable", "true");
                    cell.addEventListener("input", (e) => handleInput(e, i, j));
                    cell.addEventListener("keydown", (e) => handleKeyDown(e));
                }
                row.appendChild(cell);
            }
            boardElement.appendChild(row);
        }
    }

    function handleInput(e, row, col) {
        const cell = e.target;
        const val = cell.textContent.slice(-1); // Get last char entered

        if (/^[1-9]$/.test(val)) {
            cell.textContent = val;
            currentBoard[row][col] = parseInt(val);
            // Optional: Immediate validation visual cue
        } else {
            cell.textContent = "";
            currentBoard[row][col] = 0;
        }

        // Move cursor to end (fix for contenteditable behavior)
        const range = document.createRange();
        const sel = window.getSelection();
        if (cell.childNodes.length > 0) {
            range.setStart(cell.childNodes[0], 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    function handleKeyDown(e) {
        // Allow basic navigation or deletion if needed, 
        // mainly to prevent non-numeric input flicker if possible, 
        // but 'input' handles validation well enough for simple case.
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    }

    // --- Timer Logic ---
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        stopTimer();
        timerElement.textContent = "00:00";
    }

    // --- Event Listeners ---

    solveButton.addEventListener("click", () => {
        if (!gameActive) return;

        // Simple check: compare current board with solution
        let isCorrect = true;
        let isComplete = true;

        const cells = boardElement.querySelectorAll("td");

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cellIndex = i * 9 + j;
                const cell = cells[cellIndex];
                const val = currentBoard[i][j];

                if (val === 0) {
                    isComplete = false;
                } else if (val !== solutionBoard[i][j]) {
                    isCorrect = false;
                    if (cell.classList.contains("editable")) {
                        cell.classList.add("error");
                        setTimeout(() => cell.classList.remove("error"), 2000);
                    }
                }
            }
        }

        if (isComplete && isCorrect) {
            message.textContent = "Congratulations! You solved it!";
            message.style.color = "green";
            stopTimer();
            gameActive = false;
        } else if (!isCorrect) {
            message.textContent = "There are errors on the board.";
            message.style.color = "red";
        } else {
            message.textContent = "Keep going!";
            message.style.color = "#1E1E1F";
        }
    });

    resetButton.addEventListener("click", () => {
        // Reset to initial state of the current game
        if (!gameActive && initialBoard.length === 0) return;

        currentBoard = JSON.parse(JSON.stringify(initialBoard));
        renderBoard();
        resetTimer();
        startTimer();
        message.textContent = "";
        gameActive = true;
    });

    // Make new game button functional (it was added to DOM at top)
    newGameButton.addEventListener("click", startNewGame);

    // Initialize
    startNewGame();
});
