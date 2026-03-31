"use client";
import { useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const ROWS = 9, COLS = 9, MINES = 10;
type Cell = { mine: boolean; revealed: boolean; flagged: boolean; neighbors: number; };

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, neighbors: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
      }
      board[r][c].neighbors = count;
    }
  }
  return board;
}

const numColors: Record<number, string> = { 1: "#00F5FF", 2: "#39FF14", 3: "#FF006E", 4: "#BF00FF", 5: "#FF6B00", 6: "#FFE400", 7: "#FF0040", 8: "#FFFFFF" };

export default function Minesweeper() {
  const [board, setBoard] = useState(() => createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const stored = getGameScore("minesweeper");

  const reveal = useCallback((r: number, c: number) => {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    if (b[r][c].mine) {
      b.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(b); setGameOver(true);
      saveGameScore("minesweeper", 0);
      return;
    }
    const flood = (rr: number, cc: number) => {
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return;
      if (b[rr][cc].revealed || b[rr][cc].mine || b[rr][cc].flagged) return;
      b[rr][cc].revealed = true;
      if (b[rr][cc].neighbors === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(rr + dr, cc + dc);
      }
    };
    flood(r, c);
    setBoard(b);
    // Check win
    const unrevealed = b.flat().filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) {
      setWon(true); setGameOver(true);
      saveGameScore("minesweeper", 1000);
    }
  }, [board, gameOver]);

  const toggleFlag = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  }, [board, gameOver]);

  const flags = board.flat().filter(c => c.flagged).length;
  const restart = () => { setBoard(createBoard()); setGameOver(false); setWon(false); };

  return (
    <GameWrapper title="Minesweeper" difficulty="hard" score={won ? 1000 : 0} highScore={stored.highScore}
      isGameOver={gameOver && !won} onRestart={restart}
      controls="Click to reveal, Right-click to flag" isNewHighScore={won}>

      <div className="text-center font-mono text-sm text-text-muted mb-3">
        💣 {MINES - flags} mines remaining
      </div>

      <div className="flex justify-center">
        <div className="grid gap-0.5 p-1 bg-bg-surface rounded" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`}
              onClick={() => reveal(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              className={`w-8 h-8 text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all rounded-sm ${
                cell.revealed ?
                  cell.mine ? "bg-neon-red/30 text-white" : "bg-bg-primary border border-white/5" :
                  "bg-bg-card border border-white/10 hover:bg-bg-card/80"
              }`}
              style={{ color: cell.revealed && !cell.mine ? numColors[cell.neighbors] : undefined }}>
              {cell.revealed ?
                cell.mine ? "💣" : cell.neighbors > 0 ? cell.neighbors : "" :
                cell.flagged ? "🚩" : ""}
            </button>
          )))}
        </div>
      </div>

      {won && (
        <div className="text-center mt-4 text-neon-green font-heading text-lg">
          🎉 You Win! All mines clear!
          <div><button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button></div>
        </div>
      )}
    </GameWrapper>
  );
}
