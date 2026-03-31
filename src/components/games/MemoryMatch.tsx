"use client";
import { useState, useEffect, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";
import { shuffleArray } from "@/lib/gameUtils";

const emojiPool = ["🎮","🎯","🎲","🎪","🎨","🎬","🏆","⚡","🔥","💎","🎵","🌟","🚀","💣","👾","🤖"];

interface Card { id: number; emoji: string; isFlipped: boolean; isMatched: boolean; }

function createCards(pairs: number): Card[] {
  const selected = shuffleArray(emojiPool).slice(0, pairs);
  const cards = [...selected, ...selected].map((emoji, i) => ({ id: i, emoji, isFlipped: false, isMatched: false }));
  return shuffleArray(cards);
}

export default function MemoryMatch() {
  const [pairs, setPairs] = useState(6);
  const [cards, setCards] = useState<Card[]>(() => createCards(6));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const stored = getGameScore("memory-match");

  useEffect(() => {
    if (!started || complete) return;
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [started, complete]);

  const handleFlip = useCallback((idx: number) => {
    if (flipped.length >= 2 || cards[idx].isFlipped || cards[idx].isMatched || complete) return;
    if (!started) setStarted(true);
    
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        newCards[a].isMatched = true;
        newCards[b].isMatched = true;
        setCards([...newCards]);
        setFlipped([]);
        const newMatches = matches + 1;
        setMatches(newMatches);
        if (newMatches === pairs) {
          setComplete(true);
          const score = pairs * 100 - moves * 5 - timer * 2;
          saveGameScore("memory-match", Math.max(score, stored.highScore));
        }
      } else {
        setTimeout(() => {
          newCards[a].isFlipped = false;
          newCards[b].isFlipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, 800);
      }
    }
  }, [cards, flipped, complete, matches, pairs, moves, timer, started, stored.highScore]);

  const restart = (p?: number) => {
    const newPairs = p || pairs;
    setPairs(newPairs);
    setCards(createCards(newPairs));
    setFlipped([]); setMoves(0); setMatches(0); setTimer(0); setStarted(false); setComplete(false);
  };

  const cols = pairs <= 6 ? 4 : pairs <= 8 ? 4 : 6;

  return (
    <GameWrapper title="Emoji Memory Match" difficulty="easy" score={complete ? pairs * 100 - moves * 5 - timer * 2 : 0}
      highScore={stored.highScore} isGameOver={false} onRestart={() => restart()} timer={timer}
      controls="Click cards to flip. Match all pairs with minimum flips">

      <div className="flex justify-center gap-2 mb-4">
        {[6,8,12].map(p => (
          <button key={p} onClick={() => restart(p)}
            className={`px-3 py-1 text-xs font-heading rounded border cursor-pointer ${
              pairs === p ? "border-neon-cyan text-neon-cyan" : "border-white/10 text-text-muted"
            }`}>{p} Pairs</button>
        ))}
      </div>

      <div className="text-center text-sm font-mono text-text-muted mb-3">
        Moves: {moves} | Matches: {matches}/{pairs}
      </div>

      <div className={`grid gap-2 max-w-md mx-auto`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((card, i) => (
          <motion.button key={card.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(i)}
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 border ${
              card.isMatched ? "border-neon-green bg-neon-green/10" :
              card.isFlipped ? "border-neon-cyan bg-bg-surface" :
              "border-white/10 bg-bg-card hover:border-neon-cyan/30"
            }`}>
            {card.isFlipped || card.isMatched ? card.emoji : "❓"}
          </motion.button>
        ))}
      </div>

      {complete && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mt-4">
          <div className="text-neon-green font-heading text-xl mb-2">🎉 All Matched!</div>
          <div className="text-text-muted text-sm font-mono">{moves} moves • {timer}s</div>
          <button onClick={() => restart()} className="neon-btn text-xs mt-2 cursor-pointer">Play Again</button>
        </motion.div>
      )}
    </GameWrapper>
  );
}
