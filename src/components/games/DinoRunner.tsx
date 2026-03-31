"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const W = 600, H = 200, GROUND = 160;

export default function DinoRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stored = getGameScore("platformer-runner");
  const stateRef = useRef({
    dinoY: GROUND, velY: 0, jumping: false,
    obstacles: [] as { x: number; w: number; h: number; type: "cactus"|"bird" }[],
    score: 0, speed: 5, frame: 0, gameOver: false,
  });
  const animRef = useRef<number>(0);

  const jump = useCallback(() => {
    if (stateRef.current.gameOver) return;
    if (!started) setStarted(true);
    if (!stateRef.current.jumping) {
      stateRef.current.velY = -12;
      stateRef.current.jumping = true;
    }
  }, [started]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || s.gameOver) return;
    const ctx = canvas.getContext("2d")!;
    s.frame++;
    s.score = Math.floor(s.frame / 6);
    if (s.frame % 6 === 0) setScore(s.score);
    s.speed = 5 + s.score * 0.01;

    // Dino physics
    s.velY += 0.6;
    s.dinoY += s.velY;
    if (s.dinoY >= GROUND) { s.dinoY = GROUND; s.velY = 0; s.jumping = false; }

    // Spawn obstacles
    if (s.frame % Math.max(40, 80 - s.score) === 0) {
      const type = Math.random() > 0.7 ? "bird" : "cactus";
      s.obstacles.push({
        x: W + 20,
        w: type === "cactus" ? 15 + Math.random() * 10 : 20,
        h: type === "cactus" ? 30 + Math.random() * 20 : 15,
        type,
      });
    }

    // Move obstacles
    s.obstacles.forEach(o => o.x -= s.speed);
    s.obstacles = s.obstacles.filter(o => o.x > -50);

    // Collision
    const dinoBox = { x: 60, y: s.dinoY - 30, w: 25, h: 30 };
    for (const o of s.obstacles) {
      const obBox = { x: o.x, y: o.type === "bird" ? GROUND - 50 : GROUND - o.h, w: o.w, h: o.h };
      if (dinoBox.x < obBox.x + obBox.w && dinoBox.x + dinoBox.w > obBox.x &&
          dinoBox.y < obBox.y + obBox.h && dinoBox.y + dinoBox.h > obBox.y) {
        s.gameOver = true; setGameOver(true);
        saveGameScore("platformer-runner", s.score);
        return;
      }
    }

    // Draw
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    // Ground
    ctx.strokeStyle = "#39FF1440"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, GROUND + 5); ctx.lineTo(W, GROUND + 5); ctx.stroke();
    // Grid lines on ground
    for (let x = (s.frame * -s.speed) % 40; x < W; x += 40) {
      ctx.strokeStyle = "rgba(57,255,20,0.05)";
      ctx.beginPath(); ctx.moveTo(x, GROUND + 5); ctx.lineTo(x, H); ctx.stroke();
    }

    // Dino
    ctx.fillStyle = "#00F5FF"; ctx.shadowColor = "#00F5FF"; ctx.shadowBlur = 10;
    // Body
    ctx.fillRect(60, s.dinoY - 28, 20, 25);
    // Head
    ctx.fillRect(70, s.dinoY - 35, 15, 12);
    // Eye
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(78, s.dinoY - 33, 3, 3);
    // Legs
    ctx.fillStyle = "#00F5FF";
    const legOffset = s.jumping ? 0 : Math.sin(s.frame * 0.3) * 5;
    ctx.fillRect(63, s.dinoY - 5, 5, 8 + legOffset);
    ctx.fillRect(73, s.dinoY - 5, 5, 8 - legOffset);
    ctx.shadowBlur = 0;

    // Obstacles
    for (const o of s.obstacles) {
      if (o.type === "cactus") {
        ctx.fillStyle = "#39FF14"; ctx.shadowColor = "#39FF14"; ctx.shadowBlur = 5;
        ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
        // Spines
        ctx.fillRect(o.x - 5, GROUND - o.h + 10, 5, 3);
        ctx.fillRect(o.x + o.w, GROUND - o.h + 10, 5, 3);
      } else {
        ctx.fillStyle = "#FF006E"; ctx.shadowColor = "#FF006E"; ctx.shadowBlur = 5;
        ctx.fillRect(o.x, GROUND - 50, o.w, o.h);
        // Wing
        const wing = Math.sin(s.frame * 0.3) * 5;
        ctx.fillRect(o.x + 5, GROUND - 55 + wing, 10, 5);
      }
    }
    ctx.shadowBlur = 0;

    // Score
    ctx.fillStyle = "#FFE400"; ctx.font = "bold 16px monospace";
    ctx.fillText(`${s.score}`, W - 60, 30);

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    animRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [started, gameOver, gameLoop]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#39FF1440"; ctx.beginPath(); ctx.moveTo(0, GROUND + 5); ctx.lineTo(W, GROUND + 5); ctx.stroke();
    ctx.fillStyle = "#00F5FF"; ctx.fillRect(60, GROUND - 28, 20, 25); ctx.fillRect(70, GROUND - 35, 15, 12);
  }, []);

  const restart = () => {
    stateRef.current = { dinoY: GROUND, velY: 0, jumping: false, obstacles: [], score: 0, speed: 5, frame: 0, gameOver: false };
    setScore(0); setGameOver(false); setStarted(true);
  };

  return (
    <GameWrapper title="Dino Runner" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart}
      controls="Space/Tap to jump over obstacles" isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={W} height={H} onClick={jump}
          className="rounded-lg border border-white/10 cursor-pointer max-w-full" style={{ touchAction: "manipulation" }} />
      </div>
      {!started && !gameOver && <div className="text-center mt-4 text-text-secondary font-body">Click or press Space to start</div>}
    </GameWrapper>
  );
}
