"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NeonButton from "@/components/ui/NeonButton";
import {
  ArrowLeft, Trophy, Clock, Heart, Layers, RotateCcw,
  Pause, Play, LogOut, X, Maximize2, Minimize2, Info
} from "lucide-react";

interface GameWrapperProps {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  children: React.ReactNode;
  score: number;
  highScore: number;
  isGameOver: boolean;
  onRestart: () => void;
  timer?: number;
  lives?: number;
  level?: number;
  controls?: string;
  isNewHighScore?: boolean;
}

const diffColors = { easy: "text-neon-green", medium: "text-neon-yellow", hard: "text-neon-red" };
const diffStars = { easy: "★", medium: "★★★", hard: "★★★★★" };
const diffBg = { easy: "bg-neon-green/10 border-neon-green/30", medium: "bg-neon-yellow/10 border-neon-yellow/30", hard: "bg-neon-red/10 border-neon-red/30" };

export default function GameWrapper({
  title,
  difficulty,
  children,
  score,
  highScore,
  isGameOver,
  onRestart,
  timer: externalTimer,
  lives,
  level,
  controls,
  isNewHighScore = false,
}: GameWrapperProps) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto timer — counts up every second while game is active
  useEffect(() => {
    if (isGameOver || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, isPaused]);

  // Reset timer on restart
  useEffect(() => {
    if (!isGameOver && score === 0) setElapsed(0);
  }, [isGameOver, score]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showQuit) setShowQuit(false);
        else if (showControls) setShowControls(false);
        else setShowQuit(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showQuit, showControls]);

  const displayTimer = externalTimer !== undefined ? externalTimer : elapsed;
  const mins = Math.floor(displayTimer / 60).toString().padStart(2, "0");
  const secs = (displayTimer % 60).toString().padStart(2, "0");

  return (
    <div className="w-full min-h-[calc(100vh-60px)] flex flex-col px-2 md:px-4 py-3 md:py-4">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between mb-3 md:mb-4 max-w-6xl mx-auto w-full">
        {/* Left: Quit + Title */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => setShowQuit(true)}
            className="p-1.5 md:p-2 rounded-lg bg-white/5 hover:bg-neon-red/10 border border-white/5 hover:border-neon-red/30 transition-all cursor-pointer flex-shrink-0"
            title="Quit Game (Esc)"
          >
            <LogOut className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="min-w-0">
            <h1 className="font-heading text-xs md:text-base text-text-primary truncate">{title}</h1>
            <div className="flex items-center gap-1.5">
              <span className={`text-[8px] md:text-[10px] font-heading uppercase px-1.5 py-0.5 rounded border ${diffBg[difficulty]} ${diffColors[difficulty]}`}>
                {difficulty}
              </span>
              {level !== undefined && (
                <span className="text-[8px] md:text-[10px] font-mono text-neon-purple">
                  <Layers className="w-3 h-3 inline mr-0.5" />Lv.{level}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-1.5 font-mono text-sm md:text-base text-neon-cyan">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>{mins}:{secs}</span>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
          {controls && (
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-1.5 md:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
              title="Controls"
            >
              <Info className="w-4 h-4 text-text-secondary" />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 md:p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/10 border border-white/5 hover:border-neon-cyan/30 transition-all cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-neon-cyan" /> : <Maximize2 className="w-4 h-4 text-text-secondary" />}
          </button>
          <button
            onClick={onRestart}
            className="p-1.5 md:p-2 rounded-lg bg-white/5 hover:bg-neon-yellow/10 border border-white/5 hover:border-neon-yellow/30 transition-all cursor-pointer"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="flex items-center justify-center gap-3 md:gap-5 mb-3 md:mb-4 text-xs md:text-sm max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-1.5 font-mono px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
          <span className="text-text-muted text-[10px] md:text-xs">Score</span>
          <span className="text-neon-cyan font-bold text-sm md:text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
          <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-neon-yellow" />
          <span className="text-neon-yellow font-bold text-sm md:text-lg">{highScore}</span>
        </div>
        {lives !== undefined && (
          <div className="flex items-center gap-0.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5">
            {Array.from({ length: Math.max(lives, 0) }, (_, i) => (
              <Heart key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-neon-red fill-neon-red" />
            ))}
            {lives === 0 && <Heart className="w-3.5 h-3.5 text-white/20" />}
          </div>
        )}
      </div>

      {/* ── Controls Info Panel ── */}
      {showControls && controls && (
        <div className="max-w-6xl mx-auto w-full mb-3 animate-fade-in">
          <div className="neon-card p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan text-xs font-heading">🎮 CONTROLS:</span>
              <span className="text-text-secondary text-xs font-body">{controls}</span>
            </div>
            <button onClick={() => setShowControls(false)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
              <X className="w-3 h-3 text-text-muted" />
            </button>
          </div>
        </div>
      )}

      {/* ── GAME AREA ── */}
      <div className="neon-card p-4 md:p-6 relative min-h-[50vh] max-w-6xl mx-auto w-full">
        <div className="relative z-10">
          {children}
        </div>

        {/* Pause Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20 animate-fade-in">
            <div className="text-center p-8">
              <div className="text-4xl mb-3">⏸️</div>
              <h2 className="font-heading text-xl md:text-2xl text-neon-yellow mb-4">PAUSED</h2>
              <div className="flex gap-3 justify-center">
                <NeonButton onClick={() => setIsPaused(false)} variant="cyan" size="lg">
                  <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Resume</span>
                </NeonButton>
                <NeonButton onClick={onRestart} variant="purple" size="lg">
                  <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Restart</span>
                </NeonButton>
              </div>
              <p className="text-text-muted text-xs mt-4 font-body">Time: {mins}:{secs} • Score: {score}</p>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center rounded-xl z-20 animate-fade-in">
            <div className="text-center p-6 md:p-8 animate-scale-in">
              <h2 className="font-heading text-2xl md:text-4xl text-neon-red mb-2">GAME OVER</h2>
              <div className="font-mono text-3xl md:text-5xl text-neon-cyan mb-1">{score}</div>
              <div className="text-text-muted text-xs font-mono mb-3">Time: {mins}:{secs}</div>
              {isNewHighScore && (
                <div className="font-heading text-sm md:text-base text-neon-yellow mb-4 animate-neon-pulse">
                  🏆 NEW HIGH SCORE!
                </div>
              )}
              {/* Stats Summary */}
              <div className="flex gap-4 justify-center mb-4 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-text-muted">Score</div>
                  <div className="text-neon-cyan font-bold">{score}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-text-muted">Time</div>
                  <div className="text-neon-green font-bold">{mins}:{secs}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-text-muted">Best</div>
                  <div className="text-neon-yellow font-bold">{Math.max(highScore, score)}</div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <NeonButton onClick={() => { onRestart(); setElapsed(0); }} variant="cyan" size="lg">
                  <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Play Again</span>
                </NeonButton>
                <Link href="/games">
                  <NeonButton variant="purple" size="lg">All Games</NeonButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Quit Confirmation Modal ── */}
      {showQuit && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowQuit(false)}>
          <div className="neon-card max-w-sm w-full p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl mb-3">🚪</div>
            <h3 className="font-heading text-lg text-text-primary mb-1">QUIT GAME?</h3>
            <p className="text-text-muted text-xs font-body mb-4">Your current progress will be lost.</p>
            <div className="flex gap-3 justify-center mb-3">
              <div className="text-xs font-mono px-3 py-1 rounded bg-white/5 border border-white/10">
                <span className="text-text-muted">Score: </span><span className="text-neon-cyan">{score}</span>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded bg-white/5 border border-white/10">
                <span className="text-text-muted">Time: </span><span className="text-neon-green">{mins}:{secs}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <NeonButton onClick={() => setShowQuit(false)} variant="cyan">
                Continue Playing
              </NeonButton>
              <NeonButton onClick={() => router.push("/games")} variant="purple">
                Quit
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
