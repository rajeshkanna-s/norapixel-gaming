"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const COLS = 10, ROWS = 20, CELL = 25;
const PIECES = [
  { shape: [[1,1,1,1]], color: "#00F5FF" },
  { shape: [[1,1],[1,1]], color: "#FFE400" },
  { shape: [[0,1,0],[1,1,1]], color: "#BF00FF" },
  { shape: [[1,0],[1,0],[1,1]], color: "#FF6B00" },
  { shape: [[0,1],[0,1],[1,1]], color: "#0066FF" },
  { shape: [[1,1,0],[0,1,1]], color: "#39FF14" },
  { shape: [[0,1,1],[1,1,0]], color: "#FF0040" },
];
type Board = (string | null)[][];

function newBoard(): Board { return Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }
function randomPiece() { return PIECES[Math.floor(Math.random() * PIECES.length)]; }
function rotate(shape: number[][]): number[][] {
  return shape[0].map((_, c) => shape.map(row => row[c]).reverse());
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stored = getGameScore("tetris");
  const stateRef = useRef({
    board: newBoard(),
    piece: randomPiece(),
    next: randomPiece(),
    pos: { x: 3, y: 0 },
    score: 0, lines: 0, level: 1, gameOver: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const canPlace = (board: Board, shape: number[][], posX: number, posY: number): boolean => {
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = posY + r, nc = posX + c;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
      if (board[nr][nc]) return false;
    }
    return true;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    ctx.fillStyle = "#0A0A1A";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke(); }
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke(); }
    // Board
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (s.board[r][c]) {
        ctx.fillStyle = s.board[r][c]!;
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    }
    // Current piece
    const { shape, color } = s.piece;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) ctx.fillRect((s.pos.x + c) * CELL + 1, (s.pos.y + r) * CELL + 1, CELL - 2, CELL - 2);
    }
    ctx.shadowBlur = 0;
  }, []);

  const lockPiece = useCallback(() => {
    const s = stateRef.current;
    const { shape, color } = s.piece;
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) s.board[s.pos.y + r][s.pos.x + c] = color;
    }
    // Clear lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (s.board[r].every(c => c !== null)) {
        s.board.splice(r, 1);
        s.board.unshift(Array(COLS).fill(null));
        cleared++; r++;
      }
    }
    if (cleared) {
      const points = [0, 100, 300, 500, 800][cleared] * s.level;
      s.score += points; s.lines += cleared;
      s.level = Math.floor(s.lines / 10) + 1;
      setScore(s.score); setLines(s.lines); setLevel(s.level);
    }
    // Next piece
    s.piece = s.next;
    s.next = randomPiece();
    s.pos = { x: 3, y: 0 };
    if (!canPlace(s.board, s.piece.shape, s.pos.x, s.pos.y)) {
      s.gameOver = true; setGameOver(true);
      saveGameScore("tetris", s.score);
    }
  }, []);

  const moveDown = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    if (canPlace(s.board, s.piece.shape, s.pos.x, s.pos.y + 1)) { s.pos.y++; }
    else { lockPiece(); }
    draw();
  }, [draw, lockPiece]);

  useEffect(() => {
    if (!started || gameOver) return;
    const speed = Math.max(100, 500 - (level - 1) * 40);
    intervalRef.current = setInterval(moveDown, speed);
    return () => clearInterval(intervalRef.current);
  }, [started, gameOver, level, moveDown]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.gameOver) return;
      if (!started) { setStarted(true); return; }
      if (e.key === "ArrowLeft" || e.key === "a") {
        if (canPlace(s.board, s.piece.shape, s.pos.x - 1, s.pos.y)) s.pos.x--;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        if (canPlace(s.board, s.piece.shape, s.pos.x + 1, s.pos.y)) s.pos.x++;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        moveDown();
      } else if (e.key === "ArrowUp" || e.key === "w") {
        const rotated = rotate(s.piece.shape);
        if (canPlace(s.board, rotated, s.pos.x, s.pos.y)) s.piece = { ...s.piece, shape: rotated };
      } else if (e.key === " ") {
        while (canPlace(s.board, s.piece.shape, s.pos.x, s.pos.y + 1)) s.pos.y++;
        lockPiece();
      }
      draw();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, moveDown, draw, lockPiece]);

  useEffect(() => { draw(); }, [draw]);

  const restart = () => {
    stateRef.current = { board: newBoard(), piece: randomPiece(), next: randomPiece(), pos: { x: 3, y: 0 }, score: 0, lines: 0, level: 1, gameOver: false };
    setScore(0); setLines(0); setLevel(1); setGameOver(false); setStarted(true);
  };

  return (
    <GameWrapper title="Tetris" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} level={level}
      controls="←→ move, ↑ rotate, ↓ soft drop, Space hard drop"
      isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center gap-4">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="rounded-lg border border-white/10" />
        <div className="text-xs font-mono text-text-muted space-y-2">
          <div>Lines: {lines}</div>
          <div>Level: {level}</div>
        </div>
      </div>
      {!started && !gameOver && <div className="text-center mt-4 text-text-secondary font-body">Press any key to start</div>}
      {/* Mobile controls */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <button onClick={() => { const s = stateRef.current; if (canPlace(s.board, s.piece.shape, s.pos.x-1, s.pos.y)) { s.pos.x--; draw(); } }}
          className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">←</button>
        <button onClick={() => { const s = stateRef.current; const r = rotate(s.piece.shape); if (canPlace(s.board, r, s.pos.x, s.pos.y)) { s.piece={...s.piece,shape:r}; draw(); } }}
          className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↻</button>
        <button onClick={() => moveDown()}
          className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↓</button>
        <button onClick={() => { const s = stateRef.current; if (canPlace(s.board, s.piece.shape, s.pos.x+1, s.pos.y)) { s.pos.x++; draw(); } }}
          className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">→</button>
      </div>
    </GameWrapper>
  );
}
