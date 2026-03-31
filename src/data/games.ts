export interface GameMeta {
  slug: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string[];
  color: string;
  controls: string;
  bestFor: string;
  icon: string;
}

export const allGames: GameMeta[] = [
  // ── FEATURED ──
  {
    slug: "neon-space-defender",
    name: "Neon Space Defender",
    description: "Defend the galaxy in this action-packed space shooter. Destroy enemy waves, collect power-ups, and fight epic bosses!",
    difficulty: "hard",
    category: ["action", "arcade", "featured"],
    color: "#00F5FF",
    controls: "Mouse to aim, hold click to fire. Mobile: touch & drag",
    bestFor: "Intense space combat",
    icon: "🚀"
  },
  // ── EASY GAMES ──
  {
    slug: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic 3x3 grid. Beat the AI. X marks the spot.",
    difficulty: "easy",
    category: ["classic", "puzzle"],
    color: "#00F5FF",
    controls: "Click any empty cell to place your mark",
    bestFor: "Quick 1-min rounds",
    icon: "⭕"
  },
  {
    slug: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    description: "Choose your weapon. Best of 5 rounds.",
    difficulty: "easy",
    category: ["classic", "quick"],
    color: "#BF00FF",
    controls: "Click Rock, Paper, or Scissors",
    bestFor: "Instant play",
    icon: "✊"
  },
  {
    slug: "coin-flip",
    name: "Coin Flip",
    description: "Call it in the air! Heads or Tails?",
    difficulty: "easy",
    category: ["quick", "luck"],
    color: "#FFE400",
    controls: "Click Heads or Tails before the flip",
    bestFor: "Quick decision maker",
    icon: "🪙"
  },
  {
    slug: "dice-roller",
    name: "Dice Roller",
    description: "Guess the number before the dice rolls!",
    difficulty: "easy",
    category: ["quick", "luck"],
    color: "#FF6B00",
    controls: "Pick a number 1-6, then click Roll",
    bestFor: "Luck-based fun",
    icon: "🎲"
  },
  {
    slug: "color-guess",
    name: "Color Guessing",
    description: "Match the RGB code to the right color.",
    difficulty: "easy",
    category: ["puzzle", "knowledge"],
    color: "#FF006E",
    controls: "Click the color that matches the RGB code shown",
    bestFor: "Design nerds",
    icon: "🎨"
  },
  {
    slug: "number-guess",
    name: "Number Guessing",
    description: "I'm thinking of a number between 1-100...",
    difficulty: "easy",
    category: ["classic", "puzzle"],
    color: "#39FF14",
    controls: "Enter a number, get Higher/Lower hints",
    bestFor: "Brain warm-up",
    icon: "🔢"
  },
  {
    slug: "memory-match",
    name: "Emoji Memory Match",
    description: "Flip cards, find matching emoji pairs. Test your memory!",
    difficulty: "easy",
    category: ["puzzle", "memory"],
    color: "#00F5FF",
    controls: "Click cards to flip. Match all pairs with minimum flips",
    bestFor: "Memory training",
    icon: "🃏"
  },

  // ── MEDIUM GAMES ──
  {
    slug: "snake",
    name: "Snake",
    description: "Classic Nokia snake. Eat, grow, don't hit yourself!",
    difficulty: "medium",
    category: ["classic", "action"],
    color: "#39FF14",
    controls: "Arrow keys or WASD to move. Mobile: swipe",
    bestFor: "Nostalgic fun",
    icon: "🐍"
  },
  {
    slug: "whack-a-mole",
    name: "Whack-a-Mole",
    description: "Moles pop up. Smash them. 30 seconds. GO!",
    difficulty: "medium",
    category: ["action", "reflex"],
    color: "#FF6B00",
    controls: "Click/tap moles as fast as they appear",
    bestFor: "Reflex training",
    icon: "🔨"
  },
  {
    slug: "typing-test",
    name: "Typing Speed Test",
    description: "How fast can you type? Get your WPM score.",
    difficulty: "medium",
    category: ["skill", "knowledge"],
    color: "#BF00FF",
    controls: "Type the words shown as fast as possible",
    bestFor: "Productivity flex",
    icon: "⌨️"
  },
  {
    slug: "quiz",
    name: "Gaming Quiz",
    description: "Test your gaming knowledge. 20 questions. No googling!",
    difficulty: "medium",
    category: ["knowledge", "trivia"],
    color: "#FFE400",
    controls: "Click the correct answer before time runs out",
    bestFor: "Gaming trivia buffs",
    icon: "❓"
  },
  {
    slug: "simon-says",
    name: "Simon Says",
    description: "Remember the pattern. Repeat it. How far can you go?",
    difficulty: "medium",
    category: ["memory", "puzzle"],
    color: "#FF006E",
    controls: "Watch the color sequence, then click them in order",
    bestFor: "Memory champions",
    icon: "🔴"
  },
  {
    slug: "hangman",
    name: "Hangman",
    description: "Guess the word letter by letter. 6 wrong = game over.",
    difficulty: "medium",
    category: ["classic", "word"],
    color: "#00F5FF",
    controls: "Click letters to guess. Gaming-themed words!",
    bestFor: "Word game lovers",
    icon: "💀"
  },
  {
    slug: "reaction-test",
    name: "Reaction Time",
    description: "Wait for green... CLICK! How fast are your reflexes?",
    difficulty: "medium",
    category: ["reflex", "quick"],
    color: "#39FF14",
    controls: "Wait for screen to turn green, then click ASAP",
    bestFor: "FPS gamers",
    icon: "⚡"
  },

  // ── HARD GAMES ──
  {
    slug: "game-2048",
    name: "2048",
    description: "Slide tiles. Merge numbers. Reach 2048!",
    difficulty: "hard",
    category: ["puzzle", "strategy"],
    color: "#FF6B00",
    controls: "Arrow keys to slide. Merge same numbers",
    bestFor: "Puzzle addicts",
    icon: "🧮"
  },
  {
    slug: "minesweeper",
    name: "Minesweeper",
    description: "Clear the field. Don't hit a mine. Classic Windows.",
    difficulty: "hard",
    category: ["classic", "puzzle", "strategy"],
    color: "#FF0040",
    controls: "Click to reveal. Right-click to flag mines",
    bestFor: "Strategic thinkers",
    icon: "💣"
  },
  {
    slug: "sudoku",
    name: "Sudoku",
    description: "Fill the 9x9 grid. No repeats in row/col/box.",
    difficulty: "hard",
    category: ["puzzle", "strategy"],
    color: "#BF00FF",
    controls: "Click cell, type number 1-9",
    bestFor: "Number crunchers",
    icon: "9️⃣"
  },
  {
    slug: "wordle",
    name: "Wordle",
    description: "Guess the 5-letter word in 6 tries. Green = correct!",
    difficulty: "hard",
    category: ["word", "puzzle"],
    color: "#39FF14",
    controls: "Type a 5-letter word + Enter. Colors show hints",
    bestFor: "Daily brain teaser",
    icon: "📝"
  },
  {
    slug: "flappy-bird",
    name: "Flappy Bird",
    description: "Tap to fly. Avoid pipes. Don't rage quit.",
    difficulty: "hard",
    category: ["action", "arcade"],
    color: "#FFE400",
    controls: "Click/tap/spacebar to flap",
    bestFor: "Rage-inducing fun",
    icon: "🐦"
  },
  {
    slug: "breakout",
    name: "Brick Breaker",
    description: "Paddle. Ball. Destroy all the bricks.",
    difficulty: "hard",
    category: ["classic", "arcade", "action"],
    color: "#FF006E",
    controls: "Mouse/touch to move paddle",
    bestFor: "Arcade nostalgia",
    icon: "🧱"
  },
  {
    slug: "tetris",
    name: "Tetris",
    description: "Falling blocks. Clear rows. Don't stack to the top.",
    difficulty: "hard",
    category: ["classic", "puzzle", "arcade"],
    color: "#00F5FF",
    controls: "← → Move, ↑ Rotate, ↓ Soft drop, Space Hard drop",
    bestFor: "The OG puzzle game",
    icon: "🟦"
  },
  {
    slug: "connect-four",
    name: "Connect Four",
    description: "Drop discs. Connect 4 in a row. Beat the AI.",
    difficulty: "hard",
    category: ["classic", "strategy"],
    color: "#FF0040",
    controls: "Click a column to drop your disc",
    bestFor: "Strategic battles",
    icon: "🔴"
  },
  {
    slug: "pacman",
    name: "Pac-Man",
    description: "Eat dots. Avoid ghosts. Grab power pellets!",
    difficulty: "hard",
    category: ["classic", "arcade", "action"],
    color: "#FFE400",
    controls: "Arrow keys to move. Eat all dots to win",
    bestFor: "Retro gaming legends",
    icon: "👾"
  },
  {
    slug: "chess",
    name: "Chess",
    description: "The ultimate strategy game. Checkmate the AI.",
    difficulty: "hard",
    category: ["strategy", "classic"],
    color: "#BF00FF",
    controls: "Click piece to select, click destination to move",
    bestFor: "Big brain energy",
    icon: "♟️"
  },
  {
    slug: "blackjack",
    name: "Blackjack",
    description: "Hit or Stand? Get closest to 21 without busting.",
    difficulty: "hard",
    category: ["card", "luck", "strategy"],
    color: "#39FF14",
    controls: "Click Hit or Stand",
    bestFor: "Card sharks",
    icon: "🃏"
  },
  {
    slug: "space-invaders",
    name: "Space Invaders",
    description: "Shoot down alien waves before they reach you.",
    difficulty: "hard",
    category: ["arcade", "action"],
    color: "#00F5FF",
    controls: "← → to move, Space to shoot",
    bestFor: "Retro shooter fans",
    icon: "👽"
  },
  {
    slug: "platformer-runner",
    name: "Dino Runner",
    description: "Endless runner. Jump over obstacles. How far can you go?",
    difficulty: "hard",
    category: ["action", "arcade"],
    color: "#FF6B00",
    controls: "Space/tap to jump",
    bestFor: "When Chrome is offline 😄",
    icon: "🦕"
  },
];

export const gameCategories = [
  "all", "featured", "classic", "puzzle", "action", "arcade", "strategy",
  "memory", "word", "quick", "luck", "reflex", "knowledge",
  "skill", "trivia", "card"
];
