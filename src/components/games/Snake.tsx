"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const GRID = 20;
const CELL = 20;
const INITIAL_SPEED = 150;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const stored = getGameScore("snake");
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }] as Point[],
    food: { x: 15, y: 10 } as Point,
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    score: 0,
    speed: INITIAL_SPEED,
    gameOver: false,
  });

  const spawnFood = useCallback(() => {
    const s = stateRef.current;
    let f: Point;
    do {
      f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (s.snake.some(p => p.x === f.x && p.y === f.y));
    s.food = f;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    ctx.fillStyle = "#0A0A1A";
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
    // Grid
    ctx.strokeStyle = "rgba(0,245,255,0.03)";
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, GRID * CELL); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(GRID * CELL, i * CELL); ctx.stroke();
    }
    // Food
    ctx.fillStyle = "#FF0040";
    ctx.shadowColor = "#FF0040";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Snake
    s.snake.forEach((seg, i) => {
      const alpha = 1 - (i / s.snake.length) * 0.5;
      ctx.fillStyle = i === 0 ? "#00F5FF" : `rgba(0,245,255,${alpha})`;
      if (i === 0) { ctx.shadowColor = "#00F5FF"; ctx.shadowBlur = 10; }
      else { ctx.shadowBlur = 0; }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    s.dir = s.nextDir;
    const head = { ...s.snake[0] };
    if (s.dir === "UP") head.y--;
    else if (s.dir === "DOWN") head.y++;
    else if (s.dir === "LEFT") head.x--;
    else head.x++;

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || s.snake.some(p => p.x === head.x && p.y === head.y)) {
      s.gameOver = true;
      setGameOver(true);
      saveGameScore("snake", s.score);
      return;
    }
    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10;
      setScore(s.score);
      s.speed = Math.max(60, s.speed - 2);
      spawnFood();
    } else {
      s.snake.pop();
    }
    draw();
  }, [draw, spawnFood]);

  useEffect(() => {
    if (!started || isPaused || gameOver) return;
    const iv = setInterval(gameLoop, stateRef.current.speed);
    return () => clearInterval(iv);
  }, [started, isPaused, gameOver, gameLoop, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === " " || e.key === "p") { setIsPaused(p => !p); return; }
      if (!started) setStarted(true);
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT", w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT" };
      const nd = map[e.key];
      if (!nd) return;
      const opposites: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (opposites[nd] !== s.dir) s.nextDir = nd;
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started]);

  useEffect(() => { draw(); }, [draw]);

  const restart = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      food: { x: 15, y: 10 }, dir: "RIGHT", nextDir: "RIGHT", score: 0, speed: INITIAL_SPEED, gameOver: false,
    };
    setScore(0); setGameOver(false); setIsPaused(false); setStarted(true);
    spawnFood(); draw();
  };

  return (
    <GameWrapper title="Snake" difficulty="medium" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} controls="Arrow keys / WASD to move. Space to pause"
      isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} className="rounded-lg border border-white/10" />
      </div>
      {!started && !gameOver && (
        <div className="text-center mt-4 text-text-secondary font-body">Press any arrow key to start</div>
      )}
      {isPaused && <div className="text-center mt-4 font-heading text-neon-yellow text-lg">PAUSED</div>}
      {/* Mobile controls */}
      <div className="flex flex-col items-center gap-1 mt-4 md:hidden">
        <button onClick={() => { stateRef.current.nextDir = "UP"; if (!started) setStarted(true); }}
          className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↑</button>
        <div className="flex gap-1">
          <button onClick={() => { stateRef.current.nextDir = "LEFT"; if (!started) setStarted(true); }}
            className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">←</button>
          <button onClick={() => { stateRef.current.nextDir = "DOWN"; if (!started) setStarted(true); }}
            className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">↓</button>
          <button onClick={() => { stateRef.current.nextDir = "RIGHT"; if (!started) setStarted(true); }}
            className="w-12 h-12 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">→</button>
        </div>
      </div>
    </GameWrapper>
  );
}
