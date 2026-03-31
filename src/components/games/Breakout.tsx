"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const stored = getGameScore("breakout");
  const W = 480, H = 400;
  const stateRef = useRef({
    paddle: { x: 200, w: 80 },
    ball: { x: 240, y: 350, dx: 3, dy: -3 },
    bricks: [] as { x: number; y: number; w: number; h: number; color: string; alive: boolean }[],
    score: 0, lives: 3, gameOver: false, started: false,
  });
  const animRef = useRef<number>(0);

  const initBricks = useCallback(() => {
    const colors = ["#FF0040","#FF6B00","#FFE400","#39FF14","#00F5FF","#BF00FF"];
    const bricks: typeof stateRef.current.bricks = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) {
      bricks.push({ x: c * 46 + 10, y: r * 22 + 30, w: 42, h: 18, color: colors[r], alive: true });
    }
    return bricks;
  }, []);

  useEffect(() => { stateRef.current.bricks = initBricks(); }, [initBricks]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || s.gameOver) return;
    const ctx = canvas.getContext("2d")!;
    const b = s.ball;
    b.x += b.dx; b.y += b.dy;
    // Walls
    if (b.x <= 6 || b.x >= W - 6) b.dx *= -1;
    if (b.y <= 6) b.dy *= -1;
    // Bottom
    if (b.y >= H - 10) {
      s.lives--;
      setLives(s.lives);
      if (s.lives <= 0) { s.gameOver = true; setGameOver(true); saveGameScore("breakout", s.score); return; }
      b.x = s.paddle.x + s.paddle.w / 2; b.y = 350; b.dy = -3; b.dx = 3;
    }
    // Paddle
    if (b.y + 6 >= H - 20 && b.y + 6 <= H - 10 && b.x >= s.paddle.x && b.x <= s.paddle.x + s.paddle.w) {
      b.dy = -Math.abs(b.dy);
      b.dx = ((b.x - (s.paddle.x + s.paddle.w / 2)) / (s.paddle.w / 2)) * 4;
    }
    // Bricks
    for (const br of s.bricks) {
      if (!br.alive) continue;
      if (b.x >= br.x && b.x <= br.x + br.w && b.y >= br.y && b.y <= br.y + br.h) {
        br.alive = false; b.dy *= -1; s.score += 10; setScore(s.score);
      }
    }
    // Win check
    if (s.bricks.every(br => !br.alive)) {
      s.gameOver = true; setGameOver(true); saveGameScore("breakout", s.score);
      return;
    }
    // Draw
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    // Bricks
    for (const br of s.bricks) {
      if (!br.alive) continue;
      ctx.fillStyle = br.color; ctx.shadowColor = br.color; ctx.shadowBlur = 8;
      ctx.fillRect(br.x, br.y, br.w, br.h);
    }
    ctx.shadowBlur = 0;
    // Paddle
    ctx.fillStyle = "#00F5FF"; ctx.shadowColor = "#00F5FF"; ctx.shadowBlur = 10;
    ctx.fillRect(s.paddle.x, H - 20, s.paddle.w, 10);
    ctx.shadowBlur = 0;
    // Ball
    ctx.fillStyle = "#FFE400"; ctx.shadowColor = "#FFE400"; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.paddle.x = Math.max(0, Math.min(W - 80, (e.clientX - rect.left) * (W / rect.width) - 40));
      if (!stateRef.current.started) { stateRef.current.started = true; animRef.current = requestAnimationFrame(gameLoop); }
    };
    const handleTouch = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.paddle.x = Math.max(0, Math.min(W - 80, (e.touches[0].clientX - rect.left) * (W / rect.width) - 40));
      if (!stateRef.current.started) { stateRef.current.started = true; animRef.current = requestAnimationFrame(gameLoop); }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("touchmove", handleTouch); };
  }, [gameLoop]);

  useEffect(() => {
    // Initial draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#00F5FF"; ctx.fillRect(200, H - 20, 80, 10);
    ctx.fillStyle = "#FFE400"; ctx.beginPath(); ctx.arc(240, 350, 6, 0, Math.PI * 2); ctx.fill();
    const colors = ["#FF0040","#FF6B00","#FFE400","#39FF14","#00F5FF","#BF00FF"];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) {
      ctx.fillStyle = colors[r]; ctx.fillRect(c * 46 + 10, r * 22 + 30, 42, 18);
    }
  }, []);

  const restart = () => {
    stateRef.current = { paddle: { x: 200, w: 80 }, ball: { x: 240, y: 350, dx: 3, dy: -3 }, bricks: initBricks(), score: 0, lives: 3, gameOver: false, started: false };
    setScore(0); setGameOver(false); setLives(3);
    stateRef.current.started = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <GameWrapper title="Breakout" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} lives={lives} controls="Move mouse/finger to control paddle"
      isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-lg border border-white/10 cursor-none max-w-full" />
      </div>
    </GameWrapper>
  );
}
