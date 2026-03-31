"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const CELL = 20, W = 19, H = 21;
// Simplified maze
const MAZE = [
  "1111111111111111111",
  "1........1........1",
  "1.11.111.1.111.11.1",
  "1.................1",
  "1.11.1.11111.1.11.1",
  "1....1...1...1....1",
  "1111.111.1.111.1111",
  "0001.1.......1.1000",
  "1111.1.11011.1.1111",
  "0000...10001...0000",
  "1111.1.11111.1.1111",
  "0001.1.......1.1000",
  "1111.1.11111.1.1111",
  "1........1........1",
  "1.11.111.1.111.11.1",
  "1..1...........1..1",
  "11.1.1.11111.1.1.11",
  "1....1...1...1....1",
  "1.111111.1.111111.1",
  "1.................1",
  "1111111111111111111",
];

type Dir = "UP"|"DOWN"|"LEFT"|"RIGHT";
type Pos = { x: number; y: number };

export default function PacMan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stored = getGameScore("pacman");
  const stateRef = useRef({
    pac: { x: 9, y: 15 } as Pos,
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    ghosts: [{ x: 9, y: 9, dir: "UP" as Dir },{ x: 8, y: 9, dir: "LEFT" as Dir },{ x: 10, y: 9, dir: "RIGHT" as Dir }],
    dots: new Set<string>(),
    score: 0,
    frame: 0,
    gameOver: false,
  });

  useEffect(() => {
    // Init dots
    const dots = new Set<string>();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (MAZE[y][x] === '.') dots.add(`${x},${y}`);
    }
    stateRef.current.dots = dots;
  }, []);

  const canMove = (x: number, y: number): boolean => {
    if (x < 0 || x >= W || y < 0 || y >= H) return false;
    return MAZE[y][x] !== '1';
  };

  const dirDelta: Record<Dir, [number, number]> = { UP: [0,-1], DOWN: [0,1], LEFT: [-1,0], RIGHT: [1,0] };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    ctx.fillStyle = "#0A0A1A";
    ctx.fillRect(0, 0, W * CELL, H * CELL);
    // Walls
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (MAZE[y][x] === '1') {
        ctx.fillStyle = "#1a1a4e";
        ctx.strokeStyle = "#0066FF40";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    // Dots
    for (const key of s.dots) {
      const [dx, dy] = key.split(",").map(Number);
      ctx.fillStyle = "#FFE400";
      ctx.beginPath();
      ctx.arc(dx * CELL + CELL/2, dy * CELL + CELL/2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Pac-Man
    ctx.fillStyle = "#FFE400";
    ctx.shadowColor = "#FFE400";
    ctx.shadowBlur = 10;
    const px = s.pac.x * CELL + CELL / 2, py = s.pac.y * CELL + CELL / 2;
    const mouthAngle = Math.abs(Math.sin(s.frame * 0.2)) * 0.5;
    const angles: Record<Dir, number> = { RIGHT: 0, DOWN: Math.PI/2, LEFT: Math.PI, UP: -Math.PI/2 };
    const a = angles[s.dir];
    ctx.beginPath();
    ctx.arc(px, py, CELL/2 - 1, a + mouthAngle, a + Math.PI * 2 - mouthAngle);
    ctx.lineTo(px, py);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Ghosts
    const ghostColors = ["#FF0040", "#00F5FF", "#FF6B00"];
    s.ghosts.forEach((g, i) => {
      ctx.fillStyle = ghostColors[i];
      ctx.shadowColor = ghostColors[i];
      ctx.shadowBlur = 8;
      const gx = g.x * CELL + CELL / 2, gy = g.y * CELL + CELL / 2;
      ctx.beginPath();
      ctx.arc(gx, gy, CELL/2 - 1, Math.PI, 0);
      ctx.lineTo(gx + CELL/2 - 1, gy + CELL/2 - 1);
      ctx.lineTo(gx, gy + CELL/2 - 4);
      ctx.lineTo(gx - CELL/2 + 1, gy + CELL/2 - 1);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Eyes
      ctx.fillStyle = "white";
      ctx.beginPath(); ctx.arc(gx - 3, gy - 2, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(gx + 3, gy - 2, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0A0A1A";
      ctx.beginPath(); ctx.arc(gx - 3, gy - 2, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(gx + 3, gy - 2, 1.5, 0, Math.PI * 2); ctx.fill();
    });
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    s.frame++;
    // Move pac
    if (s.frame % 4 === 0) {
      const [ndx, ndy] = dirDelta[s.nextDir];
      if (canMove(s.pac.x + ndx, s.pac.y + ndy)) s.dir = s.nextDir;
      const [dx, dy] = dirDelta[s.dir];
      const nx = s.pac.x + dx, ny = s.pac.y + dy;
      if (canMove(nx, ny)) { s.pac.x = nx; s.pac.y = ny; }
      // Eat dot
      const key = `${s.pac.x},${s.pac.y}`;
      if (s.dots.has(key)) { s.dots.delete(key); s.score += 10; setScore(s.score); }
      // Win
      if (s.dots.size === 0) { s.gameOver = true; setGameOver(true); saveGameScore("pacman", s.score); return; }
    }
    // Move ghosts
    if (s.frame % 8 === 0) {
      s.ghosts.forEach(g => {
        const dirs: Dir[] = ["UP","DOWN","LEFT","RIGHT"];
        const valid = dirs.filter(d => { const [dx,dy] = dirDelta[d]; return canMove(g.x+dx, g.y+dy); });
        if (valid.length > 0) {
          // Prefer towards pacman 50% of the time
          if (Math.random() < 0.5) {
            const sorted = valid.sort((a, b) => {
              const [adx,ady] = dirDelta[a]; const [bdx,bdy] = dirDelta[b];
              const da = Math.abs(g.x+adx-s.pac.x)+Math.abs(g.y+ady-s.pac.y);
              const db = Math.abs(g.x+bdx-s.pac.x)+Math.abs(g.y+bdy-s.pac.y);
              return da - db;
            });
            g.dir = sorted[0];
          } else {
            g.dir = valid[Math.floor(Math.random() * valid.length)];
          }
          const [dx,dy] = dirDelta[g.dir];
          g.x += dx; g.y += dy;
        }
      });
    }
    // Ghost collision
    if (s.ghosts.some(g => g.x === s.pac.x && g.y === s.pac.y)) {
      s.gameOver = true; setGameOver(true); saveGameScore("pacman", s.score);
      return;
    }
    draw();
  }, [draw]);

  useEffect(() => {
    if (!started || gameOver) return;
    const iv = setInterval(gameLoop, 50);
    return () => clearInterval(iv);
  }, [started, gameOver, gameLoop]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started) setStarted(true);
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT", w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT" };
      const d = map[e.key];
      if (d) stateRef.current.nextDir = d;
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started]);

  useEffect(() => { draw(); }, [draw]);

  const restart = () => {
    const dots = new Set<string>();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (MAZE[y][x] === '.') dots.add(`${x},${y}`); }
    stateRef.current = { pac: { x: 9, y: 15 }, dir: "RIGHT", nextDir: "RIGHT",
      ghosts: [{ x: 9, y: 9, dir: "UP" },{ x: 8, y: 9, dir: "LEFT" },{ x: 10, y: 9, dir: "RIGHT" }],
      dots, score: 0, frame: 0, gameOver: false };
    setScore(0); setGameOver(false); setStarted(true);
  };

  return (
    <GameWrapper title="Pac-Man" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} controls="Arrow keys / WASD to move"
      isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={W * CELL} height={H * CELL} className="rounded-lg border border-white/10" />
      </div>
      {!started && <div className="text-center mt-4 text-text-secondary font-body">Press any arrow key to start</div>}
      <div className="flex flex-col items-center gap-1 mt-4 md:hidden">
        <button onClick={() => { stateRef.current.nextDir = "UP"; if (!started) setStarted(true); }} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↑</button>
        <div className="flex gap-1">
          <button onClick={() => { stateRef.current.nextDir = "LEFT"; if (!started) setStarted(true); }} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">←</button>
          <button onClick={() => { stateRef.current.nextDir = "DOWN"; if (!started) setStarted(true); }} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↓</button>
          <button onClick={() => { stateRef.current.nextDir = "RIGHT"; if (!started) setStarted(true); }} className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">→</button>
        </div>
      </div>
    </GameWrapper>
  );
}
