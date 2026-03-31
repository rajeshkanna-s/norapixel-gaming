"use client";
import { useState, useEffect } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { shuffleArray } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const questions = [
  { q: "What game popularized the Battle Royale genre?", o: ["Fortnite","PUBG","Apex Legends","H1Z1"], a: 1 },
  { q: "What is the highest rank in Valorant?", o: ["Immortal","Radiant","Diamond","Challenger"], a: 1 },
  { q: "In Minecraft, how many obsidian for a Nether Portal?", o: ["8","10","12","14"], a: 1 },
  { q: "Which company developed GTA V?", o: ["EA Games","Ubisoft","Rockstar Games","Activision"], a: 2 },
  { q: "What year was the first PlayStation released?", o: ["1992","1994","1996","1998"], a: 1 },
  { q: "In Among Us, max number of impostors?", o: ["1","2","3","4"], a: 2 },
  { q: "Which Valorant agent can revive teammates?", o: ["Sage","Phoenix","Reyna","Skye"], a: 0 },
  { q: "What does 'GG' stand for?", o: ["Get Good","Good Game","Go Go","Great Gaming"], a: 1 },
  { q: "How many squares on a chess board?", o: ["32","48","64","81"], a: 2 },
  { q: "In Tetris, the long piece is called?", o: ["I-piece","L-piece","T-piece","S-piece"], a: 0 },
  { q: "What is Mario's brother's name?", o: ["Wario","Luigi","Toad","Yoshi"], a: 1 },
  { q: "Which game has Master Chief?", o: ["Gears of War","Doom","Halo","Destiny"], a: 2 },
  { q: "Best-selling video game of all time?", o: ["GTA V","Minecraft","Tetris","Wii Sports"], a: 1 },
  { q: "In PUBG, what does the blue zone do?", o: ["Heals","Damages","Spawns loot","Reveals enemies"], a: 1 },
  { q: "How many letters in a Wordle guess?", o: ["4","5","6","7"], a: 1 },
  { q: "What game features the character Link?", o: ["Final Fantasy","Zelda","Metroid","Fire Emblem"], a: 1 },
  { q: "Which console has the Joy-Con controllers?", o: ["PS5","Xbox","Nintendo Switch","Steam Deck"], a: 2 },
  { q: "In Fortnite, what's the rarest rarity?", o: ["Epic","Legendary","Mythic","Exotic"], a: 2 },
  { q: "What is the main currency in League of Legends?", o: ["Gold","Blue Essence","RP","Coins"], a: 1 },
  { q: "Which is NOT a CS:GO/CS2 map?", o: ["Dust2","Mirage","Summit","Inferno"], a: 2 },
];

export default function Quiz() {
  const [gameQs] = useState(() => shuffleArray(questions).slice(0, 15));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(15);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const stored = getGameScore("quiz");

  useEffect(() => {
    if (done || answered) return;
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [idx, done, answered]);

  const handleTimeout = () => { setAnswered(true); setResults(r => [...r, false]); autoAdvance(); };

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === gameQs[idx].a;
    if (correct) setScore(s => s + 10);
    setResults(r => [...r, correct]);
    autoAdvance();
  };

  const autoAdvance = () => {
    setTimeout(() => {
      if (idx >= gameQs.length - 1) {
        setDone(true);
        saveGameScore("quiz", score);
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
        setTimer(15);
      }
    }, 1500);
  };

  const restart = () => { window.location.reload(); };

  const q = gameQs[idx];

  return (
    <GameWrapper title="Gaming Quiz" difficulty="medium" score={score} highScore={stored.highScore}
      isGameOver={done} onRestart={restart} timer={timer}
      controls="Click the correct answer"
      isNewHighScore={done && score > stored.highScore}>

      {!done && q && (
        <>
          <div className="text-center mb-2 text-xs font-mono text-text-muted">
            Question {idx + 1} / {gameQs.length}
          </div>

          <div className="bg-bg-surface rounded-lg p-4 mb-4 text-center">
            <h3 className="font-body text-lg text-text-primary">{q.q}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {q.o.map((opt, i) => (
              <motion.button key={i} whileHover={!answered ? { scale: 1.02 } : undefined}
                onClick={() => handleAnswer(i)} disabled={answered}
                className={`p-3 rounded-lg border-2 text-left font-body text-sm cursor-pointer transition-all ${
                  answered && i === q.a ? "border-neon-green bg-neon-green/10 text-neon-green" :
                  answered && i === selected && i !== q.a ? "border-neon-red bg-neon-red/10 text-neon-red" :
                  !answered ? "border-white/10 hover:border-neon-cyan/50 text-text-primary" :
                  "border-white/5 text-text-muted"
                }`}>
                <span className="font-mono text-xs mr-2">{["A","B","C","D"][i]}</span> {opt}
              </motion.button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-4">
            {results.map((r, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${r ? "bg-neon-green" : "bg-neon-red"}`} />
            ))}
          </div>
        </>
      )}
    </GameWrapper>
  );
}
