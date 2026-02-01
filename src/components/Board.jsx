import React from 'react';

const Board = ({ initialBoard, currentBoard, errors, onCellChange }) => {
    return (
        <table className="sudoku-board">
            <tbody>
                {currentBoard.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cellValue, colIndex) => {
                            const isInitial = initialBoard[rowIndex][colIndex] !== 0;
                            const isError = errors.has(`${rowIndex}-${colIndex}`);

                            // Determine classes
                            let classes = "cell-input";
                            if (isInitial) classes += " initial";
                            else classes += " editable";
                            if (isError) classes += " error";

                            return (
                                <td key={`${rowIndex}-${colIndex}`}>
                                    <input
                                        type="text"
                                        className={classes}
                                        value={cellValue === 0 ? "" : cellValue}
                                        readOnly={isInitial}
                                        maxLength={1}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "" || /^[1-9]$/.test(val)) {
                                                onCellChange(rowIndex, colIndex, val);
                                            }
                                        }}
                                        // Prevent non-numeric keys not strictly handled by regex (optional polish)
                                        data-row={rowIndex}
                                        data-col={colIndex}
                                    />
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Board;
