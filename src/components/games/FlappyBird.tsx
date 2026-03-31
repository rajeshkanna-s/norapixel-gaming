"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stored = getGameScore("flappy-bird");
  const stateRef = useRef({ y: 200, vel: 0, pipes: [] as { x: number; gapTop: number }[], score: 0, frame: 0, gameOver: false });
  const animRef = useRef<number>(0);

  const GRAVITY = 0.35, FLAP = -6.5, PIPE_W = 50, GAP = 130, SPEED = 2.5, W = 400, H = 500;

  const flap = useCallback(() => {
    if (stateRef.current.gameOver) return;
    if (!started) setStarted(true);
    stateRef.current.vel = FLAP;
  }, [started]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || s.gameOver) return;
    const ctx = canvas.getContext("2d")!;
    s.frame++;
    s.vel += GRAVITY;
    s.y += s.vel;
    // Add pipes
    if (s.frame % 90 === 0) {
      s.pipes.push({ x: W, gapTop: 60 + Math.random() * (H - GAP - 120) });
    }
    // Move pipes
    s.pipes.forEach(p => p.x -= SPEED);
    s.pipes = s.pipes.filter(p => p.x > -PIPE_W);
    // Score
    s.pipes.forEach(p => {
      if (Math.abs(p.x - 60) < SPEED) { s.score++; setScore(s.score); }
    });
    // Collision
    if (s.y < 0 || s.y > H - 20) { endGame(); return; }
    for (const p of s.pipes) {
      if (60 + 20 > p.x && 60 < p.x + PIPE_W) {
        if (s.y < p.gapTop || s.y + 20 > p.gapTop + GAP) { endGame(); return; }
      }
    }
    // Draw
    ctx.fillStyle = "#0A0A1A";
    ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(0,245,255,${0.1 + Math.random() * 0.1})`;
      ctx.fillRect((i * 73 + s.frame * 0.3) % W, (i * 47) % H, 1, 1);
    }
    // Pipes
    s.pipes.forEach(p => {
      ctx.fillStyle = "#39FF14";
      ctx.shadowColor = "#39FF14";
      ctx.shadowBlur = 10;
      ctx.fillRect(p.x, 0, PIPE_W, p.gapTop);
      ctx.fillRect(p.x, p.gapTop + GAP, PIPE_W, H - p.gapTop - GAP);
      ctx.shadowBlur = 0;
    });
    // Bird
    ctx.fillStyle = "#FFE400";
    ctx.shadowColor = "#FFE400";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(70, s.y + 10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Eye
    ctx.fillStyle = "#0A0A1A";
    ctx.beginPath();
    ctx.arc(76, s.y + 7, 3, 0, Math.PI * 2);
    ctx.fill();

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const endGame = () => {
    stateRef.current.gameOver = true;
    setGameOver(true);
    saveGameScore("flappy-bird", stateRef.current.score);
  };

  useEffect(() => {
    if (!started) return;
    animRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [started, gameLoop]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); } };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap]);

  useEffect(() => {
    // Draw initial state
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FFE400"; ctx.beginPath(); ctx.arc(70, 210, 12, 0, Math.PI * 2); ctx.fill();
  }, []);

  const restart = () => {
    stateRef.current = { y: 200, vel: 0, pipes: [], score: 0, frame: 0, gameOver: false };
    setScore(0); setGameOver(false); setStarted(true);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <GameWrapper title="Flappy Bird" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} controls="Space/Tap/Click to flap"
      isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={W} height={H} onClick={flap}
          className="rounded-lg border border-white/10 cursor-pointer max-w-full" style={{ touchAction: "manipulation" }} />
      </div>
      {!started && !gameOver && (
        <div className="text-center mt-4 text-text-secondary font-body">Click or press Space to start</div>
      )}
    </GameWrapper>
  );
}
