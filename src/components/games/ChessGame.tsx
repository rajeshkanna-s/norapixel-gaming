"use client";
import { useState } from "react";
import GameWrapper from "./GameWrapper";
import { saveGameScore, getGameScore } from "@/lib/gameUtils";
import { motion } from "framer-motion";

// Simplified chess - pieces on 8x8 board with basic movement
type PieceType = "K"|"Q"|"R"|"B"|"N"|"P"|null;
type PieceColor = "w"|"b"|null;
type Square = { type: PieceType; color: PieceColor };

const INITIAL: Square[][] = [
  [{type:"R",color:"b"},{type:"N",color:"b"},{type:"B",color:"b"},{type:"Q",color:"b"},{type:"K",color:"b"},{type:"B",color:"b"},{type:"N",color:"b"},{type:"R",color:"b"}],
  Array(8).fill(null).map(() => ({type:"P" as PieceType,color:"b" as PieceColor})),
  ...Array(4).fill(null).map(() => Array(8).fill(null).map(() => ({type:null as PieceType,color:null as PieceColor}))),
  Array(8).fill(null).map(() => ({type:"P" as PieceType,color:"w" as PieceColor})),
  [{type:"R",color:"w"},{type:"N",color:"w"},{type:"B",color:"w"},{type:"Q",color:"w"},{type:"K",color:"w"},{type:"B",color:"w"},{type:"N",color:"w"},{type:"R",color:"w"}],
];

const pieceIcons: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

function isValidMove(board: Square[][], from: [number,number], to: [number,number], player: "w"|"b"): boolean {
  const [fr, fc] = from; const [tr, tc] = to;
  const piece = board[fr][fc];
  if (!piece.type || piece.color !== player) return false;
  if (board[tr][tc].color === player) return false; // can't capture own pieces
  const dr = tr - fr, dc = tc - fc;
  const adr = Math.abs(dr), adc = Math.abs(dc);
  switch (piece.type) {
    case "P": {
      const dir = player === "w" ? -1 : 1;
      if (dc === 0 && dr === dir && !board[tr][tc].type) return true;
      if (dc === 0 && dr === dir * 2 && fr === (player === "w" ? 6 : 1) && !board[fr+dir][fc].type && !board[tr][tc].type) return true;
      if (adc === 1 && dr === dir && board[tr][tc].type && board[tr][tc].color !== player) return true;
      return false;
    }
    case "R": return (dr === 0 || dc === 0) && pathClear(board, from, to);
    case "B": return adr === adc && pathClear(board, from, to);
    case "Q": return (dr === 0 || dc === 0 || adr === adc) && pathClear(board, from, to);
    case "N": return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
    case "K": return adr <= 1 && adc <= 1;
    default: return false;
  }
}

function pathClear(board: Square[][], from: [number,number], to: [number,number]): boolean {
  const [fr,fc] = from; const [tr,tc] = to;
  const dr = Math.sign(tr-fr), dc = Math.sign(tc-fc);
  let r = fr + dr, c = fc + dc;
  while (r !== tr || c !== tc) { if (board[r][c].type) return false; r += dr; c += dc; }
  return true;
}

export default function ChessGame() {
  const [board, setBoard] = useState<Square[][]>(() => INITIAL.map(r => r.map(s => ({...s}))));
  const [selected, setSelected] = useState<[number,number] | null>(null);
  const [turn, setTurn] = useState<"w"|"b">("w");
  const [captured, setCaptured] = useState<{w: string[], b: string[]}>({w: [], b: []});
  const [message, setMessage] = useState<string>("");
  const stored = getGameScore("chess");

  const handleClick = (r: number, c: number) => {
    if (selected) {
      const [sr, sc] = selected;
      if (isValidMove(board, [sr, sc], [r, c], turn)) {
        const b = board.map(row => row.map(s => ({...s})));
        const cap = b[r][c];
        if (cap.type) {
          const newCap = {...captured};
          newCap[turn] = [...newCap[turn], pieceIcons[`${cap.color}${cap.type}`]];
          setCaptured(newCap);
          if (cap.type === "K") {
            setMessage(turn === "w" ? "White Wins! 🎉" : "Black Wins!");
            saveGameScore("chess", turn === "w" ? 1000 : 0);
          }
        }
        b[r][c] = b[sr][sc];
        b[sr][sc] = {type: null, color: null};
        // Pawn promotion
        if (b[r][c].type === "P" && (r === 0 || r === 7)) b[r][c].type = "Q";
        setBoard(b);
        setTurn(turn === "w" ? "b" : "w");
        setSelected(null);
        // Simple AI for black
        if (turn === "w") {
          setTimeout(() => aiMove(b), 300);
        }
      } else {
        setSelected(board[r][c].color === turn ? [r, c] : null);
      }
    } else {
      if (board[r][c].color === turn) setSelected([r, c]);
    }
  };

  const aiMove = (b: Square[][]) => {
    const moves: { from: [number,number]; to: [number,number]; score: number }[] = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      if (b[r][c].color !== "b") continue;
      for (let tr = 0; tr < 8; tr++) for (let tc = 0; tc < 8; tc++) {
        if (isValidMove(b, [r,c], [tr,tc], "b")) {
          let score = Math.random();
          if (b[tr][tc].type) score += 10;
          moves.push({ from: [r,c], to: [tr,tc], score });
        }
      }
    }
    if (moves.length === 0) return;
    moves.sort((a,b) => b.score - a.score);
    const m = moves[0];
    const nb = b.map(row => row.map(s => ({...s})));
    const cap = nb[m.to[0]][m.to[1]];
    if (cap.type) {
      setCaptured(prev => ({...prev, b: [...prev.b, pieceIcons[`${cap.color}${cap.type}`]]}));
      if (cap.type === "K") { setMessage("Black Wins!"); saveGameScore("chess", 0); }
    }
    nb[m.to[0]][m.to[1]] = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = {type: null, color: null};
    if (nb[m.to[0]][m.to[1]].type === "P" && m.to[0] === 7) nb[m.to[0]][m.to[1]].type = "Q";
    setBoard(nb);
    setTurn("w");
  };

  const restart = () => {
    setBoard(INITIAL.map(r => r.map(s => ({...s}))));
    setSelected(null); setTurn("w"); setCaptured({w:[],b:[]}); setMessage("");
  };

  return (
    <GameWrapper title="Chess" difficulty="hard" score={0} highScore={stored.highScore}
      isGameOver={false} onRestart={restart} controls="Click piece to select, then click destination">

      {message && <div className="text-center mb-2 font-heading text-neon-green">{message}</div>}
      <div className="text-center text-sm font-body text-text-muted mb-2">
        {turn === "w" ? "⬜ White" : "⬛ Black"}&apos;s turn
      </div>

      <div className="flex justify-center gap-4">
        <div className="text-sm">{captured.w.join(" ")}</div>
        <div className="grid grid-cols-8 gap-0 border border-white/10 rounded overflow-hidden">
          {board.map((row, r) => row.map((sq, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isDark = (r + c) % 2 === 1;
            return (
              <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
                className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-xl md:text-2xl cursor-pointer transition-all ${
                  isSelected ? "bg-neon-cyan/30 ring-2 ring-neon-cyan" :
                  isDark ? "bg-gray-700/50" : "bg-gray-500/30"
                }`}
                style={{ color: sq.color === "w" ? "#FFFFFF" : sq.color === "b" ? "#1a1a2e" : undefined,
                  textShadow: sq.color === "b" ? "0 0 2px rgba(255,255,255,0.8)" : "none" }}>
                {sq.type ? pieceIcons[`${sq.color}${sq.type}`] : ""}
              </button>
            );
          }))}
        </div>
        <div className="text-sm">{captured.b.join(" ")}</div>
      </div>
    </GameWrapper>
  );
}
