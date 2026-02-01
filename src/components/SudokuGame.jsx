import { useState, useEffect, useRef } from 'react';
import Board from './Board';
import Controls from './Controls';

// Helper Logic extracted from legacy script
const generateEmptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num ||
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
};

const solve = (board) => {
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
};

const isSafeInBox = (board, rowStart, colStart, num) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[rowStart + i][colStart + j] === num) return false;
        }
    }
    return true;
};

const fillBox = (board, row, col) => {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isSafeInBox(board, row, col, num));
            board[row + i][col + j] = num;
        }
    }
};

const generateSudoku = () => {
    let board = generateEmptyBoard();
    // Fill diagonal 3x3 matrices
    for (let i = 0; i < 9; i = i + 3) {
        fillBox(board, i, i);
    }
    solve(board);
    return board;
};

const removeNumbers = (board, count = 40) => {
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
};

const SudokuGame = () => {
    const [initialBoard, setInitialBoard] = useState(generateEmptyBoard());
    const [currentBoard, setCurrentBoard] = useState(generateEmptyBoard());
    const [solutionBoard, setSolutionBoard] = useState(generateEmptyBoard());
    const [timer, setTimer] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [message, setMessage] = useState({ text: "", color: "" });
    const [errors, setErrors] = useState(new Set()); // Store "row-col" strings of error cells

    const timerRef = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startNewGame = () => {
        stopTimer();
        const solution = generateSudoku();
        const fullBoard = JSON.parse(JSON.stringify(solution));
        const initial = removeNumbers(fullBoard, 40);

        setSolutionBoard(solution);
        setInitialBoard(initial);
        setCurrentBoard(JSON.parse(JSON.stringify(initial)));

        setTimer(0);
        setGameActive(true);
        setMessage({ text: "", color: "" });
        setErrors(new Set());
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        if (gameActive) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            stopTimer();
        }
        return () => stopTimer();
    }, [gameActive]);

    // Initial game start
    useEffect(() => {
        startNewGame();
    }, []);

    const handleCellChange = (row, col, value) => {
        if (!gameActive) return;
        const newBoard = JSON.parse(JSON.stringify(currentBoard));
        newBoard[row][col] = value === "" ? 0 : parseInt(value);
        setCurrentBoard(newBoard);

        // Clear error if user modifies cell
        if (errors.has(`${row}-${col}`)) {
            const newErrors = new Set(errors);
            newErrors.delete(`${row}-${col}`);
            setErrors(newErrors);
        }
    };

    const handleCheck = () => {
        if (!gameActive) return;

        let isCorrect = true;
        let isComplete = true;
        const newErrors = new Set();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const val = currentBoard[i][j];
                if (val === 0) {
                    isComplete = false;
                } else if (val !== solutionBoard[i][j]) {
                    isCorrect = false;
                    if (initialBoard[i][j] === 0) { // Only mark editable cells
                        newErrors.add(`${i}-${j}`);
                    }
                }
            }
        }

        setErrors(newErrors);

        if (isComplete && isCorrect) {
            setMessage({ text: "Congratulations! You solved it!", color: "green" });
            setGameActive(false);
            stopTimer();
        } else if (!isCorrect) {
            setMessage({ text: "There are errors on the board.", color: "red" });
            // Clear message after 2s
            setTimeout(() => setMessage({ text: "", color: "" }), 2000);
        } else {
            setMessage({ text: "Keep going!", color: "#1E1E1F" });
            setTimeout(() => setMessage({ text: "", color: "" }), 2000);
        }
    };

    const handleReset = () => {
        if (!gameActive && initialBoard[0][0] === 0) return; // Don't reset if empty/broken
        setCurrentBoard(JSON.parse(JSON.stringify(initialBoard)));
        setTimer(0);
        setGameActive(true);
        setMessage({ text: "", color: "" });
        setErrors(new Set());
    };

    return (
        <main class="game-container">
            <div className="status-bar">
                <div className="timer">{formatTime(timer)}</div>
                <div className="message" style={{ color: message.color }}>{message.text}</div>
            </div>

            <Board
                initialBoard={initialBoard}
                currentBoard={currentBoard}
                errors={errors}
                onCellChange={handleCellChange}
            />

            <Controls
                onNewGame={startNewGame}
                onCheck={handleCheck}
                onReset={handleReset}
            />
        </main>
    );
};

export default SudokuGame;
