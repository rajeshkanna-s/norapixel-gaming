"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { shuffleArray } from "@/lib/gameUtils";

const wordBank = ["gaming","stream","clutch","headshot","victory","respawn","combo","critical","damage","shield","power","level","quest","dragon","sword","armor","potion","magic","keyboard","mouse","monitor","controller","console","champion","warrior","hunter","mage","rogue","tank","bossfight","speedrun","noob","pro","nerf","buff","cooldown","ultimate","ranked","casual","esports","trophy","lobby","server","pixel","score","bonus","health","attack","defend","craft","build","sniper","grenade","reload","scope","elite","legend"];

export default function TypingTest() {
  const [words] = useState(() => shuffleArray(wordBank).slice(0, 50));
  const [input, setInput] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [complete, setComplete] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const stored = getGameScore("typing-test");

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setActive(false); setComplete(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [active]);

  useEffect(() => {
    if (complete) {
      const elapsed = startTime ? (Date.now() - startTime) / 60000 : 1;
      const wpm = Math.round(correct / elapsed);
      saveGameScore("typing-test", wpm);
    }
  }, [complete, correct, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!active && !complete) { setActive(true); setStartTime(Date.now()); }
    if (val.endsWith(" ")) {
      const typed = val.trim();
      if (typed === words[wordIdx]) { setCorrect(c => c + 1); }
      else { setErrors(er => er + 1); }
      setWordIdx(w => w + 1);
      setInput("");
    } else {
      setInput(val);
    }
  };

  const elapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
  const wpm = elapsed > 0 ? Math.round(correct / elapsed) : 0;
  const accuracy = correct + errors > 0 ? Math.round((correct / (correct + errors)) * 100) : 100;
  const rank = wpm >= 100 ? "Machine 🤖" : wpm >= 70 ? "Pro ⚡" : wpm >= 50 ? "Fast 🏃" : wpm >= 30 ? "Average 👍" : "Beginner 🐢";

  const restart = () => { setInput(""); setWordIdx(0); setStartTime(null); setTimeLeft(30); setActive(false); setComplete(false); setCorrect(0); setErrors(0); };

  return (
    <GameWrapper title="Typing Speed Test" difficulty="medium" score={wpm} highScore={stored.highScore}
      isGameOver={complete} onRestart={restart} timer={timeLeft}
      controls="Type the words shown as fast as possible" isNewHighScore={complete && wpm > stored.highScore}>

      {/* Words display */}
      <div className="bg-bg-surface rounded-lg p-4 mb-4 max-h-32 overflow-y-auto font-mono text-sm leading-relaxed">
        {words.map((word, i) => (
          <span key={i} className={`mr-2 ${
            i < wordIdx ? "text-neon-green" :
            i === wordIdx ? "text-neon-cyan bg-neon-cyan/10 px-1 rounded" :
            "text-text-muted"
          }`}>{word}</span>
        ))}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={input}
        onChange={handleInput}
        disabled={complete}
        autoFocus
        className="w-full bg-bg-surface border-2 border-neon-cyan/30 rounded-lg px-4 py-3 font-mono text-lg text-text-primary focus:border-neon-cyan focus:outline-none disabled:opacity-50"
        placeholder={complete ? "Time's up!" : "Start typing..."}
      />

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div><div className="font-mono text-2xl text-neon-cyan">{wpm}</div><div className="text-xs text-text-muted">WPM</div></div>
        <div><div className="font-mono text-2xl text-neon-green">{accuracy}%</div><div className="text-xs text-text-muted">Accuracy</div></div>
        <div><div className="font-mono text-2xl text-neon-yellow">{correct}</div><div className="text-xs text-text-muted">Words</div></div>
      </div>

      {complete && (
        <div className="text-center mt-4">
          <div className="font-heading text-lg text-neon-purple mb-1">{rank}</div>
          <div className="text-text-muted text-sm font-body">{wpm} WPM • {accuracy}% accuracy • {errors} errors</div>
        </div>
      )}
    </GameWrapper>
  );
}
