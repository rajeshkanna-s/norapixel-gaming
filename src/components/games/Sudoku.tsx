"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

// Simplified Sudoku: generate a valid puzzle
function generatePuzzle(): { puzzle: number[][]; solution: number[][] } {
  // Start with a known valid board and shuffle
  const base = [
    [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]
  ];
  // Shuffle rows within bands
  for (let band = 0; band < 3; band++) {
    for (let i = band*3; i < band*3+3; i++) {
      const j = band*3 + Math.floor(Math.random() * 3);
      [base[i], base[j]] = [base[j], base[i]];
    }
  }
  const solution = base.map(r => [...r]);
  const puzzle = base.map(r => [...r]);
  // Remove ~40 cells
  let removed = 0;
  while (removed < 40) {
    const r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; removed++; }
  }
  return { puzzle, solution };
}

export default function Sudoku() {
  const [{ puzzle, solution }] = useState(() => generatePuzzle());
  const [board, setBoard] = useState(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState<[number,number] | null>(null);
  const [errors, setErrors] = useState(0);
  const [complete, setComplete] = useState(false);
  const stored = getGameScore("sudoku");

  const handleInput = (num: number) => {
    if (!selected || complete) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const b = board.map(row => [...row]);
    if (num === solution[r][c]) {
      b[r][c] = num;
      setBoard(b);
      if (b.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
        setComplete(true);
        saveGameScore("sudoku", Math.max(1000 - errors * 100, 100));
      }
    } else {
      setErrors(e => e + 1);
      b[r][c] = 0;
      setBoard(b);
    }
  };

  const restart = () => { window.location.reload(); };

  return (
    <GameWrapper title="Sudoku" difficulty="hard" score={complete ? Math.max(1000 - errors * 100, 100) : 0}
      highScore={stored.highScore} isGameOver={false} onRestart={restart} controls="Click cell, then number to fill">

      <div className="text-center font-mono text-sm text-text-muted mb-3">Errors: {errors}</div>

      <div className="flex justify-center mb-4">
        <div className="grid gap-0 border-2 border-neon-cyan/30 rounded" style={{ gridTemplateColumns: "repeat(9, 1fr)" }}>
          {board.map((row, r) => row.map((val, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isOriginal = puzzle[r][c] !== 0;
            const borderR = (c + 1) % 3 === 0 && c < 8 ? "border-r-2 border-r-neon-cyan/20" : "";
            const borderB = (r + 1) % 3 === 0 && r < 8 ? "border-b-2 border-b-neon-cyan/20" : "";
            return (
              <button key={`${r}-${c}`} onClick={() => setSelected([r, c])}
                className={`w-8 h-8 md:w-10 md:h-10 text-sm font-mono flex items-center justify-center cursor-pointer border border-white/5 transition-all ${borderR} ${borderB} ${
                  isSelected ? "bg-neon-cyan/20 border-neon-cyan" :
                  isOriginal ? "text-text-primary bg-bg-surface" :
                  val ? "text-neon-green bg-bg-card" : "text-text-muted bg-bg-card hover:bg-bg-surface"
                }`}>
                {val > 0 ? val : ""}
              </button>
            );
          }))}
        </div>
      </div>

      <div className="flex justify-center gap-1 mb-4">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleInput(n)}
            className="w-9 h-9 rounded border border-white/10 bg-bg-surface text-sm font-heading text-text-primary hover:border-neon-cyan/50 cursor-pointer transition-all">
            {n}
          </button>
        ))}
      </div>

      {complete && (
        <div className="text-center text-neon-green font-heading text-lg">
          🎉 Puzzle Complete! ({errors} errors)
          <div><button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">New Puzzle</button></div>
        </div>
      )}
    </GameWrapper>
  );
}
