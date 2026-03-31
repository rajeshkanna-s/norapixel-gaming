"use client";
import { useState, useRef, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

type Phase = "waiting" | "ready" | "go" | "result" | "too-soon" | "done";

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const goTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stored = getGameScore("reaction-test");

  const startRound = () => {
    setPhase("ready");
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setPhase("go");
    }, delay);
  };

  const handleClick = () => {
    if (phase === "waiting") { startRound(); return; }
    if (phase === "ready") {
      clearTimeout(timerRef.current);
      setPhase("too-soon");
      return;
    }
    if (phase === "go") {
      const time = Math.round(performance.now() - goTimeRef.current);
      setCurrentTime(time);
      const newTimes = [...times, time];
      setTimes(newTimes);
      if (newTimes.length >= 5) {
        setPhase("done");
        const avg = Math.round(newTimes.reduce((a,b) => a+b, 0) / newTimes.length);
        const best = Math.min(...newTimes);
        saveGameScore("reaction-test", Math.max(1000 - best, 0));
      } else {
        setPhase("result");
      }
      return;
    }
    if (phase === "result" || phase === "too-soon") { startRound(); }
  };

  const restart = () => { setPhase("waiting"); setTimes([]); setCurrentTime(0); };

  const avg = times.length > 0 ? Math.round(times.reduce((a,b) => a+b, 0) / times.length) : 0;
  const best = times.length > 0 ? Math.min(...times) : 0;
  const rank = (ms: number) => ms < 200 ? "Amazing ⚡" : ms < 300 ? "Fast 🏃" : ms < 500 ? "Average 👍" : "Slow 🐢";

  return (
    <GameWrapper title="Reaction Time" difficulty="medium" score={best > 0 ? Math.max(1000 - best, 0) : 0}
      highScore={stored.highScore} isGameOver={phase === "done"} onRestart={restart}
      controls="Wait for green, then click ASAP" isNewHighScore={phase === "done" && Math.max(1000 - best, 0) > stored.highScore}>

      <motion.div onClick={handleClick} whileTap={{ scale: 0.98 }}
        className={`rounded-xl min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none ${
          phase === "waiting" ? "bg-bg-surface" :
          phase === "ready" ? "bg-red-900/50" :
          phase === "go" ? "bg-green-600/50" :
          phase === "too-soon" ? "bg-orange-900/50" :
          phase === "result" ? "bg-bg-surface" :
          "bg-bg-surface"
        }`}>
        {phase === "waiting" && (
          <><div className="text-4xl mb-2">⚡</div>
          <div className="font-heading text-xl text-text-primary">Click to Start</div>
          <div className="text-text-muted text-sm font-body">Best of 5 attempts</div></>
        )}
        {phase === "ready" && (
          <><div className="text-4xl mb-2">🔴</div>
          <div className="font-heading text-2xl text-neon-red">Wait...</div></>
        )}
        {phase === "go" && (
          <><div className="text-4xl mb-2">🟢</div>
          <div className="font-heading text-2xl text-neon-green">CLICK NOW!</div></>
        )}
        {phase === "too-soon" && (
          <><div className="text-4xl mb-2">😅</div>
          <div className="font-heading text-xl text-neon-orange">Too soon! Click to retry</div></>
        )}
        {phase === "result" && (
          <><div className="font-mono text-5xl text-neon-cyan mb-2">{currentTime}ms</div>
          <div className="font-heading text-sm text-text-secondary">{rank(currentTime)}</div>
          <div className="text-text-muted text-xs mt-2">Click for next attempt ({times.length}/5)</div></>
        )}
        {phase === "done" && (
          <div className="text-center">
            <div className="font-heading text-xl text-neon-cyan mb-2">Results</div>
            <div className="font-mono text-3xl text-neon-green mb-1">{avg}ms avg</div>
            <div className="font-mono text-lg text-neon-yellow">Best: {best}ms</div>
            <div className="font-heading text-sm text-neon-purple mt-2">{rank(avg)}</div>
            <div className="flex gap-2 justify-center mt-3">
              {times.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded text-xs font-mono bg-bg-surface text-text-secondary">
                  {t}ms
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </GameWrapper>
  );
}
