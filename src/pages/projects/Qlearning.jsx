import React, { useState, useEffect, useRef } from "react";

const EMPTY = null;
const AGENT = "X";
const USER = "O";
const BOARD_SIZE = 3;

function checkWinner(board) {
  const lines = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a[0]][a[1]] &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return board[a[0]][a[1]];
    }
  }
  if (board.flat().every(cell => cell !== EMPTY)) return "draw";
  return null;
}

function serializeBoard(board) {
  return board.flat().map(cell => cell || "-").join("");
}

function getAvailableActions(board) {
  const actions = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) actions.push([r, c]);
    }
  }
  return actions;
}

export default function UserVsQLearning() {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(AGENT);
  const [winner, setWinner] = useState(null);
  const qTable = useRef({});
  const episodeHistory = useRef([]);

  const alpha = 0.5;
  const gamma = 0.9;
  const epsilon = 0.2;

  function resetGame() {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setWinner(null);
    setCurrentPlayer(AGENT);
    episodeHistory.current = [];
  }

  function agentChooseAction(stateStr, actions) {
    if (!(stateStr in qTable.current)) {
      qTable.current[stateStr] = {};
      actions.forEach((_, i) => qTable.current[stateStr][i] = 0);
    }
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * actions.length);
    }
    const qValues = qTable.current[stateStr];
    let maxQ = -Infinity;
    let bestAction = 0;
    for (let i = 0; i < actions.length; i++) {
      const q = qValues[i] ?? 0;
      if (q > maxQ) {
        maxQ = q;
        bestAction = i;
      }
    }
    return bestAction;
  }

  function updateQTable(reward) {
    let target = reward;
    for (let i = episodeHistory.current.length - 1; i >= 0; i--) {
      const { state, action } = episodeHistory.current[i];
      if (!(state in qTable.current)) qTable.current[state] = {};
      if (!(action in qTable.current[state])) qTable.current[state][action] = 0;
      const oldQ = qTable.current[state][action];
      qTable.current[state][action] = oldQ + alpha * (target - oldQ);
      target = qTable.current[state][action] * gamma;
    }
    episodeHistory.current = [];
  }

  function agentMove() {
    if (winner) return;
    const stateStr = serializeBoard(board);
    const actions = getAvailableActions(board);
    if (actions.length === 0) return;

    const actionIdx = agentChooseAction(stateStr, actions);
    const [r, c] = actions[actionIdx];
    episodeHistory.current.push({ state: stateStr, action: actionIdx });

    const newBoard = board.map(row => row.slice());
    newBoard[r][c] = AGENT;
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      updateQTable(win === AGENT ? 1 : win === "draw" ? 0 : -1);
      return;
    }
    setCurrentPlayer(USER);
  }

  function handleUserMove(row, col) {
    if (winner || currentPlayer !== USER || board[row][col] !== EMPTY) return;
    const newBoard = board.map(row => row.slice());
    newBoard[row][col] = USER;
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      updateQTable(win === AGENT ? 1 : win === "draw" ? 0 : -1);
      return;
    }
    setCurrentPlayer(AGENT);
  }

  useEffect(() => {
    if (currentPlayer === AGENT && !winner) {
      const timer = setTimeout(agentMove, 300);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, board]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 flex flex-col items-center justify-center">
      <div className="card max-w-md w-full bg-base-200 border border-base-300 shadow-xl p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center select-none">
          Play Q-Learning Agent
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-6" style={{ userSelect: "none" }}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleUserMove(r, c)}
                className={`
                  flex items-center justify-center
                  w-20 h-20 md:w-24 md:h-24
                  rounded-lg border-4 text-5xl select-none
                  ${cell === AGENT ? "border-primary text-primary font-extrabold" : ""}
                  ${cell === USER ? "border-accent text-accent font-extrabold" : ""}
                  ${cell === EMPTY ? "border-base-300 text-neutral-content" : ""}
                  ${currentPlayer === USER && cell === EMPTY ? "hover:bg-base-300 cursor-pointer" : "cursor-default"}
                `}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        {winner && (
          <div
            className={`mb-6 p-4 rounded-md text-center font-semibold text-xl select-none
              ${winner === "draw" ? "bg-secondary text-white" :
                winner === AGENT ? "bg-primary text-primary-content" :
                "bg-accent text-accent-content"}
            `}
          >
            {winner === "draw" ? "It's a draw!" : `Winner: ${winner}`}
          </div>
        )}

        <button className="btn btn-primary w-full" onClick={resetGame}>
          Reset Game
        </button>

        <p className="text-center text-xs mt-4 opacity-60 select-none">
          You play <span className="font-bold text-accent">O</span>. Agent plays <span className="font-bold text-primary">X</span>.
        </p>
        <p className="text-center text-xs opacity-60 select-none">
          Q-table size: <span className="font-mono">{Object.keys(qTable.current).length}</span>
        </p>
      </div>
    </div>
  );
}
