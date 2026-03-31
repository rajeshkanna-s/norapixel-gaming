"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

const W = 400, H = 500, PLAYER_W = 30, PLAYER_H = 20;

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [lives, setLives] = useState(3);
  const stored = getGameScore("space-invaders");
  const stateRef = useRef({
    player: W / 2,
    bullets: [] as { x: number; y: number }[],
    aliens: [] as { x: number; y: number; alive: boolean }[],
    alienBullets: [] as { x: number; y: number }[],
    alienDir: 1, alienSpeed: 0.5, frame: 0, score: 0, lives: 3, gameOver: false,
  });
  const keysRef = useRef(new Set<string>());
  const animRef = useRef<number>(0);

  useEffect(() => {
    const aliens: typeof stateRef.current.aliens = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      aliens.push({ x: 50 + c * 40, y: 40 + r * 35, alive: true });
    }
    stateRef.current.aliens = aliens;
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || s.gameOver) return;
    const ctx = canvas.getContext("2d")!;
    s.frame++;

    // Player movement
    if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) s.player = Math.max(PLAYER_W/2, s.player - 4);
    if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) s.player = Math.min(W - PLAYER_W/2, s.player + 4);

    // Move bullets
    s.bullets = s.bullets.filter(b => { b.y -= 6; return b.y > 0; });
    s.alienBullets = s.alienBullets.filter(b => { b.y += 3; return b.y < H; });

    // Move aliens
    if (s.frame % 3 === 0) {
      const aliveAliens = s.aliens.filter(a => a.alive);
      const minX = Math.min(...aliveAliens.map(a => a.x));
      const maxX = Math.max(...aliveAliens.map(a => a.x));
      if (maxX > W - 20) { s.alienDir = -1; s.aliens.forEach(a => a.y += 10); }
      if (minX < 20) { s.alienDir = 1; s.aliens.forEach(a => a.y += 10); }
      s.aliens.forEach(a => { if (a.alive) a.x += s.alienDir * s.alienSpeed * 2; });
    }

    // Alien shooting
    if (s.frame % 60 === 0) {
      const alive = s.aliens.filter(a => a.alive);
      if (alive.length > 0) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        s.alienBullets.push({ x: shooter.x, y: shooter.y + 15 });
      }
    }

    // Bullet-alien collision
    for (const bullet of s.bullets) {
      for (const alien of s.aliens) {
        if (!alien.alive) continue;
        if (Math.abs(bullet.x - alien.x) < 15 && Math.abs(bullet.y - alien.y) < 12) {
          alien.alive = false;
          bullet.y = -10;
          s.score += 10;
          setScore(s.score);
        }
      }
    }

    // Alien bullet-player collision
    for (const ab of s.alienBullets) {
      if (Math.abs(ab.x - s.player) < PLAYER_W/2 && ab.y > H - 40 && ab.y < H - 10) {
        ab.y = H + 10;
        s.lives--;
        setLives(s.lives);
        if (s.lives <= 0) { s.gameOver = true; setGameOver(true); saveGameScore("space-invaders", s.score); return; }
      }
    }

    // Aliens reach bottom
    if (s.aliens.some(a => a.alive && a.y > H - 60)) {
      s.gameOver = true; setGameOver(true); saveGameScore("space-invaders", s.score);
      return;
    }

    // Win check
    if (s.aliens.every(a => !a.alive)) {
      s.gameOver = true; setGameOver(true); saveGameScore("space-invaders", s.score);
      return;
    }

    // Draw
    ctx.fillStyle = "#0A0A1A"; ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.1})`;
      ctx.fillRect((i * 97 + s.frame * 0.1) % W, (i * 53) % H, 1, 1);
    }
    // Player
    ctx.fillStyle = "#00F5FF"; ctx.shadowColor = "#00F5FF"; ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(s.player, H - 30);
    ctx.lineTo(s.player - PLAYER_W/2, H - 10);
    ctx.lineTo(s.player + PLAYER_W/2, H - 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Bullets
    ctx.fillStyle = "#FFE400";
    ctx.shadowColor = "#FFE400"; ctx.shadowBlur = 5;
    s.bullets.forEach(b => ctx.fillRect(b.x - 1, b.y, 2, 8));
    ctx.shadowBlur = 0;
    // Alien bullets
    ctx.fillStyle = "#FF0040";
    s.alienBullets.forEach(b => ctx.fillRect(b.x - 1, b.y, 2, 6));
    // Aliens
    s.aliens.forEach(a => {
      if (!a.alive) return;
      ctx.fillStyle = "#39FF14"; ctx.shadowColor = "#39FF14"; ctx.shadowBlur = 5;
      ctx.fillRect(a.x - 12, a.y - 8, 24, 16);
      // Eyes
      ctx.fillStyle = "#0A0A1A";
      ctx.fillRect(a.x - 6, a.y - 4, 4, 4);
      ctx.fillRect(a.x + 2, a.y - 4, 4, 4);
    });
    ctx.shadowBlur = 0;

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    animRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [started, gameOver, gameLoop]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " && !stateRef.current.gameOver) {
        e.preventDefault();
        if (!started) setStarted(true);
        stateRef.current.bullets.push({ x: stateRef.current.player, y: H - 35 });
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [started]);

  const restart = () => {
    const aliens: typeof stateRef.current.aliens = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) aliens.push({ x: 50 + c * 40, y: 40 + r * 35, alive: true });
    stateRef.current = { player: W/2, bullets: [], aliens, alienBullets: [], alienDir: 1, alienSpeed: 0.5, frame: 0, score: 0, lives: 3, gameOver: false };
    setScore(0); setGameOver(false); setLives(3); setStarted(true);
  };

  return (
    <GameWrapper title="Space Invaders" difficulty="hard" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} lives={lives}
      controls="←→ move, Space to shoot" isNewHighScore={gameOver && score > stored.highScore}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-lg border border-white/10 max-w-full" />
      </div>
      {!started && <div className="text-center mt-4 text-text-secondary font-body">Press Space to start</div>}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <button onTouchStart={() => keysRef.current.add("ArrowLeft")} onTouchEnd={() => keysRef.current.delete("ArrowLeft")}
          className="w-14 h-14 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">←</button>
        <button onClick={() => { stateRef.current.bullets.push({ x: stateRef.current.player, y: H - 35 }); if (!started) setStarted(true); }}
          className="w-14 h-14 rounded bg-neon-cyan/20 border border-neon-cyan/30 text-lg cursor-pointer">🔫</button>
        <button onTouchStart={() => keysRef.current.add("ArrowRight")} onTouchEnd={() => keysRef.current.delete("ArrowRight")}
          className="w-14 h-14 rounded bg-bg-surface border border-white/10 text-lg cursor-pointer">→</button>
      </div>
    </GameWrapper>
  );
}
