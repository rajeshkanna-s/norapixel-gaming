"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const wordList = ["VALORANT","MINECRAFT","FORTNITE","CONTROLLER","HEADSHOT","KEYBOARD","CHAMPION","STREAMER","GAMEPLAY","JOYSTICK","RESPAWN","GRENADES","TUTORIAL","CONSOLE","GRAPHICS","DOWNLOAD","STRATEGY","SURVIVAL","TREASURE","OBSTACLE","CAMPAIGN","ULTIMATE","HARDCORE","TUTORIAL","MISSIONS","CRAFTING","WARRIORS","ASSASSIN","BATTLING","PLATFORM"];

const hangmanParts = [
  // Head
  <circle key="head" cx="200" cy="90" r="20" stroke="#00F5FF" strokeWidth="3" fill="none" />,
  // Body
  <line key="body" x1="200" y1="110" x2="200" y2="170" stroke="#00F5FF" strokeWidth="3" />,
  // Left arm
  <line key="larm" x1="200" y1="130" x2="170" y2="155" stroke="#00F5FF" strokeWidth="3" />,
  // Right arm
  <line key="rarm" x1="200" y1="130" x2="230" y2="155" stroke="#00F5FF" strokeWidth="3" />,
  // Left leg
  <line key="lleg" x1="200" y1="170" x2="175" y2="205" stroke="#00F5FF" strokeWidth="3" />,
  // Right leg
  <line key="rleg" x1="200" y1="170" x2="225" y2="205" stroke="#00F5FF" strokeWidth="3" />,
];

export default function Hangman() {
  const [word] = useState(() => wordList[Math.floor(Math.random() * wordList.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const stored = getGameScore("hangman");
  const MAX_WRONG = 6;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const display = word.split("").map(l => guessed.has(l) ? l : "_");
  const won = display.every(l => l !== "_");
  const lost = wrong >= MAX_WRONG;
  const gameOver = won || lost;

  const handleGuess = (letter: string) => {
    if (gameOver || guessed.has(letter)) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);
    if (!word.includes(letter)) {
      setWrong(w => w + 1);
      if (wrong + 1 >= MAX_WRONG) saveGameScore("hangman", 0);
    } else {
      const newDisplay = word.split("").map(l => newGuessed.has(l) ? l : "_");
      if (newDisplay.every(l => l !== "_")) {
        saveGameScore("hangman", (MAX_WRONG - wrong) * 100);
      }
    }
  };

  const restart = () => { window.location.reload(); };

  return (
    <GameWrapper title="Hangman" difficulty="medium" score={won ? (MAX_WRONG - wrong) * 100 : 0}
      highScore={stored.highScore} isGameOver={lost} onRestart={restart}
      controls="Click letters to guess"
      isNewHighScore={won && (MAX_WRONG - wrong) * 100 > stored.highScore}>

      {/* Hangman SVG */}
      <div className="flex justify-center mb-4">
        <svg width="300" height="220" className="opacity-80">
          {/* Gallows */}
          <line x1="60" y1="210" x2="260" y2="210" stroke="#4A5568" strokeWidth="3" />
          <line x1="100" y1="210" x2="100" y2="30" stroke="#4A5568" strokeWidth="3" />
          <line x1="100" y1="30" x2="200" y2="30" stroke="#4A5568" strokeWidth="3" />
          <line x1="200" y1="30" x2="200" y2="70" stroke="#4A5568" strokeWidth="3" />
          {/* Body parts */}
          {hangmanParts.slice(0, wrong)}
        </svg>
      </div>

      {/* Word display */}
      <div className="flex justify-center gap-2 mb-6">
        {display.map((l, i) => (
          <motion.span key={i} animate={l !== "_" ? { scale: [1.2, 1] } : {}}
            className={`w-8 h-10 border-b-2 flex items-center justify-center font-heading text-xl ${
              l !== "_" ? "border-neon-cyan text-neon-cyan" : "border-text-muted"
            }`}>{l}</motion.span>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-wrap justify-center gap-1 max-w-md mx-auto">
        {letters.map(l => (
          <button key={l} onClick={() => handleGuess(l)} disabled={guessed.has(l) || gameOver}
            className={`w-9 h-9 rounded text-sm font-heading cursor-pointer transition-all ${
              guessed.has(l) && word.includes(l) ? "bg-neon-green/20 text-neon-green border border-neon-green/50" :
              guessed.has(l) ? "bg-neon-red/10 text-neon-red/50 border border-white/5" :
              "bg-bg-surface border border-white/10 text-text-primary hover:border-neon-cyan/50"
            } disabled:cursor-not-allowed`}>{l}</button>
        ))}
      </div>

      {won && (
        <div className="text-center mt-4">
          <div className="text-neon-green font-heading text-lg">🎉 You Won!</div>
          <button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button>
        </div>
      )}
      {lost && !won && (
        <div className="text-center mt-4 text-neon-red font-body">
          The word was: <span className="font-heading">{word}</span>
        </div>
      )}
    </GameWrapper>
  );
}
