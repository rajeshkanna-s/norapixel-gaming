"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";

// ── Types ──
interface Vec { x: number; y: number }
interface Bullet extends Vec { dy: number; w: number; h: number; color: string; dmg: number }
interface Enemy extends Vec { w: number; h: number; hp: number; maxHp: number; speed: number; type: string; color: string; glow: string; pts: number; shootCd: number; shootTimer: number }
interface Particle extends Vec { vx: number; vy: number; life: number; maxLife: number; color: string; size: number }
interface PowerUp extends Vec { type: string; color: string; glow: string; icon: string }
interface Star extends Vec { speed: number; size: number; alpha: number }

const W = 600, H = 700;
const PLAYER_W = 40, PLAYER_H = 44;

export default function NeonSpaceDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const stored = getGameScore("neon-space-defender");

  const state = useRef({
    player: { x: W / 2, y: H - 70 },
    bullets: [] as Bullet[],
    enemyBullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    powerups: [] as PowerUp[],
    stars: [] as Star[],
    score: 0,
    lives: 3,
    wave: 1,
    waveTimer: 0,
    waveCooldown: 0,
    fireRate: 8,
    fireCd: 0,
    powerLevel: 1,
    shieldActive: false,
    shieldTimer: 0,
    gameOver: false,
    mouseX: W / 2,
    mouseY: H - 70,
    shooting: false,
    screenShake: 0,
    combo: 0,
    comboTimer: 0,
  });

  // Init stars
  useEffect(() => {
    const s = state.current;
    s.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.3 + Math.random() * 1.5,
      size: 0.5 + Math.random() * 2,
      alpha: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, speed = 3) => {
    const s = state.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vel = speed * (0.5 + Math.random());
      s.particles.push({ x, y, vx: Math.cos(angle) * vel, vy: Math.sin(angle) * vel, life: 30 + Math.random() * 30, maxLife: 60, color, size: 1 + Math.random() * 3 });
    }
  }, []);

  const spawnWave = useCallback(() => {
    const s = state.current;
    const w = s.wave;
    const types = [
      { type: "scout", w: 28, h: 28, hp: 1, speed: 1.5 + w * 0.1, color: "#39FF14", glow: "#39FF14", pts: 10, shootCd: 0 },
      { type: "fighter", w: 34, h: 34, hp: 2 + Math.floor(w / 3), speed: 1 + w * 0.08, color: "#FF6B00", glow: "#FF6B00", pts: 25, shootCd: 90 },
      { type: "heavy", w: 44, h: 44, hp: 5 + w, speed: 0.6 + w * 0.04, color: "#FF0040", glow: "#FF0040", pts: 50, shootCd: 60 },
      { type: "boss", w: 60, h: 60, hp: 20 + w * 5, speed: 0.4, color: "#BF00FF", glow: "#BF00FF", pts: 200, shootCd: 30 },
    ];

    const count = 3 + Math.floor(w * 1.5);
    for (let i = 0; i < count; i++) {
      const tIdx = w >= 5 && i === 0 && w % 5 === 0 ? 3 : Math.min(Math.floor(Math.random() * Math.min(w, 3)), 2);
      const t = types[tIdx];
      s.enemies.push({
        x: 40 + Math.random() * (W - 80),
        y: -40 - Math.random() * 300,
        w: t.w, h: t.h, hp: t.hp, maxHp: t.hp, speed: t.speed,
        type: t.type, color: t.color, glow: t.glow, pts: t.pts,
        shootCd: t.shootCd, shootTimer: Math.floor(Math.random() * t.shootCd),
      });
    }
  }, []);

  const gameLoop = useCallback(() => {
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas || s.gameOver) return;
    const ctx = canvas.getContext("2d")!;

    // Screen shake offset
    let shakeX = 0, shakeY = 0;
    if (s.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * s.screenShake * 2;
      shakeY = (Math.random() - 0.5) * s.screenShake * 2;
      s.screenShake *= 0.9;
      if (s.screenShake < 0.5) s.screenShake = 0;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // ── Background ──
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#05051A");
    gradient.addColorStop(0.5, "#0A0A2E");
    gradient.addColorStop(1, "#0F0F1A");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Stars
    s.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#fff";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // ── Player movement ──
    const dx = s.mouseX - s.player.x;
    s.player.x += dx * 0.12;
    s.player.x = Math.max(PLAYER_W / 2, Math.min(W - PLAYER_W / 2, s.player.x));

    // ── Auto-fire ──
    if (s.shooting) {
      s.fireCd--;
      if (s.fireCd <= 0) {
        s.fireCd = s.fireRate;
        const bx = s.player.x;
        const by = s.player.y - PLAYER_H / 2;
        s.bullets.push({ x: bx, y: by, dy: -10, w: 3, h: 14, color: "#00F5FF", dmg: 1 });
        if (s.powerLevel >= 2) {
          s.bullets.push({ x: bx - 12, y: by + 6, dy: -9, w: 2, h: 10, color: "#00D4FF", dmg: 1 });
          s.bullets.push({ x: bx + 12, y: by + 6, dy: -9, w: 2, h: 10, color: "#00D4FF", dmg: 1 });
        }
        if (s.powerLevel >= 3) {
          s.bullets.push({ x: bx - 20, y: by + 12, dy: -8, w: 2, h: 8, color: "#00B4FF", dmg: 1 });
          s.bullets.push({ x: bx + 20, y: by + 12, dy: -8, w: 2, h: 8, color: "#00B4FF", dmg: 1 });
        }
      }
    }

    // ── Draw Player Ship ──
    const px = s.player.x, py = s.player.y;
    // Engine glow
    const engineGrad = ctx.createRadialGradient(px, py + PLAYER_H / 2, 2, px, py + PLAYER_H / 2 + 20, 20);
    engineGrad.addColorStop(0, "rgba(0,245,255,0.8)");
    engineGrad.addColorStop(0.5, "rgba(0,245,255,0.2)");
    engineGrad.addColorStop(1, "rgba(0,245,255,0)");
    ctx.fillStyle = engineGrad;
    ctx.fillRect(px - 15, py + PLAYER_H / 2, 30, 25);
    // Engine trail particles
    if (Math.random() < 0.5) {
      s.particles.push({ x: px + (Math.random() - 0.5) * 10, y: py + PLAYER_H / 2 + 5, vx: (Math.random() - 0.5) * 0.5, vy: 2 + Math.random() * 2, life: 15 + Math.random() * 10, maxLife: 25, color: "#00F5FF", size: 1 + Math.random() * 2 });
    }
    // Ship body
    ctx.fillStyle = "#1A2A40";
    ctx.strokeStyle = "#00F5FF";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00F5FF";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(px, py - PLAYER_H / 2);
    ctx.lineTo(px + PLAYER_W / 2, py + PLAYER_H / 2 - 8);
    ctx.lineTo(px + PLAYER_W / 2 - 6, py + PLAYER_H / 2);
    ctx.lineTo(px - PLAYER_W / 2 + 6, py + PLAYER_H / 2);
    ctx.lineTo(px - PLAYER_W / 2, py + PLAYER_H / 2 - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Cockpit
    ctx.fillStyle = "#00F5FF";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py - 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shield
    if (s.shieldActive) {
      s.shieldTimer--;
      if (s.shieldTimer <= 0) s.shieldActive = false;
      ctx.strokeStyle = `rgba(0,245,255,${0.3 + Math.sin(Date.now() * 0.01) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00F5FF";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(px, py, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ── Bullets ──
    s.bullets = s.bullets.filter(b => {
      b.y += b.dy;
      if (b.y < -20) return false;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
      ctx.shadowBlur = 0;
      return true;
    });

    // ── Enemy Bullets ──
    s.enemyBullets = s.enemyBullets.filter(b => {
      b.y += b.dy;
      if (b.y > H + 20) return false;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      return true;
    });

    // ── Enemies ──
    s.enemies = s.enemies.filter(enemy => {
      enemy.y += enemy.speed;
      // Zigzag for fighters
      if (enemy.type === "fighter") enemy.x += Math.sin(enemy.y * 0.03) * 1.5;
      if (enemy.type === "boss") enemy.x += Math.sin(enemy.y * 0.01 + Date.now() * 0.002) * 2;
      // Shooting
      if (enemy.shootCd > 0) {
        enemy.shootTimer++;
        if (enemy.shootTimer >= enemy.shootCd && enemy.y > 0) {
          enemy.shootTimer = 0;
          const angle = Math.atan2(py - enemy.y, px - enemy.x);
          s.enemyBullets.push({ x: enemy.x, y: enemy.y + enemy.h / 2, dy: 4, w: 4, h: 4, color: enemy.color, dmg: 1 });
        }
      }
      // Off screen
      if (enemy.y > H + 60) return false;
      // Draw enemy
      ctx.fillStyle = enemy.color + "30";
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = enemy.glow;
      ctx.shadowBlur = enemy.type === "boss" ? 25 : 12;
      if (enemy.type === "boss") {
        // Boss: hexagonal
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          const r = enemy.w / 2;
          ctx[i === 0 ? "moveTo" : "lineTo"](enemy.x + Math.cos(a) * r, enemy.y + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Boss eye
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === "heavy") {
        // Heavy: diamond
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y - enemy.h / 2);
        ctx.lineTo(enemy.x + enemy.w / 2, enemy.y);
        ctx.lineTo(enemy.x, enemy.y + enemy.h / 2);
        ctx.lineTo(enemy.x - enemy.w / 2, enemy.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Scout/Fighter: triangle
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + enemy.h / 2);
        ctx.lineTo(enemy.x + enemy.w / 2, enemy.y - enemy.h / 2);
        ctx.lineTo(enemy.x - enemy.w / 2, enemy.y - enemy.h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // HP bar for non-scouts
      if (enemy.maxHp > 1) {
        const bw = enemy.w;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(enemy.x - bw / 2, enemy.y - enemy.h / 2 - 8, bw, 3);
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - bw / 2, enemy.y - enemy.h / 2 - 8, bw * (enemy.hp / enemy.maxHp), 3);
      }
      return true;
    });

    // ── Collision: Bullets vs Enemies ──
    s.bullets = s.bullets.filter(bullet => {
      let hit = false;
      s.enemies = s.enemies.filter(enemy => {
        if (hit) return true;
        const dx = bullet.x - enemy.x, dy = bullet.y - enemy.y;
        if (Math.abs(dx) < (bullet.w + enemy.w) / 2 && Math.abs(dy) < (bullet.h + enemy.h) / 2) {
          hit = true;
          enemy.hp -= bullet.dmg;
          spawnParticles(bullet.x, bullet.y, enemy.color, 4, 2);
          if (enemy.hp <= 0) {
            // Destroyed
            spawnParticles(enemy.x, enemy.y, enemy.color, enemy.type === "boss" ? 40 : 15, enemy.type === "boss" ? 6 : 4);
            spawnParticles(enemy.x, enemy.y, "#FFE400", 8, 3);
            s.score += enemy.pts * (1 + Math.floor(s.combo / 5));
            s.combo++;
            s.comboTimer = 120;
            s.screenShake = enemy.type === "boss" ? 12 : 4;
            setScore(s.score);
            // Power-up drop
            if (Math.random() < (enemy.type === "boss" ? 1 : 0.08)) {
              const types = [
                { type: "power", color: "#00F5FF", glow: "#00F5FF", icon: "⚡" },
                { type: "shield", color: "#39FF14", glow: "#39FF14", icon: "🛡️" },
                { type: "life", color: "#FF006E", glow: "#FF006E", icon: "❤️" },
              ];
              const pu = types[Math.floor(Math.random() * types.length)];
              s.powerups.push({ x: enemy.x, y: enemy.y, ...pu });
            }
            return false;
          }
          return true;
        }
        return true;
      });
      return !hit;
    });

    // ── Collision: Enemy bullets vs Player ──
    s.enemyBullets = s.enemyBullets.filter(b => {
      const hit = Math.abs(b.x - px) < 15 && Math.abs(b.y - py) < 18;
      if (hit) {
        if (s.shieldActive) {
          spawnParticles(b.x, b.y, "#00F5FF", 6, 3);
          return false;
        }
        s.lives--;
        s.screenShake = 8;
        spawnParticles(px, py, "#FF0040", 20, 4);
        setLives(s.lives);
        if (s.lives <= 0) {
          s.gameOver = true;
          setGameOver(true);
          saveGameScore("neon-space-defender", s.score);
          spawnParticles(px, py, "#FF0040", 40, 6);
          spawnParticles(px, py, "#FFE400", 20, 5);
        }
      }
      return !hit;
    });

    // ── Collision: Enemies vs Player ──
    s.enemies = s.enemies.filter(enemy => {
      if (Math.abs(enemy.x - px) < (PLAYER_W + enemy.w) / 2 - 5 && Math.abs(enemy.y - py) < (PLAYER_H + enemy.h) / 2 - 5) {
        if (s.shieldActive) {
          enemy.hp = 0;
          spawnParticles(enemy.x, enemy.y, enemy.color, 15, 4);
          s.score += enemy.pts;
          setScore(s.score);
          return false;
        }
        s.lives--;
        s.screenShake = 10;
        spawnParticles(enemy.x, enemy.y, "#FF0040", 25, 5);
        setLives(s.lives);
        if (s.lives <= 0) {
          s.gameOver = true;
          setGameOver(true);
          saveGameScore("neon-space-defender", s.score);
        }
        return false;
      }
      return true;
    });

    // ── Power-ups ──
    s.powerups = s.powerups.filter(pu => {
      pu.y += 1.5;
      if (pu.y > H + 30) return false;
      // Collect
      if (Math.abs(pu.x - px) < 25 && Math.abs(pu.y - py) < 25) {
        if (pu.type === "power") { s.powerLevel = Math.min(3, s.powerLevel + 1); s.fireRate = Math.max(4, s.fireRate - 1); }
        else if (pu.type === "shield") { s.shieldActive = true; s.shieldTimer = 300; }
        else if (pu.type === "life") { s.lives = Math.min(5, s.lives + 1); setLives(s.lives); }
        spawnParticles(pu.x, pu.y, pu.color, 10, 3);
        return false;
      }
      // Draw
      ctx.fillStyle = pu.color + "20";
      ctx.strokeStyle = pu.color;
      ctx.shadowColor = pu.glow;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pu.icon, pu.x, pu.y + 5);
      return true;
    });

    // ── Particles ──
    s.particles = s.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vx *= 0.97;
      p.vy *= 0.97;
      if (p.life <= 0) return false;
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      return true;
    });

    // ── Combo display ──
    if (s.comboTimer > 0) {
      s.comboTimer--;
      if (s.comboTimer <= 0) s.combo = 0;
      if (s.combo >= 3) {
        ctx.globalAlpha = Math.min(1, s.comboTimer / 30);
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "#FFE400";
        ctx.shadowColor = "#FFE400";
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.fillText(`${s.combo}x COMBO!`, W / 2, 60);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    // ── Wave management ──
    if (s.enemies.length === 0 && s.waveCooldown <= 0) {
      s.waveCooldown = 90;
    }
    if (s.waveCooldown > 0) {
      s.waveCooldown--;
      if (s.waveCooldown === 45) {
        // Show wave text
      }
      if (s.waveCooldown <= 0) {
        s.wave++;
        setWave(s.wave);
        spawnWave();
      }
      // Wave cleared text
      ctx.globalAlpha = Math.min(1, s.waveCooldown / 30);
      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "#00F5FF";
      ctx.shadowColor = "#00F5FF";
      ctx.shadowBlur = 15;
      ctx.textAlign = "center";
      ctx.fillText(`WAVE ${s.wave + 1} INCOMING`, W / 2, H / 2);
      ctx.font = "14px monospace";
      ctx.fillStyle = "#39FF14";
      ctx.fillText(`Wave ${s.wave} cleared!`, W / 2, H / 2 + 30);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // ── HUD overlay ──
    // Power level indicator
    ctx.font = "10px monospace";
    ctx.fillStyle = "#00F5FF";
    ctx.textAlign = "left";
    ctx.fillText(`PWR: ${"█".repeat(s.powerLevel)}${"░".repeat(3 - s.powerLevel)}`, 10, H - 10);
    if (s.shieldActive) {
      ctx.fillStyle = "#39FF14";
      ctx.fillText(`SHIELD: ${Math.ceil(s.shieldTimer / 60)}s`, 100, H - 10);
    }

    ctx.restore();
  }, [spawnParticles, spawnWave]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(id);
  }, [started, gameOver, gameLoop]);

  // Input handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();
    const getXY = (e: MouseEvent | TouchEvent) => {
      const r = rect();
      const scaleX = W / r.width, scaleY = H / r.height;
      if ("touches" in e) {
        return { x: (e.touches[0].clientX - r.left) * scaleX, y: (e.touches[0].clientY - r.top) * scaleY };
      }
      return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
    };

    const onMove = (e: MouseEvent) => { state.current.mouseX = getXY(e).x; };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); state.current.mouseX = getXY(e).x; };
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!started) { setStarted(true); spawnWave(); }
      state.current.shooting = true;
      if ("clientX" in e) state.current.mouseX = getXY(e).x;
      else state.current.mouseX = getXY(e).x;
    };
    const onUp = () => { state.current.shooting = false; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown as any);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown as any, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onUp);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown as any);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown as any);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [started, spawnWave]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#05051A");
    gradient.addColorStop(1, "#0A0A2E");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#00F5FF";
    ctx.shadowColor = "#00F5FF";
    ctx.shadowBlur = 15;
    ctx.textAlign = "center";
    ctx.fillText("🚀 NEON SPACE DEFENDER", W / 2, H / 2 - 30);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#ccc";
    ctx.shadowBlur = 0;
    ctx.fillText("Click / Tap to START", W / 2, H / 2 + 10);
    ctx.font = "11px monospace";
    ctx.fillStyle = "#888";
    ctx.fillText("Move mouse to aim • Hold click to fire", W / 2, H / 2 + 40);
  }, []);

  const restart = () => {
    const s = state.current;
    s.player = { x: W / 2, y: H - 70 };
    s.bullets = [];
    s.enemyBullets = [];
    s.enemies = [];
    s.particles = [];
    s.powerups = [];
    s.score = 0; s.lives = 3; s.wave = 1; s.waveTimer = 0; s.waveCooldown = 0;
    s.fireRate = 8; s.fireCd = 0; s.powerLevel = 1;
    s.shieldActive = false; s.shieldTimer = 0; s.gameOver = false;
    s.combo = 0; s.comboTimer = 0; s.screenShake = 0;
    setScore(0); setLives(3); setWave(1); setGameOver(false); setStarted(true);
    spawnWave();
  };

  return (
    <GameWrapper
      title="Neon Space Defender"
      difficulty="hard"
      score={score}
      highScore={stored.highScore}
      isGameOver={gameOver}
      onRestart={restart}
      lives={lives}
      level={wave}
      controls="Mouse to aim • Hold click to fire • Mobile: touch & drag"
      isNewHighScore={gameOver && score > stored.highScore}
    >
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-xl border border-white/10 max-w-full cursor-crosshair"
          style={{ aspectRatio: `${W}/${H}`, maxHeight: "75vh" }}
        />
      </div>
      {!started && !gameOver && (
        <div className="text-center mt-3 text-text-secondary font-body text-sm">Click the game area to start</div>
      )}
    </GameWrapper>
  );
}
