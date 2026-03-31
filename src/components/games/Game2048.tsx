"use client";
import { useState, useCallback, useEffect } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const SIZE = 4;
type Board = number[][];

function emptyBoard(): Board { return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); }

function addRandom(board: Board): Board {
  const b = board.map(r => [...r]);
  const empty: [number,number][] = [];
  b.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empty.push([r, c]); }));
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function slide(row: number[]): { row: number[]; score: number } {
  let arr = row.filter(v => v !== 0);
  let score = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; score += arr[i]; arr[i + 1] = 0; }
  }
  arr = arr.filter(v => v !== 0);
  while (arr.length < SIZE) arr.push(0);
  return { row: arr, score };
}

function moveLeft(board: Board): { board: Board; score: number; moved: boolean } {
  let score = 0; let moved = false;
  const b = board.map(row => {
    const { row: newRow, score: s } = slide(row);
    score += s;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });
  return { board: b, score, moved };
}
function rotate90(board: Board): Board {
  return board[0].map((_, c) => board.map(row => row[c]).reverse());
}
function move(board: Board, dir: string): { board: Board; score: number; moved: boolean } {
  let b = board;
  const rots: Record<string, number> = { left: 0, up: 1, right: 2, down: 3 };
  for (let i = 0; i < rots[dir]; i++) b = rotate90(b);
  const result = moveLeft(b);
  for (let i = 0; i < (4 - rots[dir]) % 4; i++) result.board = rotate90(result.board);
  return result;
}
function canMove(board: Board): boolean {
  for (const dir of ["left","right","up","down"]) { if (move(board, dir).moved) return true; }
  return false;
}

const tileColors: Record<number, string> = {
  0: "#1a1a2e", 2: "#0d6b6e", 4: "#0e8174", 8: "#0f9b7a", 16: "#39FF14",
  32: "#00F5FF", 64: "#BF00FF", 128: "#FF006E", 256: "#FFE400", 512: "#FF6B00",
  1024: "#FF0040", 2048: "#39FF14",
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const stored = getGameScore("game-2048");

  const handleMove = useCallback((dir: string) => {
    if (gameOver) return;
    const result = move(board, dir);
    if (!result.moved) return;
    const newBoard = addRandom(result.board);
    const newScore = score + result.score;
    setBoard(newBoard);
    setScore(newScore);
    if (newBoard.some(row => row.some(v => v >= 2048)) && !won) setWon(true);
    if (!canMove(newBoard)) { setGameOver(true); saveGameScore("game-2048", newScore); }
  }, [board, score, gameOver, won]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", d: "right", w: "up", s: "down" };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); handleMove(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleMove]);

  const restart = () => { setBoard(addRandom(addRandom(emptyBoard()))); setScore(0); setGameOver(false); setWon(false); };

  return (
    <GameWrapper title="2048" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} controls="Arrow keys / WASD to slide tiles"
      isNewHighScore={gameOver && score > stored.highScore}>

      <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto p-2 bg-bg-surface rounded-xl">
        {board.flat().map((val, i) => (
          <motion.div key={i} layout
            className="aspect-square rounded-lg flex items-center justify-center font-heading font-bold text-bg-primary transition-colors"
            style={{
              backgroundColor: tileColors[val] || tileColors[2048],
              fontSize: val >= 1000 ? "14px" : val >= 100 ? "18px" : "22px",
              boxShadow: val >= 128 ? `0 0 15px ${tileColors[val]}` : "none",
            }}>
            {val > 0 ? val : ""}
          </motion.div>
        ))}
      </div>

      {won && !gameOver && (
        <div className="text-center mt-4 text-neon-green font-heading">🎉 You reached 2048! Keep going?</div>
      )}

      {/* Mobile controls */}
      <div className="flex flex-col items-center gap-1 mt-4 md:hidden">
        <button onClick={() => handleMove("up")} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↑</button>
        <div className="flex gap-1">
          <button onClick={() => handleMove("left")} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">←</button>
          <button onClick={() => handleMove("down")} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↓</button>
          <button onClick={() => handleMove("right")} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">→</button>
        </div>
      </div>
    </GameWrapper>
  );
}
