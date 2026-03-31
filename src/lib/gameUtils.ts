export interface GameScoreData {
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
  lastPlayed: string;
}

const STORAGE_KEY = "norapixel-game-scores";

export function getGameScores(): Record<string, GameScoreData> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getGameScore(slug: string): GameScoreData {
  const scores = getGameScores();
  return scores[slug] || { highScore: 0, gamesPlayed: 0, totalScore: 0, lastPlayed: "" };
}

export function saveGameScore(slug: string, score: number): boolean {
  const scores = getGameScores();
  const existing = scores[slug] || { highScore: 0, gamesPlayed: 0, totalScore: 0, lastPlayed: "" };
  const isNewHigh = score > existing.highScore;

  scores[slug] = {
    highScore: Math.max(existing.highScore, score),
    gamesPlayed: existing.gamesPlayed + 1,
    totalScore: existing.totalScore + score,
    lastPlayed: new Date().toISOString().split("T")[0],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch { /* storage full */ }

  return isNewHigh;
}

export function getTotalStats() {
  const scores = getGameScores();
  const entries = Object.values(scores);
  return {
    totalGamesPlayed: entries.reduce((a, b) => a + b.gamesPlayed, 0),
    totalScore: entries.reduce((a, b) => a + b.totalScore, 0),
    gamesMastered: entries.filter((s) => s.highScore > 500).length,
  };
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
