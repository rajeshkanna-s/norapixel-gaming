"use client";
import { useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const ROWS = 6, COLS = 7;
type Cell = null | 1 | 2;

function checkWin(board: Cell[][], player: 1|2): [number,number][] | null {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (board[r][c] !== player) continue;
    for (const [dr, dc] of dirs) {
      const cells: [number,number][] = [[r,c]];
      for (let i = 1; i < 4; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
        cells.push([nr, nc]);
      }
      if (cells.length === 4) return cells;
    }
  }
  return null;
}

function aiMove(board: Cell[][]): number {
  // Simple AI: check win/block, then center-preference
  for (const player of [2, 1] as const) {
    for (let c = 0; c < COLS; c++) {
      const r = findRow(board, c);
      if (r < 0) continue;
      board[r][c] = player;
      if (checkWin(board, player)) { board[r][c] = null; return c; }
      board[r][c] = null;
    }
  }
  const preferred = [3,2,4,1,5,0,6];
  for (const c of preferred) { if (findRow(board, c) >= 0) return c; }
  return 0;
}

function findRow(board: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) { if (!board[r][col]) return r; }
  return -1;
}

export default function ConnectFour() {
  const [board, setBoard] = useState<Cell[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [turn, setTurn] = useState<1|2>(1);
  const [winner, setWinner] = useState<Cell>(null);
  const [winCells, setWinCells] = useState<[number,number][]>([]);
  const [scores, setScores] = useState({ p: 0, ai: 0 });
  const stored = getGameScore("connect-four");

  const drop = useCallback((col: number) => {
    if (winner) return;
    const row = findRow(board, col);
    if (row < 0) return;
    const b = board.map(r => [...r]);
    b[row][col] = 1;
    const w = checkWin(b, 1);
    if (w) {
      setBoard(b); setWinner(1); setWinCells(w);
      setScores(s => ({ ...s, p: s.p + 1 }));
      saveGameScore("connect-four", scores.p + 1);
      return;
    }
    // AI
    const aiC = aiMove(b);
    const aiR = findRow(b, aiC);
    if (aiR >= 0) {
      b[aiR][aiC] = 2;
      const w2 = checkWin(b, 2);
      if (w2) { setBoard(b); setWinner(2); setWinCells(w2); setScores(s => ({ ...s, ai: s.ai + 1 })); return; }
    }
    setBoard(b);
    if (b.every(row => row.every(c => c))) { setWinner(0 as any); } // draw
  }, [board, winner, scores.p]);

  const restart = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setWinner(null); setWinCells([]);
  };

  const isWinCell = (r: number, c: number) => winCells.some(([wr, wc]) => wr === r && wc === c);

  return (
    <GameWrapper title="Connect Four" difficulty="hard" score={scores.p} highScore={stored.highScore}
      isGameOver={false} onRestart={restart} controls="Click a column to drop your disc">

      <div className="flex justify-center gap-6 mb-4 font-mono text-sm">
        <span className="text-neon-cyan">You: {scores.p}</span>
        <span className="text-neon-pink">AI: {scores.ai}</span>
      </div>

      <div className="flex justify-center">
        <div className="bg-blue-900/30 p-2 rounded-xl border border-blue-800/30">
          {/* Column buttons */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {Array.from({ length: COLS }, (_, c) => (
              <button key={c} onClick={() => drop(c)} disabled={!!winner}
                className="h-6 rounded text-xs text-neon-cyan opacity-0 hover:opacity-100 cursor-pointer transition-opacity">↓</button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {board.map((row, r) => row.map((cell, c) => (
              <motion.div key={`${r}-${c}`} onClick={() => drop(c)}
                animate={isWinCell(r, c) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: isWinCell(r, c) ? Infinity : 0, duration: 0.6 }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 cursor-pointer transition-all ${
                  cell === 1 ? "bg-neon-cyan border-neon-cyan" + (isWinCell(r,c) ? " shadow-[0_0_15px_#00F5FF]" : "") :
                  cell === 2 ? "bg-neon-pink border-neon-pink" + (isWinCell(r,c) ? " shadow-[0_0_15px_#FF006E]" : "") :
                  "bg-bg-primary/50 border-white/10"
                }`} />
            )))}
          </div>
        </div>
      </div>

      {winner && (
        <div className="text-center mt-4">
          <div className={`font-heading text-lg ${winner === 1 ? "text-neon-green" : winner === 2 ? "text-neon-red" : "text-neon-yellow"}`}>
            {winner === 1 ? "You Win! 🎉" : winner === 2 ? "AI Wins! 🤖" : "Draw! 🤝"}
          </div>
          <button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button>
        </div>
      )}
    </GameWrapper>
  );
}
