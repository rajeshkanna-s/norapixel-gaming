"use client";
import { useState, useCallback } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

const suits = ["♠","♥","♦","♣"];
const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function createDeck() {
  const deck: { suit: string; rank: string; value: number }[] = [];
  for (const suit of suits) for (const rank of ranks) {
    let value = parseInt(rank);
    if (isNaN(value)) value = rank === "A" ? 11 : 10;
    deck.push({ suit, rank, value });
  }
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}

function handValue(hand: { suit: string; rank: string; value: number }[]): number {
  let total = hand.reduce((s, c) => s + c.value, 0);
  let aces = hand.filter(c => c.rank === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

type GameState = "betting" | "playing" | "dealer" | "done";

export default function Blackjack() {
  const [deck, setDeck] = useState(() => createDeck());
  const [playerHand, setPlayerHand] = useState<typeof deck>([]);
  const [dealerHand, setDealerHand] = useState<typeof deck>([]);
  const [state, setState] = useState<GameState>("betting");
  const [bet, setBet] = useState(10);
  const [chips, setChips] = useState(100);
  const [result, setResult] = useState<string>("");
  const stored = getGameScore("blackjack");

  const deal = useCallback(() => {
    const d = createDeck();
    const ph = [d.pop()!, d.pop()!];
    const dh = [d.pop()!, d.pop()!];
    setDeck(d);
    setPlayerHand(ph);
    setDealerHand(dh);
    setState("playing");
    setResult("");
    if (handValue(ph) === 21) {
      // Blackjack
      setChips(c => c + bet * 2);
      setResult("BLACKJACK! 🃏");
      setState("done");
      saveGameScore("blackjack", chips + bet * 2);
    }
  }, [bet, chips]);

  const hit = () => {
    const d = [...deck];
    const card = d.pop()!;
    const newHand = [...playerHand, card];
    setDeck(d);
    setPlayerHand(newHand);
    if (handValue(newHand) > 21) {
      setChips(c => c - bet);
      setResult("BUST! 💥");
      setState("done");
      saveGameScore("blackjack", Math.max(0, chips - bet));
    }
  };

  const stand = () => {
    setState("dealer");
    let d = [...deck];
    let dh = [...dealerHand];
    while (handValue(dh) < 17) { dh.push(d.pop()!); }
    setDeck(d);
    setDealerHand(dh);
    const pv = handValue(playerHand), dv = handValue(dh);
    if (dv > 21 || pv > dv) {
      setChips(c => c + bet);
      setResult("You Win! 🎉");
      saveGameScore("blackjack", chips + bet);
    } else if (pv < dv) {
      setChips(c => c - bet);
      setResult("Dealer Wins 😞");
      saveGameScore("blackjack", Math.max(0, chips - bet));
    } else {
      setResult("Push 🤝");
    }
    setState("done");
  };

  const restart = () => { setState("betting"); setResult(""); };
  const fullRestart = () => { setChips(100); restart(); };

  const isRed = (suit: string) => suit === "♥" || suit === "♦";

  return (
    <GameWrapper title="Blackjack" difficulty="hard" score={chips} highScore={stored.highScore}
      isGameOver={chips <= 0} onRestart={fullRestart} controls="Hit or Stand. Get closer to 21 than the dealer"
      isNewHighScore={chips > stored.highScore}>

      <div className="text-center font-mono text-sm text-neon-yellow mb-4">💰 Chips: {chips}</div>

      {state === "betting" && (
        <div className="text-center">
          <div className="mb-4 font-body text-text-secondary">Place your bet:</div>
          <div className="flex justify-center gap-2 mb-4">
            {[5,10,25,50].map(b => (
              <button key={b} onClick={() => setBet(b)} disabled={b > chips}
                className={`px-4 py-2 rounded font-heading text-sm cursor-pointer border ${
                  bet === b ? "border-neon-yellow bg-neon-yellow/20 text-neon-yellow" : "border-white/10 text-text-muted"
                } disabled:opacity-30`}>{b}</button>
            ))}
          </div>
          <button onClick={deal} className="neon-btn cursor-pointer">DEAL</button>
        </div>
      )}

      {state !== "betting" && (
        <>
          {/* Dealer */}
          <div className="mb-4">
            <div className="text-xs text-text-muted font-mono mb-1 text-center">
              Dealer {state !== "playing" && `(${handValue(dealerHand)})`}
            </div>
            <div className="flex gap-2 justify-center">
              {dealerHand.map((card, i) => (
                <motion.div key={i} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className={`w-14 h-20 rounded-lg border-2 flex flex-col items-center justify-center font-heading ${
                    i === 1 && state === "playing" ? "bg-bg-surface border-white/20" :
                    "bg-white border-white/30"
                  }`}>
                  {i === 1 && state === "playing" ? (
                    <span className="text-2xl">🂠</span>
                  ) : (
                    <>
                      <span className="text-xs" style={{ color: isRed(card.suit) ? "#FF0040" : "#1a1a2e" }}>{card.rank}</span>
                      <span className="text-lg" style={{ color: isRed(card.suit) ? "#FF0040" : "#1a1a2e" }}>{card.suit}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Player */}
          <div className="mb-4">
            <div className="text-xs text-text-muted font-mono mb-1 text-center">You ({handValue(playerHand)})</div>
            <div className="flex gap-2 justify-center">
              {playerHand.map((card, i) => (
                <motion.div key={i} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-14 h-20 rounded-lg border-2 bg-white border-neon-cyan/30 flex flex-col items-center justify-center font-heading">
                  <span className="text-xs" style={{ color: isRed(card.suit) ? "#FF0040" : "#1a1a2e" }}>{card.rank}</span>
                  <span className="text-lg" style={{ color: isRed(card.suit) ? "#FF0040" : "#1a1a2e" }}>{card.suit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {state === "playing" && (
            <div className="flex justify-center gap-3">
              <button onClick={hit} className="px-6 py-2 rounded border-2 border-neon-green bg-neon-green/10 text-neon-green font-heading text-sm cursor-pointer hover:bg-neon-green/20 transition-all">HIT</button>
              <button onClick={stand} className="px-6 py-2 rounded border-2 border-neon-red bg-neon-red/10 text-neon-red font-heading text-sm cursor-pointer hover:bg-neon-red/20 transition-all">STAND</button>
            </div>
          )}

          {result && (
            <div className="text-center mt-4">
              <div className={`font-heading text-lg ${result.includes("Win") || result.includes("BLACKJACK") ? "text-neon-green" : result.includes("Dealer") || result.includes("BUST") ? "text-neon-red" : "text-neon-yellow"}`}>
                {result}
              </div>
              <button onClick={restart} className="neon-btn text-xs mt-2 cursor-pointer">Next Hand</button>
            </div>
          )}
        </>
      )}
    </GameWrapper>
  );
}
