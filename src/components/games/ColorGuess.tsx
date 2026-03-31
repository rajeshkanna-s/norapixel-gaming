"use client";
import { useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

function randomRGB() { return { r: Math.floor(Math.random()*256), g: Math.floor(Math.random()*256), b: Math.floor(Math.random()*256) }; }
function rgbToHex(r:number,g:number,b:number) { return "#"+[r,g,b].map(x=>x.toString(16).padStart(2,"0")).join(""); }
function similarColor(base:{r:number,g:number,b:number}) {
  const off = () => Math.floor(Math.random() * 100) - 50;
  return { r: Math.max(0,Math.min(255,base.r+off())), g: Math.max(0,Math.min(255,base.g+off())), b: Math.max(0,Math.min(255,base.b+off())) };
}

function generateRound(numOptions: number) {
  const target = randomRGB();
  const correctIdx = Math.floor(Math.random() * numOptions);
  const options = Array.from({ length: numOptions }, (_, i) => {
    if (i === correctIdx) return rgbToHex(target.r, target.g, target.b);
    const s = similarColor(target);
    return rgbToHex(s.r, s.g, s.b);
  });
  return { target, options, correctIdx };
}

export default function ColorGuess() {
  const [mode, setMode] = useState<3|6>(6);
  const [round, setRound] = useState(() => generateRound(6));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<string|null>(null);
  const [gameOver, setGameOver] = useState(false);
  const stored = getGameScore("color-guess");

  const handlePick = useCallback((idx: number) => {
    if (feedback || gameOver) return;
    if (idx === round.correctIdx) {
      setScore(s => s + 10);
      setFeedback("correct");
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback("wrong");
      if (newLives <= 0) {
        setGameOver(true);
        saveGameScore("color-guess", score);
        return;
      }
    }
    setTimeout(() => { setRound(generateRound(mode)); setFeedback(null); }, 1000);
  }, [round, feedback, gameOver, lives, score, mode]);

  const restart = () => { setScore(0); setLives(3); setRound(generateRound(mode)); setFeedback(null); setGameOver(false); };

  return (
    <GameWrapper title="Color Guessing" difficulty="easy" score={score} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={restart} lives={lives}
      controls="Click the color that matches the RGB code" isNewHighScore={gameOver && score > stored.highScore}>

      <div className="text-center mb-6">
        <div className="font-mono text-2xl text-text-primary mb-2">
          rgb({round.target.r}, {round.target.g}, {round.target.b})
        </div>
        <div className="flex justify-center gap-2">
          {([3,6] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setRound(generateRound(m)); }}
              className={`px-3 py-1 text-xs font-heading rounded border cursor-pointer ${
                mode === m ? "border-neon-cyan text-neon-cyan" : "border-white/10 text-text-muted"
              }`}>{m === 3 ? "Easy" : "Hard"}</button>
          ))}
        </div>
      </div>

      <div className={`grid ${mode === 3 ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-6"} gap-3 max-w-md mx-auto mb-4`}>
        {round.options.map((color, i) => (
          <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => handlePick(i)}
            className={`aspect-square rounded-xl cursor-pointer border-3 transition-all ${
              feedback && i === round.correctIdx ? "border-neon-green shadow-[0_0_20px_rgba(57,255,20,0.5)]" :
              feedback === "wrong" ? "border-white/10" : "border-white/10 hover:border-white/30"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {feedback && (
        <div className={`text-center font-heading text-lg ${feedback === "correct" ? "text-neon-green" : "text-neon-red"}`}>
          {feedback === "correct" ? "Correct! +10 🎉" : "Wrong! ❌"}
        </div>
      )}
    </GameWrapper>
  );
}
