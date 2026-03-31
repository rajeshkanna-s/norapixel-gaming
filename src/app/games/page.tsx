"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import InView from "@/components/ui/InView";
import { allGames, gameCategories } from "@/data/games";
import { getGameScore, getTotalStats } from "@/lib/gameUtils";
import { Star, Trophy, Gamepad2, Zap, Search, Grid3X3, LayoutList } from "lucide-react";

const difficultyStars: Record<string, number> = { easy: 1, medium: 3, hard: 5 };
const difficultyColors: Record<string, string> = { easy: "text-neon-green", medium: "text-neon-yellow", hard: "text-neon-red" };
const difficultyBg: Record<string, string> = {
  easy: "bg-neon-green/10 border-neon-green/30 text-neon-green",
  medium: "bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow",
  hard: "bg-neon-red/10 border-neon-red/30 text-neon-red",
};

export default function GamesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [totalStats, setTotalStats] = useState({ totalGamesPlayed: 0, totalScore: 0, gamesMastered: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTotalStats(getTotalStats());
  }, []);

  const filtered = allGames.filter((g) => {
    const matchesFilter = filter === "all" ||
      (["easy", "medium", "hard"].includes(filter) ? g.difficulty === filter : g.category.includes(filter));
    const matchesSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16 relative z-10">
      <SectionHeader icon="🎮" title="GAME ZONE" subtitle="27 browser games. No downloads. Pick one and play." />

      {/* Stats Bar */}
      <InView animation="fade-up">
        <div className={`grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          {[
            { icon: Gamepad2, value: totalStats.totalGamesPlayed, label: "Games Played", color: "text-neon-cyan", glow: "shadow-[0_0_20px_rgba(0,245,255,0.1)]" },
            { icon: Zap, value: totalStats.totalScore.toLocaleString(), label: "Total Score", color: "text-neon-yellow", glow: "shadow-[0_0_20px_rgba(255,228,0,0.1)]" },
            { icon: Trophy, value: totalStats.gamesMastered, label: "Mastered", color: "text-neon-green", glow: "shadow-[0_0_20px_rgba(57,255,20,0.1)]" },
          ].map((stat) => (
            <div key={stat.label} className={`neon-card p-3 md:p-5 text-center ${stat.glow}`}>
              <stat.icon className={`w-5 h-5 md:w-7 md:h-7 ${stat.color} mx-auto mb-1.5`} />
              <div className={`font-mono text-xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] md:text-xs text-text-muted font-body mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </InView>

      {/* Search + Filter */}
      <InView animation="fade-up" delay={100}>
        <div className="mb-6 md:mb-8 space-y-3">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-bg-surface/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary font-body placeholder:text-text-muted/50 focus:border-neon-cyan/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,245,255,0.06)] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
            {["all", "classic", "puzzle", "action", "arcade", "strategy", "memory", "word", "quick", "luck", "reflex"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-heading uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  filter === cat
                    ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.2)]"
                    : "border-white/8 text-text-muted hover:border-neon-cyan/30 hover:text-text-secondary hover:bg-white/[0.02]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </InView>

      {/* Results count */}
      <div className="text-center mb-4">
        <span className="text-text-muted text-xs font-body">{filtered.length} game{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
        {filtered.map((game, i) => (
          <GameCard key={game.slug} game={game} index={i} mounted={mounted} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-text-muted font-body text-sm">No games match your search. Try different keywords.</p>
        </div>
      )}
    </div>
  );
}

function GameCard({ game, index, mounted }: { game: typeof allGames[0]; index: number; mounted: boolean }) {
  const [score, setScore] = useState({ highScore: 0, gamesPlayed: 0, totalScore: 0, lastPlayed: "" });

  useEffect(() => {
    setScore(getGameScore(game.slug));
  }, [game.slug]);

  return (
    <div
      className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      style={{ transitionDelay: `${Math.min(index * 40, 600)}ms` }}
    >
      <Link href={`/games/${game.slug}`} className="block h-full">
        <div className="neon-card h-full flex flex-col group cursor-pointer">
          {/* Game Icon Area — bigger, more vibrant */}
          <div
            className="h-28 md:h-40 flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${game.color}18, ${game.color}08, transparent)` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.04]"
              style={{ background: game.color }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-[0.03]"
              style={{ background: game.color }}
            />

            <span className="text-5xl md:text-7xl group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-lg">
              {game.icon}
            </span>

            {/* Difficulty badge */}
            <div className={`absolute top-2 right-2 text-[8px] md:text-[10px] font-heading uppercase px-2 py-0.5 rounded-full border ${difficultyBg[game.difficulty]}`}>
              {game.difficulty}
            </div>

            {/* High score badge */}
            {score.highScore > 0 && (
              <div className="absolute top-2 left-2 text-[8px] md:text-[10px] font-mono text-neon-yellow bg-neon-yellow/10 px-2 py-0.5 rounded-full border border-neon-yellow/20">
                🏆 {score.highScore}
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="p-3 md:p-4 flex-1 flex flex-col">
            <h3 className="font-heading text-[11px] md:text-sm font-bold text-text-primary mb-0.5 group-hover:text-neon-cyan transition-colors">
              {game.name}
            </h3>
            <p className="text-text-muted text-[9px] md:text-xs font-body mb-2 md:mb-3 flex-1 line-clamp-2 leading-relaxed">
              {game.description}
            </p>

            {/* Stars */}
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                      i < difficultyStars[game.difficulty]
                        ? difficultyColors[game.difficulty] + " fill-current"
                        : "text-white/10"
                    }`}
                  />
                ))}
              </div>
              <span
                className="text-[9px] md:text-[10px] font-heading uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: game.color }}
              >
                PLAY →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
