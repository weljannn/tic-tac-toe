import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null)); // Represents the 3x3 grid
  const [isXNext, setIsXNext] = useState(true); // Tracks whose turn it is
  const [scores, setScores] = useState({ X: 0, O: 0 }); // Tracks scores for X and O
  const [isAgainstComputer, setIsAgainstComputer] = useState(false); // Tracks if playing against the computer
  const winner = calculateWinner(board); // Determines if there's a winner

  // Update scores when there's a winner
  useEffect(() => {
    if (winner) {
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    }
  }, [winner]);

  // Handle a player's move
  const handleClick = (index) => {
    if (board[index] || winner) return; // Prevent overwriting or playing after a win
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // If playing against the computer and it's the computer's turn, make a move
    if (isAgainstComputer && !winner && newBoard.includes(null)) {
      const computerMove = getComputerMove(newBoard);
      if (computerMove !== -1) {
        newBoard[computerMove] = "O";
        setBoard(newBoard);
        setIsXNext(true);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  // Render a single grid cell
  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  // Determine the game status message
  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every((cell) => cell !== null)) {
      return "It's a draw!";
    } else {
      return `Next player: ${isXNext ? "X" : "O"}`;
    }
  };

  // Get the computer's move (simple AI)
  const getComputerMove = (board) => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((cell) => cell !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <div className="status">{getStatus()}</div>
      <div className="scores">
        <p>X: {scores.X}</p>
        <p>O: {scores.O}</p>
      </div>
      <div className="board">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="cell-container">
              {renderCell(index)}
            </div>
          ))}
      </div>
      <div className="controls">
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
        <button className="reset-button" onClick={resetScores}>
          Reset Scores
        </button>
        <button
          className="reset-button"
          onClick={() => setIsAgainstComputer(!isAgainstComputer)}
        >
          {isAgainstComputer ? "Play Against Human" : "Play Against Computer"}
        </button>
      </div>
    </div>
  );
}

// Helper function to calculate the winner
const calculateWinner = (board) => {
  const winningLines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Diagonal
  ];

  for (let line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export default App;