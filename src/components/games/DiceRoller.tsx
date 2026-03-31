"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const dotPatterns: Record<number, [number,number][]> = {
  1: [[1,1]], 2: [[0,0],[2,2]], 3: [[0,0],[1,1],[2,2]],
  4: [[0,0],[0,2],[2,0],[2,2]], 5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
  6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
};

export default function DiceRoller() {
  const [guess, setGuess] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [rolls, setRolls] = useState(0);
  const stored = getGameScore("dice-roller");

  const roll = () => {
    if (!guess || rolling) return;
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.floor(Math.random() * 6) + 1;
      setResult(r);
      setRolling(false);
      setRolls(rolls + 1);
      if (r === guess) {
        const newScore = score + 10;
        setScore(newScore);
        saveGameScore("dice-roller", Math.max(newScore, stored.highScore));
      }
    }, 1000);
  };

  const restart = () => { setGuess(null); setResult(null); setScore(0); setRolls(0); };

  return (
    <GameWrapper title="Dice Roller" difficulty="easy" score={score} highScore={stored.highScore}
      isGameOver={false} onRestart={restart} controls="Pick a number 1-6, then click Roll">

      {/* Dice */}
      <div className="flex justify-center mb-6">
        <motion.div
          animate={rolling ? { rotateX: [0,360,720], rotateY: [0,360,720] } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 bg-white rounded-xl flex items-center justify-center relative"
          style={{ perspective: 800 }}
        >
          <div className="grid grid-cols-3 gap-1 p-3 w-full h-full">
            {Array.from({ length: 9 }, (_, i) => {
              const row = Math.floor(i / 3), col = i % 3;
              const face = result || 1;
              const isDot = dotPatterns[face]?.some(([r,c]) => r === row && c === col);
              return (
                <div key={i} className="flex items-center justify-center">
                  {isDot && <div className="w-4 h-4 rounded-full bg-bg-primary" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Result */}
      {result && !rolling && (
        <div className={`text-center mb-4 font-heading text-xl ${result === guess ? "text-neon-green" : "text-neon-red"}`}>
          {result === guess ? `Correct! +10 🎉` : `Rolled ${result}! You guessed ${guess} 😅`}
        </div>
      )}

      {/* Number picker */}
      <div className="flex justify-center gap-2 mb-4">
        {[1,2,3,4,5,6].map(n => (
          <motion.button key={n} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => setGuess(n)}
            className={`w-12 h-12 rounded-lg border-2 font-heading text-lg flex items-center justify-center cursor-pointer transition-all ${
              guess === n ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan" : "border-white/10 text-text-muted hover:border-neon-cyan/30"
            }`}>{n}</motion.button>
        ))}
      </div>

      {/* Roll button */}
      <div className="text-center mb-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!guess || rolling}
          onClick={roll}
          className="neon-btn text-sm cursor-pointer disabled:opacity-50">
          🎲 ROLL!
        </motion.button>
      </div>

      <div className="text-center text-text-muted text-xs font-mono">
        Rolls: {rolls} | Score: {score}
      </div>
    </GameWrapper>
  );
}
