"use client";
import { useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
];

type Cell = null | "X" | "O";

function checkWinner(board: Cell[]): Cell | "draw" | null {
  for (const combo of WINNING_COMBOS) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(c => c !== null)) return "draw";
  return null;
}

function minimax(board: Cell[], depth: number, isMax: boolean): number {
  const w = checkWinner(board);
  if (w === "O") return 10 - depth;
  if (w === "X") return depth - 10;
  if (w === "draw") return 0;
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) { board[i] = "O"; best = Math.max(best, minimax(board, depth+1, false)); board[i] = null; }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) { board[i] = "X"; best = Math.min(best, minimax(board, depth+1, true)); board[i] = null; }
    }
    return best;
  }
}

function getAIMove(board: Cell[], diff: string): number {
  const empty = board.map((c,i) => c === null ? i : -1).filter(i => i >= 0);
  if (diff === "easy") return empty[Math.floor(Math.random() * empty.length)];
  if (diff === "medium" && Math.random() < 0.5) return empty[Math.floor(Math.random() * empty.length)];
  let bestScore = -Infinity, bestMove = empty[0];
  for (const i of empty) {
    board[i] = "O";
    const s = minimax(board, 0, false);
    board[i] = null;
    if (s > bestScore) { bestScore = s; bestMove = i; }
  }
  return bestMove;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Cell | "draw" | null>(null);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("medium");
  const [winLine, setWinLine] = useState<number[]>([]);
  const stored = getGameScore("tic-tac-toe");

  const handleClick = useCallback((idx: number) => {
    if (board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = "X";
    const w = checkWinner(newBoard);
    if (w) {
      setBoard(newBoard);
      setWinner(w);
      if (w === "X") { setScores(s => ({ ...s, x: s.x + 1 })); saveGameScore("tic-tac-toe", scores.x + 1); }
      else if (w === "draw") setScores(s => ({ ...s, draw: s.draw + 1 }));
      if (w !== "draw") { const combo = WINNING_COMBOS.find(c => c.every(i => newBoard[i] === w)); if (combo) setWinLine(combo); }
      return;
    }
    // AI move
    const aiIdx = getAIMove(newBoard, difficulty);
    newBoard[aiIdx] = "O";
    const w2 = checkWinner(newBoard);
    setBoard(newBoard);
    if (w2) {
      setWinner(w2);
      if (w2 === "O") setScores(s => ({ ...s, o: s.o + 1 }));
      else if (w2 === "draw") setScores(s => ({ ...s, draw: s.draw + 1 }));
      if (w2 !== "draw") { const combo = WINNING_COMBOS.find(c => c.every(i => newBoard[i] === w2)); if (combo) setWinLine(combo); }
    }
  }, [board, winner, difficulty, scores.x]);

  const restart = () => { setBoard(Array(9).fill(null)); setWinner(null); setWinLine([]); };

  return (
    <GameWrapper
      title="Tic Tac Toe"
      difficulty="easy"
      score={scores.x}
      highScore={stored.highScore}
      isGameOver={false}
      onRestart={restart}
      controls="Click any empty cell to place your X"
    >
      {/* Difficulty */}
      <div className="flex justify-center gap-2 mb-4">
        {["easy","medium","hard"].map(d => (
          <button key={d} onClick={() => { setDifficulty(d); restart(); }}
            className={`px-3 py-1 text-xs font-heading uppercase rounded border cursor-pointer transition-all ${
              difficulty === d ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan" : "border-white/10 text-text-muted"
            }`}>{d}</button>
        ))}
      </div>

      {/* Score */}
      <div className="flex justify-center gap-6 mb-4 font-mono text-sm">
        <span className="text-neon-cyan">You (X): {scores.x}</span>
        <span className="text-text-muted">Draw: {scores.draw}</span>
        <span className="text-neon-pink">AI (O): {scores.o}</span>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`aspect-square rounded-lg border-2 text-3xl font-heading font-bold flex items-center justify-center transition-all cursor-pointer ${
              winLine.includes(i) ? "animate-neon-pulse border-neon-green bg-neon-green/10" :
              cell === "X" ? "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/5" :
              cell === "O" ? "border-neon-pink/50 text-neon-pink bg-neon-pink/5" :
              "border-white/10 hover:border-neon-cyan/30 bg-bg-surface"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Result */}
      {winner && (
        <div className="text-center mt-4">
          <p className={`font-heading text-lg ${
            winner === "X" ? "text-neon-green" : winner === "O" ? "text-neon-red" : "text-neon-yellow"
          }`}>
            {winner === "X" ? "You Win! 🎉" : winner === "O" ? "AI Wins! 😈" : "Draw! 🤝"}
          </p>
          <button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button>
        </div>
      )}
    </GameWrapper>
  );
}
