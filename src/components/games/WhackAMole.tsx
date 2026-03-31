"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion, AnimatePresence } from "framer-motion";

export default function WhackAMole() {
  const [grid, setGrid] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [diff, setDiff] = useState<"easy"|"medium"|"hard">("medium");
  const [gameOver, setGameOver] = useState(false);
  const stored = getGameScore("whack-a-mole");
  const stayTime = { easy: 1200, medium: 800, hard: 500 };

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setActive(false); setGameOver(true); saveGameScore("whack-a-mole", score); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [active, score]);

  useEffect(() => {
    if (!active) return;
    const show = () => {
      const idx = Math.floor(Math.random() * 9);
      setGrid(g => { const n = [...g]; n[idx] = true; return n; });
      setTimeout(() => setGrid(g => { const n = [...g]; n[idx] = false; return n; }), stayTime[diff]);
    };
    const iv = setInterval(show, stayTime[diff] + 200);
    show();
    return () => clearInterval(iv);
  }, [active, diff]);

  const whack = (idx: number) => {
    if (!grid[idx]) return;
    setGrid(g => { const n = [...g]; n[idx] = false; return n; });
    setScore(s => s + 10);
  };

  const start = () => { setActive(true); setScore(0); setTimeLeft(30); setGameOver(false); setGrid(Array(9).fill(false)); };
  const restart = () => start();

  const progress = (timeLeft / 30) * 100;

  return (
    <GameWrapper title="Whack-a-Mole" difficulty="medium" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} timer={timeLeft}
      controls="Click/tap moles as fast as they appear" isNewHighScore={gameOver && score > stored.highScore}>

      {!active && !gameOver && (
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {(["easy","medium","hard"] as const).map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-3 py-1 text-xs font-heading rounded border cursor-pointer ${
                  diff === d ? "border-neon-cyan text-neon-cyan" : "border-white/10 text-text-muted"
                }`}>{d}</button>
            ))}
          </div>
          <button onClick={start} className="neon-btn cursor-pointer">START!</button>
        </div>
      )}

      {(active || gameOver) && (
        <>
          <div className="h-2 rounded-full overflow-hidden bg-bg-surface mb-4 max-w-sm mx-auto">
            <div className={`h-full rounded-full transition-all duration-1000 ${progress > 50 ? "bg-neon-green" : progress > 20 ? "bg-neon-yellow" : "bg-neon-red"}`}
              style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {grid.map((hasMole, i) => (
              <motion.button key={i} onClick={() => whack(i)} whileTap={{ scale: 0.9 }}
                className="aspect-square rounded-full border-2 border-amber-800/50 bg-amber-900/30 flex items-center justify-center text-3xl cursor-pointer relative overflow-hidden">
                <AnimatePresence>
                  {hasMole && (
                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                      transition={{ duration: 0.15 }} className="text-4xl">🐹</motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </GameWrapper>
  );
}
