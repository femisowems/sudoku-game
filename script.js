document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".sudoku-board");
    const solveButton = document.getElementById("solve-button");
    const resetButton = document.getElementById("reset-button");
    const message = document.getElementById("message");
    const timer = document.querySelector(".timer");

    const initialBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    let startTime = 0;
    let timerInterval;
    let userStartedInput = false; // Flag to track user's first input

    // Function to update the timer display
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Function to start the timer
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000); // Update timer every second
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Function to validate and restrict input to numeric values
    function handleCellInput(event) {
        const cell = event.target;
        const inputValue = cell.textContent.trim();
        if (/^[1-9]$/.test(inputValue) || inputValue === "") {
            // Valid numeric input or empty cell (clearing)
            cell.style.color = "#1E1E1F"; // Color for editable numbers
        } else {
            // Invalid input, reset the cell content
            cell.textContent = "";
        }
        if (!userStartedInput) {
            userStartedInput = true;
            startTimer(); // Start the timer on the first user input
        }
    }

    // Function to generate the Sudoku board
    function generateBoard() {
        for (let i = 0; i < 9; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement("td");
                const cellValue = initialBoard[i][j];
                if (cellValue !== 0) {
                    cell.textContent = cellValue;
                    cell.style.color = "#8A6552"; // Color for initial default numbers
                    cell.setAttribute("contenteditable", "false"); // Not editable
                } else {
                    cell.setAttribute("contenteditable", "true"); // Editable
                    cell.style.color = "#1E1E1F"; // Color for editable numbers
                    cell.addEventListener("input", handleCellInput); // Add input event listener
                }
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }

    // Function to solve the Sudoku puzzle (You can implement your solving algorithm here)
    function solveSudoku() {
        // Implement your Sudoku solving algorithm here
        // Update the board with the solved values
        // Example: initialBoard = solveSudoku(initialBoard);
        // Then, update the HTML board with the solved values
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = board.rows[i].cells[j];
                cell.textContent = initialBoard[i][j] !== 0 ? initialBoard[i][j] : "";
            }
        }
        stopTimer(); // Stop the timer when the puzzle is solved
    }

    // Function to reset the Sudoku board to the initial state
    function resetBoard() {
        const cells = document.querySelectorAll(".sudoku-board td");
        cells.forEach((cell, index) => {
            const i = Math.floor(index / 9);
            const j = index % 9;
            const cellValue = initialBoard[i][j];
            cell.textContent = cellValue !== 0 ? cellValue : "";
            cell.style.color = cellValue !== 0 ? "#8A6552" : "#1E1E1F";
            cell.setAttribute("contenteditable", cellValue === 0 ? "true" : "false");
        });
        message.textContent = "";
        stopTimer(); // Stop the timer when the board is reset
        timer.textContent = "00:00"; // Reset the timer display
        userStartedInput = false; // Reset the user input flag
    }

    // Function to check if the Sudoku puzzle is solved correctly
    function isSolvedCorrectly() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = board.rows[i].cells[j];
                const cellValue = parseInt(cell.textContent, 10);
                if (cellValue !== initialBoard[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    generateBoard();

    solveButton.addEventListener("click", () => {
        solveSudoku();
        if (isSolvedCorrectly()) {
            message.textContent = "Solved correctly!";
            message.style.color = "green";
        } else {
            message.textContent = "Solution is incorrect!";
            message.style.color = "red";
        }
    });

    resetButton.addEventListener("click", resetBoard);
});
