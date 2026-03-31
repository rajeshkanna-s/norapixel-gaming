"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion, AnimatePresence } from "framer-motion";

const choices = [
  { name: "rock", emoji: "✊", beats: "scissors" },
  { name: "paper", emoji: "✋", beats: "rock" },
  { name: "scissors", emoji: "✌️", beats: "paper" },
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<{p: string; a: string; r: string}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const stored = getGameScore("rock-paper-scissors");

  const play = (choice: string) => {
    if (isAnimating || gameOver) return;
    setIsAnimating(true);
    setPlayerChoice(choice);
    
    setTimeout(() => {
      const ai = choices[Math.floor(Math.random() * 3)];
      setAiChoice(ai.name);
      const player = choices.find(c => c.name === choice)!;
      let r: string;
      if (player.beats === ai.name) { r = "win"; setPlayerScore(s => s + 1); }
      else if (ai.beats === choice) { r = "lose"; setAiScore(s => s + 1); }
      else { r = "draw"; }
      setResult(r);
      setHistory(h => [...h, { p: choice, a: ai.name, r }]);
      const newRound = round + 1;
      setRound(newRound);
      setIsAnimating(false);
      if (newRound >= 5) {
        setGameOver(true);
        const finalScore = r === "win" ? playerScore + 1 : playerScore;
        saveGameScore("rock-paper-scissors", finalScore);
      }
    }, 800);
  };

  const restart = () => {
    setPlayerChoice(null); setAiChoice(null); setResult(null);
    setPlayerScore(0); setAiScore(0); setRound(0);
    setHistory([]); setGameOver(false);
  };

  return (
    <GameWrapper title="Rock Paper Scissors" difficulty="easy" score={playerScore}
      highScore={stored.highScore} isGameOver={gameOver} onRestart={restart}
      controls="Click Rock, Paper, or Scissors"
      isNewHighScore={gameOver && playerScore > stored.highScore}>
      
      <div className="text-center font-mono text-sm text-text-muted mb-4">
        Round {Math.min(round + 1, 5)} / 5
      </div>

      {/* Score */}
      <div className="flex justify-center items-center gap-8 mb-6">
        <div className="text-center">
          <div className="font-mono text-2xl text-neon-cyan">{playerScore}</div>
          <div className="text-xs text-text-muted">YOU</div>
        </div>
        <div className="font-heading text-lg text-text-muted">VS</div>
        <div className="text-center">
          <div className="font-mono text-2xl text-neon-pink">{aiScore}</div>
          <div className="text-xs text-text-muted">AI</div>
        </div>
      </div>

      {/* Battle display */}
      {(playerChoice || aiChoice) && (
        <div className="flex justify-center items-center gap-8 mb-6">
          <motion.div animate={isAnimating ? { y: [0,-10,0] } : {}} transition={{ duration: 0.2, repeat: isAnimating ? Infinity : 0 }}
            className="text-5xl">{choices.find(c => c.name === playerChoice)?.emoji || "❓"}</motion.div>
          <div className={`font-heading text-lg px-3 py-1 rounded ${result === "win" ? "text-neon-green" : result === "lose" ? "text-neon-red" : result === "draw" ? "text-neon-yellow" : "text-text-muted"}`}>
            {isAnimating ? "..." : result === "win" ? "WIN!" : result === "lose" ? "LOSE!" : result === "draw" ? "DRAW!" : "VS"}
          </div>
          <motion.div animate={isAnimating ? { y: [0,-10,0] } : {}} transition={{ duration: 0.2, repeat: isAnimating ? Infinity : 0 }}
            className="text-5xl">{isAnimating ? "❓" : choices.find(c => c.name === aiChoice)?.emoji || "❓"}</motion.div>
        </div>
      )}

      {/* Choices */}
      <div className="flex justify-center gap-4 mb-6">
        {choices.map(c => (
          <motion.button key={c.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => play(c.name)} disabled={isAnimating || gameOver}
            className="w-20 h-20 rounded-xl border-2 border-white/10 bg-bg-surface text-3xl flex items-center justify-center hover:border-neon-cyan/50 transition-all cursor-pointer disabled:opacity-50">
            {c.emoji}
          </motion.button>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="max-w-xs mx-auto space-y-1">
          {history.map((h, i) => (
            <div key={i} className={`flex justify-between text-xs font-mono px-3 py-1 rounded ${
              h.r === "win" ? "bg-neon-green/10 text-neon-green" : h.r === "lose" ? "bg-neon-red/10 text-neon-red" : "bg-neon-yellow/10 text-neon-yellow"
            }`}>
              <span>R{i+1}</span>
              <span>{choices.find(c=>c.name===h.p)?.emoji} vs {choices.find(c=>c.name===h.a)?.emoji}</span>
              <span>{h.r.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </GameWrapper>
  );
}
