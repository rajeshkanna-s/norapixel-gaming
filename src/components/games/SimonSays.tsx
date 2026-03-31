"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const COLORS = [
  { name: "red", bg: "#FF0040", light: "#FF004060" },
  { name: "blue", bg: "#0066FF", light: "#0066FF60" },
  { name: "green", bg: "#39FF14", light: "#39FF1460" },
  { name: "yellow", bg: "#FFE400", light: "#FFE40060" },
];

export default function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showingSeq, setShowingSeq] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(0);
  const stored = getGameScore("simon-says");

  const playSequence = useCallback(async (seq: number[]) => {
    setShowingSeq(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setActiveIdx(seq[i]);
      await new Promise(r => setTimeout(r, 500));
      setActiveIdx(null);
    }
    await new Promise(r => setTimeout(r, 200));
    setShowingSeq(false);
  }, []);

  const startGame = useCallback(async () => {
    setGameOver(false);
    setRound(0);
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setPlayerSeq([]);
    setPlaying(true);
    await playSequence(first);
  }, [playSequence]);

  const handleClick = useCallback(async (idx: number) => {
    if (showingSeq || gameOver || !playing) return;
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 200);

    const newPlayerSeq = [...playerSeq, idx];
    setPlayerSeq(newPlayerSeq);

    // Check if wrong
    if (idx !== sequence[newPlayerSeq.length - 1]) {
      setGameOver(true);
      setPlaying(false);
      saveGameScore("simon-says", round);
      return;
    }

    // Check if complete
    if (newPlayerSeq.length === sequence.length) {
      const newRound = round + 1;
      setRound(newRound);
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next);
      setPlayerSeq([]);
      await new Promise(r => setTimeout(r, 500));
      await playSequence(next);
    }
  }, [showingSeq, gameOver, playing, playerSeq, sequence, round, playSequence]);

  return (
    <GameWrapper title="Simon Says" difficulty="medium" score={round} highScore={stored.highScore}
      isGameOver={gameOver} onRestart={startGame} controls="Watch the sequence, then repeat it"
      isNewHighScore={gameOver && round > stored.highScore}>

      <div className="text-center mb-4 font-mono text-sm text-text-muted">Round: {round}</div>

      {!playing && !gameOver && (
        <div className="text-center mb-4">
          <button onClick={startGame} className="neon-btn cursor-pointer">START</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-w-[250px] mx-auto">
        {COLORS.map((color, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(i)}
            className="aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: activeIdx === i ? color.bg : color.light,
              borderColor: activeIdx === i ? color.bg : "rgba(255,255,255,0.1)",
              boxShadow: activeIdx === i ? `0 0 30px ${color.bg}` : "none",
            }}
          />
        ))}
      </div>

      {showingSeq && <div className="text-center mt-4 text-neon-yellow font-heading text-sm">WATCH...</div>}
      {playing && !showingSeq && <div className="text-center mt-4 text-neon-green font-heading text-sm">YOUR TURN!</div>}
    </GameWrapper>
  );
}
