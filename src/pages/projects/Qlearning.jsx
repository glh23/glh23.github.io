import React, { useState, useEffect, useRef } from "react";

// Game constants
const EMPTY = null;
const AGENT = "X";
const USER = "O";
const BOARD_SIZE = 3;

// Function to check if there is a winner or a draw
function checkWinner(board) {
  const lines = [
    [[0,0],[0,1],[0,2]], // Rows
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], // Columns
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], // Diagonals
    [[0,2],[1,1],[2,0]],
  ];
  // Check each line for same non-empty symbol
  for (let line of lines) {
    const [a,b,c] = line;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) return board[a[0]][a[1]]; 
  }
  // If all cells are filled and no winner, it's a draw
  if (board.flat().every(cell => cell !== EMPTY)) return "draw";
  return null; 
}

// Convert board 2D array into a single string for Q-table key
function serializeBoard(board) {
  return board.flat().map(cell => cell || "-").join("");
}

// Get all empty cells to find where a move can be made
function getAvailableActions(board) {
  const actions = [];
  for(let r=0; r<BOARD_SIZE; r++) {
    for(let c=0; c<BOARD_SIZE; c++) {
      if(board[r][c] === EMPTY) actions.push([r,c]);
    }
  }
  return actions;
}

// Main React component for the User vs Q-Learning Agent game
export default function UserVsQLearning() {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  // State to track current player and winner
  const [currentPlayer, setCurrentPlayer] = useState(AGENT);
  const [winner, setWinner] = useState(null);

  // Q-table to store state-action values
  const qTable = useRef({});
  const episodeHistory = useRef([]); 

  // Q-learning parameters :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const alpha = 0.5;
  const gamma = 0.9;
  const epsilon = 0.2;
  const [pretrainCount, setPretrainCount] = useState(50); // Number of pretraining episodes

  // Reset the game board and states
  function resetGame() {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setWinner(null);
    setCurrentPlayer(AGENT);
    episodeHistory.current = [];
  }

  // Agent picks an action based on Q-table and greedy exploration policy
  function agentChooseAction(stateStr, availableActions) {
    // If state not in Q-table, initialize Q-values for all actions as 0
    if (!(stateStr in qTable.current)) {
      qTable.current[stateStr] = {};
      availableActions.forEach((_, i) => qTable.current[stateStr][i] = 0);
    }
    // Exploration: pick random action sometimes
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * availableActions.length);
    }
    // Exploitation: pick action with highest Q-value
    const qValues = qTable.current[stateStr];
    let maxQ = -Infinity;
    let bestAction = 0;
    for (let i=0; i<availableActions.length; i++) {
      if (qValues[i] > maxQ) {
        maxQ = qValues[i];
        bestAction = i;
      }
    }
    return bestAction;
  }

  // Update Q-table values based on game result and episode history
  function updateQTable(reward) {
    let target = reward;
    // Walk backward through the moves in the episode to update Q-values
    for(let i = episodeHistory.current.length -1; i >= 0; i--) {
      const { state, action } = episodeHistory.current[i];
      const qValues = qTable.current[state];
      const oldQ = qValues[action];
      // Q-learning formula update
      qValues[action] = oldQ + alpha * (target - oldQ);
      // Update target for previous state-action pair 
      target = qValues[action] * gamma;
    }
    episodeHistory.current = []; 
  }

  // Agent makes a move based on current board and Q-table
  function agentMove() {
    if (winner) return; // Stop if game over
    const stateStr = serializeBoard(board);
    const availableActions = getAvailableActions(board);
    // If no available actions, return
    if (availableActions.length === 0) return; 

    // Agent picks action and stores it in episode history for learning later
    const actionIdx = agentChooseAction(stateStr, availableActions);
    const [r,c] = availableActions[actionIdx];
    episodeHistory.current.push({ state: stateStr, action: actionIdx });

    // Make the move on a new board copy
    const newBoard = board.map(row => row.slice());
    newBoard[r][c] = AGENT;
    setBoard(newBoard);

    // Check if this move ended the game
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      // Give reward
      updateQTable(win === AGENT ? 1 : (win === "draw" ? 0 : -1));
      return;
    }
    setCurrentPlayer(USER); // User moves next
  }

  // User clicks a cell to make a move
  function handleUserMove(row, col) {
    // Ignore clicks if game over, not users turn, or cell occupied
    if (winner || currentPlayer !== USER || board[row][col] !== EMPTY) return;

    // Apply users move to new board copy
    const newBoard = board.map(row => row.slice());
    newBoard[row][col] = USER;
    setBoard(newBoard);

    // Check if user won or if its a draw
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      // Agent learns from this outcome (negative reward if user won)
      updateQTable(win === AGENT ? 1 : (win === "draw" ? 0 : -1));
      return;
    }
    setCurrentPlayer(AGENT); 
  }

  // Effect hook triggers agents move when its agents turn
  useEffect(() => {
    if (currentPlayer === AGENT && !winner) {
      const timer = setTimeout(() => {
        agentMove();
      }, 300); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, board]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 flex flex-col items-center justify-center">
      <div className="card max-w-md w-full bg-base-200 border border-base-300 shadow-xl p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center select-none">
          Play Against Q-Learning Agent
        </h1>

        <div className="my-4">
          <label className="label">
            <span className="label-text">Pre-train Agent (episodes):</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={pretrainCount}
            onChange={(e) => setPretrainCount(parseInt(e.target.value))}
            className="range range-primary w-full"
          />
          <div className="text-xs text-center mt-1">
            {pretrainCount} episodes
          </div>
        </div>

        {/* Board grid: 3x3 clickable cells */}
        <div className="grid grid-cols-3 gap-4 mb-6" style={{ userSelect: "none" }}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleUserMove(r, c)} 
                className={`
                  flex items-center justify-center
                  w-20 h-20 md:w-24 md:h-24
                  rounded-lg cursor-pointer
                  border-4
                  ${cell === AGENT ? "border-primary text-primary font-extrabold" : ""}
                  ${cell === USER ? "border-accent text-accent font-extrabold" : ""}
                  ${cell === EMPTY ? "border-base-300 text-neutral-content" : ""}
                  text-5xl select-none
                  transition-colors duration-300
                  hover:bg-base-300
                  ${currentPlayer === USER && cell === EMPTY ? "hover:bg-base-300 cursor-pointer" : "cursor-default"}
                `}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        {/* Display winner or draw message */}
        {winner && (
          <div
            className={`
              mb-6 p-4 rounded-md text-center
              ${winner === "draw"
                ? "bg-secondary text-white font-bold"
                : winner === AGENT
                ? "bg-primary text-primary-content"
                : "bg-accent text-accent-content"}
              font-semibold text-xl select-none
            `}
          >
            {winner === "draw" ? "It's a draw!" : `Winner: ${winner}`}
          </div>
        )}

        {/* Button to reset the game */}
        <button className="btn btn-primary w-full" onClick={resetGame}>
          Reset Game
        </button>

        {/* Info about the game */}
        <p className="text-center text-xs text-base-content mt-4 opacity-60 select-none">
          You play <span className="font-bold text-accent">O</span>. Agent plays{" "}
          <span className="font-bold text-primary">X</span> and learns as it plays.
        </p>

        {/* Display current Q-table size to show learning progress */}
        <p className="text-center text-xs text-base-content mt-2 opacity-60 select-none">
          Q-table size: <span className="font-mono">{Object.keys(qTable.current).length}</span>
        </p>

        <p className="text-center text-xs text-base-content mt-2 opacity-60 select-none">
            The agent starts getting better around Q-table size 50 - 100.
        </p>
      </div>
    </div>
  );
}

