import React from 'react';

const Controls = ({ onNewGame, onCheck, onReset }) => {
    return (
        <div className="controls">
            <button id="new-game-button" className="btn primary" onClick={onNewGame}>New Game</button>
            <button id="solve-button" className="btn secondary" onClick={onCheck}>Check</button>
            <button id="reset-button" className="btn secondary" onClick={onReset}>Reset</button>
        </div>
    );
};

export default Controls;
