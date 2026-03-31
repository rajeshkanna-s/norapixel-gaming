"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

export default function NumberGuess() {
  const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const maxAttempts = 7;
  const stored = getGameScore("number-guess");

  const handleGuess = () => {
    const num = parseInt(input);
    if (isNaN(num) || num < 1 || num > 100) return;
    setInput("");
    const newGuesses = [...guesses, num];
    setGuesses(newGuesses);
    if (num === target) {
      setFeedback("correct");
      setWon(true);
      setGameOver(true);
      const score = (maxAttempts - newGuesses.length + 1) * 100;
      saveGameScore("number-guess", Math.max(score, stored.highScore));
    } else if (newGuesses.length >= maxAttempts) {
      setFeedback(num > target ? "lower" : "higher");
      setGameOver(true);
      saveGameScore("number-guess", 0);
    } else {
      setFeedback(num > target ? "lower" : "higher");
    }
  };

  const restart = () => { window.location.reload(); };

  const distance = guesses.length > 0 ? Math.abs(guesses[guesses.length - 1] - target) : 100;
  const heatColor = distance < 5 ? "#FF0040" : distance < 15 ? "#FF6B00" : distance < 30 ? "#FFE400" : distance < 50 ? "#00F5FF" : "#4A5568";

  return (
    <GameWrapper title="Number Guessing" difficulty="easy" score={won ? (maxAttempts - guesses.length + 1) * 100 : 0}
      highScore={stored.highScore} isGameOver={gameOver && !won} onRestart={restart}
      controls="Enter a number 1-100, get Higher/Lower hints" isNewHighScore={won && (maxAttempts - guesses.length + 1) * 100 > stored.highScore}>

      <div className="text-center mb-4">
        <div className="font-heading text-lg text-text-secondary mb-2">I&apos;m thinking of a number 1-100...</div>
        <div className="font-mono text-sm text-text-muted">
          Attempt {guesses.length + 1} / {maxAttempts}
        </div>
      </div>

      {/* Temperature bar */}
      <div className="max-w-xs mx-auto mb-4 h-3 rounded-full overflow-hidden bg-bg-surface">
        <motion.div className="h-full rounded-full" animate={{ width: `${Math.max(5, 100 - distance)}%`, backgroundColor: heatColor }}
          transition={{ duration: 0.5 }} />
      </div>
      <div className="text-center text-xs font-mono mb-4" style={{ color: heatColor }}>
        {distance < 5 ? "🔥 SCORCHING!" : distance < 15 ? "🌡️ Very Hot" : distance < 30 ? "☀️ Warm" : distance < 50 ? "❄️ Cold" : "🧊 Freezing"}
      </div>

      {/* Input */}
      {!gameOver && (
        <div className="flex justify-center gap-2 mb-4">
          <input type="number" min={1} max={100} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGuess()}
            className="w-24 bg-bg-surface border border-white/10 rounded px-3 py-2 text-center font-mono text-text-primary focus:border-neon-cyan focus:outline-none"
            placeholder="1-100" />
          <button onClick={handleGuess} className="neon-btn text-xs cursor-pointer">Guess</button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`text-center font-heading text-xl mb-4 ${
          feedback === "correct" ? "text-neon-green" : feedback === "higher" ? "text-neon-cyan" : "text-neon-orange"
        }`}>
          {feedback === "correct" ? "🎉 CORRECT!" : feedback === "higher" ? "⬆️ Higher!" : "⬇️ Lower!"}
        </motion.div>
      )}

      {gameOver && !won && (
        <div className="text-center">
          <div className="text-neon-red font-heading mb-2">The number was {target}!</div>
          <button onClick={restart} className="neon-btn text-xs cursor-pointer">Try Again</button>
        </div>
      )}
      {won && (
        <div className="text-center">
          <div className="text-neon-green font-heading text-lg mb-2">🎉 You got it in {guesses.length} tries!</div>
          <button onClick={restart} className="neon-btn text-xs cursor-pointer">Play Again</button>
        </div>
      )}

      {/* Guess history */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {guesses.map((g, i) => (
          <span key={i} className={`px-2 py-1 rounded text-xs font-mono ${
            g === target ? "bg-neon-green/20 text-neon-green" : g > target ? "bg-neon-orange/10 text-neon-orange" : "bg-neon-cyan/10 text-neon-cyan"
          }`}>{g}{g > target ? "↓" : g < target ? "↑" : "✓"}</span>
        ))}
      </div>
    </GameWrapper>
  );
}
