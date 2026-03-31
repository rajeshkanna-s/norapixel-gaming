"use client";
import { useState, useEffect } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const WORDS = ["PIXEL","GAMER","QUEST","SWORD","FLAME","TOWER","CURSE","GUILD","ARENA","SPAWN","BLAZE","SHARD","ROGUE","MAGIC","LUMEN","NEXUS","DWARF","REIGN","CHAOS","VALOR","SIEGE","FORGE","PRISM","TITAN","CLASH"];

type LetterState = "correct" | "present" | "absent" | "empty";

export default function Wordle() {
  const [target] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const stored = getGameScore("wordle");

  const getLetterState = (guess: string, pos: number): LetterState => {
    if (guess[pos] === target[pos]) return "correct";
    if (target.includes(guess[pos])) return "present";
    return "absent";
  };

  const getKeyState = (letter: string): LetterState => {
    for (const g of guesses) {
      for (let i = 0; i < 5; i++) {
        if (g[i] === letter && g[i] === target[i]) return "correct";
      }
    }
    for (const g of guesses) {
      for (let i = 0; i < 5; i++) {
        if (g[i] === letter && target.includes(letter)) return "present";
      }
    }
    for (const g of guesses) {
      if (g.includes(letter)) return "absent";
    }
    return "empty";
  };

  const stateColors: Record<LetterState, string> = {
    correct: "bg-neon-green/80 border-neon-green text-bg-primary",
    present: "bg-neon-yellow/80 border-neon-yellow text-bg-primary",
    absent: "bg-bg-surface border-white/10 text-text-muted",
    empty: "border-white/10",
  };

  const submit = () => {
    if (current.length !== 5) { setShake(true); setTimeout(() => setShake(false), 300); return; }
    const guess = current.toUpperCase();
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setCurrent("");
    if (guess === target) { setWon(true); setGameOver(true); saveGameScore("wordle", (7 - newGuesses.length) * 100); }
    else if (newGuesses.length >= 6) { setGameOver(true); saveGameScore("wordle", 0); }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") setCurrent(c => c.slice(0, -1));
      else if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) setCurrent(c => c + e.key.toUpperCase());
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleKeyClick = (key: string) => {
    if (gameOver) return;
    if (key === "ENTER") submit();
    else if (key === "⌫") setCurrent(c => c.slice(0, -1));
    else if (current.length < 5) setCurrent(c => c + key);
  };

  const restart = () => { window.location.reload(); };

  return (
    <GameWrapper title="Wordle" difficulty="hard" score={won ? (7 - guesses.length) * 100 : 0}
      highScore={stored.highScore} isGameOver={gameOver && !won} onRestart={restart}
      controls="Type a 5-letter word and press Enter" isNewHighScore={won && (7 - guesses.length) * 100 > stored.highScore}>

      {/* Grid */}
      <div className="flex flex-col items-center gap-1 mb-6">
        {Array.from({ length: 6 }, (_, row) => {
          const guess = guesses[row];
          const isCurrent = row === guesses.length;
          return (
            <motion.div key={row} animate={isCurrent && shake ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="flex gap-1">
              {Array.from({ length: 5 }, (_, col) => {
                const letter = guess ? guess[col] : isCurrent ? current[col] || "" : "";
                const state = guess ? getLetterState(guess, col) : "empty";
                return (
                  <div key={col} className={`w-12 h-12 border-2 rounded flex items-center justify-center font-heading text-xl font-bold ${stateColors[state]}`}>
                    {letter}
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Keyboard */}
      {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1 mb-1">
          {ri === 2 && <button onClick={() => handleKeyClick("ENTER")}
            className="px-3 h-10 rounded bg-neon-cyan/20 text-neon-cyan text-xs font-heading border border-neon-cyan/30 cursor-pointer">ENTER</button>}
          {row.split("").map(k => {
            const st = getKeyState(k);
            return (
              <button key={k} onClick={() => handleKeyClick(k)}
                className={`w-8 h-10 rounded font-heading text-sm cursor-pointer border ${stateColors[st]}`}>{k}</button>
            );
          })}
          {ri === 2 && <button onClick={() => handleKeyClick("⌫")}
            className="px-3 h-10 rounded bg-bg-surface text-text-muted text-xs font-heading border border-white/10 cursor-pointer">⌫</button>}
        </div>
      ))}

      {gameOver && !won && <div className="text-center mt-4 text-neon-red font-heading">The word was: {target}</div>}
      {won && (
        <div className="text-center mt-4">
          <div className="text-neon-green font-heading text-lg">🎉 Solved in {guesses.length}!</div>
          <button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button>
        </div>
      )}
    </GameWrapper>
  );
}
