"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { allGames } from "@/data/games";
import GameLoader from "@/components/ui/GameLoader";

const L = () => <GameLoader text="LOADING GAME" />;

// Dynamic imports with loader
const TicTacToe = dynamic(() => import("@/components/games/TicTacToe"), { ssr: false, loading: L });
const RockPaperScissors = dynamic(() => import("@/components/games/RockPaperScissors"), { ssr: false, loading: L });
const CoinFlip = dynamic(() => import("@/components/games/CoinFlip"), { ssr: false, loading: L });
const DiceRoller = dynamic(() => import("@/components/games/DiceRoller"), { ssr: false, loading: L });
const ColorGuess = dynamic(() => import("@/components/games/ColorGuess"), { ssr: false, loading: L });
const NumberGuess = dynamic(() => import("@/components/games/NumberGuess"), { ssr: false, loading: L });
const MemoryMatch = dynamic(() => import("@/components/games/MemoryMatch"), { ssr: false, loading: L });
const Snake = dynamic(() => import("@/components/games/Snake"), { ssr: false, loading: L });
const WhackAMole = dynamic(() => import("@/components/games/WhackAMole"), { ssr: false, loading: L });
const TypingTest = dynamic(() => import("@/components/games/TypingTest"), { ssr: false, loading: L });
const Quiz = dynamic(() => import("@/components/games/Quiz"), { ssr: false, loading: L });
const SimonSays = dynamic(() => import("@/components/games/SimonSays"), { ssr: false, loading: L });
const Hangman = dynamic(() => import("@/components/games/Hangman"), { ssr: false, loading: L });
const ReactionTest = dynamic(() => import("@/components/games/ReactionTest"), { ssr: false, loading: L });
const Game2048 = dynamic(() => import("@/components/games/Game2048"), { ssr: false, loading: L });
const Minesweeper = dynamic(() => import("@/components/games/Minesweeper"), { ssr: false, loading: L });
const Sudoku = dynamic(() => import("@/components/games/Sudoku"), { ssr: false, loading: L });
const Wordle = dynamic(() => import("@/components/games/Wordle"), { ssr: false, loading: L });
const FlappyBird = dynamic(() => import("@/components/games/FlappyBird"), { ssr: false, loading: L });
const Breakout = dynamic(() => import("@/components/games/Breakout"), { ssr: false, loading: L });
const Tetris = dynamic(() => import("@/components/games/Tetris"), { ssr: false, loading: L });
const ConnectFour = dynamic(() => import("@/components/games/ConnectFour"), { ssr: false, loading: L });
const PacMan = dynamic(() => import("@/components/games/PacMan"), { ssr: false, loading: L });
const ChessGame = dynamic(() => import("@/components/games/ChessGame"), { ssr: false, loading: L });
const Blackjack = dynamic(() => import("@/components/games/Blackjack"), { ssr: false, loading: L });
const SpaceInvaders = dynamic(() => import("@/components/games/SpaceInvaders"), { ssr: false, loading: L });
const DinoRunner = dynamic(() => import("@/components/games/DinoRunner"), { ssr: false, loading: L });
const NeonSpaceDefender = dynamic(() => import("@/components/games/NeonSpaceDefender"), { ssr: false, loading: L });

const slugToComponent: Record<string, React.ComponentType> = {
  "tic-tac-toe": TicTacToe, "rock-paper-scissors": RockPaperScissors,
  "coin-flip": CoinFlip, "dice-roller": DiceRoller, "color-guess": ColorGuess,
  "number-guess": NumberGuess, "memory-match": MemoryMatch, "snake": Snake,
  "whack-a-mole": WhackAMole, "typing-test": TypingTest, "quiz": Quiz,
  "simon-says": SimonSays, "hangman": Hangman, "reaction-test": ReactionTest,
  "game-2048": Game2048, "minesweeper": Minesweeper, "sudoku": Sudoku,
  "wordle": Wordle, "flappy-bird": FlappyBird, "breakout": Breakout,
  "tetris": Tetris, "connect-four": ConnectFour, "pacman": PacMan,
  "chess": ChessGame, "blackjack": Blackjack, "space-invaders": SpaceInvaders,
  "platformer-runner": DinoRunner,
  "neon-space-defender": NeonSpaceDefender,
};

export default function GamePlayPage() {
  const params = useParams();
  const slug = params.slug as string;
  const game = allGames.find((g) => g.slug === slug);
  const GameComponent = slugToComponent[slug];
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="text-6xl mb-4 animate-float">🎮</div>
        <h1 className="font-heading text-2xl md:text-3xl text-neon-red mb-2">GAME NOT FOUND</h1>
        <p className="text-text-secondary font-body mb-6 text-sm">This game doesn&apos;t exist yet.</p>
        <Link href="/games" className="neon-btn">← Back to Games</Link>
      </div>
    );
  }

  return (
    <div className={`relative z-10 ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
      <GameComponent />
    </div>
  );
}
