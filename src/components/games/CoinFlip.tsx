"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

export default function CoinFlip() {
  const [guess, setGuess] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const stored = getGameScore("coin-flip");

  const flip = (g: string) => {
    if (flipping) return;
    setGuess(g);
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.random() > 0.5 ? "heads" : "tails";
      setResult(r);
      setFlipping(false);
      if (r === g) {
        const newWins = wins + 1;
        setWins(newWins);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        saveGameScore("coin-flip", Math.max(newStreak, stored.highScore));
      } else {
        setLosses(losses + 1);
        setStreak(0);
      }
    }, 1500);
  };

  return (
    <GameWrapper title="Coin Flip" difficulty="easy" score={wins} highScore={stored.highScore}
      isGameOver={false} onRestart={() => { setWins(0); setLosses(0); setStreak(0); setResult(null); setGuess(null); }}
      controls="Pick Heads or Tails before the flip">

      {/* Coin */}
      <div className="flex justify-center mb-6">
        <motion.div
          animate={flipping ? { rotateY: 1800 } : { rotateY: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-32 h-32 rounded-full border-4 border-neon-yellow flex items-center justify-center text-5xl"
          style={{ background: "linear-gradient(135deg, #FFE400, #FF6B00)", perspective: 800, transformStyle: "preserve-3d" }}
        >
          {result ? (result === "heads" ? "👑" : "🦅") : "🪙"}
        </motion.div>
      </div>

      {/* Result text */}
      {result && !flipping && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mb-4">
          <div className={`font-heading text-2xl ${result === guess ? "text-neon-green" : "text-neon-red"}`}>
            {result.toUpperCase()}!
          </div>
          <div className="text-sm text-text-secondary font-body">
            {result === guess ? "You got it! 🎉" : "Not this time! 😅"}
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={flipping}
          onClick={() => flip("heads")}
          className="px-6 py-3 rounded-lg border-2 border-neon-yellow bg-neon-yellow/10 text-neon-yellow font-heading text-sm uppercase tracking-wider hover:bg-neon-yellow/20 transition-all cursor-pointer disabled:opacity-50">
          👑 Heads
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={flipping}
          onClick={() => flip("tails")}
          className="px-6 py-3 rounded-lg border-2 border-neon-orange bg-neon-orange/10 text-neon-orange font-heading text-sm uppercase tracking-wider hover:bg-neon-orange/20 transition-all cursor-pointer disabled:opacity-50">
          🦅 Tails
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto text-center">
        <div><div className="font-mono text-lg text-neon-green">{wins}</div><div className="text-xs text-text-muted">Wins</div></div>
        <div><div className="font-mono text-lg text-neon-red">{losses}</div><div className="text-xs text-text-muted">Losses</div></div>
        <div><div className="font-mono text-lg text-neon-cyan">{streak}</div><div className="text-xs text-text-muted">Streak{streak > 3 ? " 🔥" : ""}</div></div>
        <div><div className="font-mono text-lg text-neon-yellow">{bestStreak}</div><div className="text-xs text-text-muted">Best</div></div>
      </div>
    </GameWrapper>
  );
}
