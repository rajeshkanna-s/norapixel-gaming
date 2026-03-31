"use client";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCounter from "@/components/ui/StatCounter";
import Image from "next/image";
import { creatorStats, skills, gamesPlayed, bio } from "@/data/stats";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16">
      <SectionHeader icon="🎯" title="CHARACTER PROFILE" subtitle="Level up your knowledge about the player behind the screen" />

      <div className="grid lg:grid-cols-5 gap-6 md:gap-8 mb-12 md:mb-16">
        {/* Character Profile Card */}
        <div
          className={`lg:col-span-2 neon-card p-4 md:p-6 transition-all duration-600 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full border-3 border-neon-cyan overflow-hidden animate-float relative"
            style={{ boxShadow: "var(--glow-cyan)" }}
          >
            <Image
              src="/logo.png"
              alt="NoraPixel Gaming"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-heading text-lg md:text-2xl text-center text-neon-cyan font-bold mb-1 animate-text-glow">NORAPIXEL</h3>
          <p className="text-center text-text-secondary text-xs md:text-sm mb-4">
            Level {creatorStats.level} • {creatorStats.class}
          </p>

          {/* XP Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] md:text-xs text-text-muted mb-1">
              <span>XP</span>
              <span>{creatorStats.xp.toLocaleString()} / {creatorStats.xpMax.toLocaleString()}</span>
            </div>
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: mounted ? `${(creatorStats.xp / creatorStats.xpMax) * 100}%` : "0%" }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 text-xs md:text-sm font-body">
            {[
              ["CLASS", creatorStats.class],
              ["FACTION", creatorStats.faction],
              ["JOINED", creatorStats.joinYear.toString()],
              ["REGION", `${creatorStats.region} 🇮🇳`],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-text-muted font-mono text-[10px] md:text-xs">{key}</span>
                <span className="text-text-primary">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-3 space-y-6 md:space-y-8">
          {/* Backstory */}
          <div
            className={`neon-card p-4 md:p-6 transition-all duration-600 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h3 className="font-heading text-sm md:text-lg text-neon-purple mb-3 md:mb-4 tracking-wider flex items-center gap-2">
              <span className="text-lg md:text-xl">📜</span> BACKSTORY
            </h3>
            <div className="space-y-3 text-text-secondary font-body leading-relaxed text-sm md:text-base">
              {bio.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Skills Tree */}
          <div
            className={`neon-card p-4 md:p-6 transition-all duration-600 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="font-heading text-sm md:text-lg text-neon-green mb-3 md:mb-4 tracking-wider flex items-center gap-2">
              <span className="text-lg md:text-xl">🌲</span> SKILL TREE
            </h3>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="font-body text-text-primary">{skill.name}</span>
                    <span className="font-mono text-[10px] md:text-xs" style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                        width: mounted ? `${skill.level}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games Played */}
      <div className="mb-12 md:mb-16">
        <h3 className="font-heading text-base md:text-xl text-center text-neon-orange mb-4 md:mb-6 tracking-wider">🎯 GAMES PLAYED</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {gamesPlayed.map((game, i) => (
            <div
              key={game.name}
              className={`neon-card p-3 md:p-4 text-center transition-all duration-500 hover:animate-glow-pulse ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + i * 50}ms` }}
            >
              <div className="text-2xl md:text-3xl mb-2">{game.icon}</div>
              <div className="font-heading text-[10px] md:text-sm text-text-primary">{game.name}</div>
              <div className="font-mono text-[10px] md:text-xs text-text-muted">{game.hours}hrs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCounter value={creatorStats.subscribers} label="Subscribers" suffix="+" />
        <StatCounter value={creatorStats.videosMade} label="Videos Made" suffix="+" />
        <StatCounter value={creatorStats.totalViews} label="Total Views" suffix="+" />
        <StatCounter value={creatorStats.hoursStreamed} label="Hours Streamed" suffix="+" />
      </div>
    </div>
  );
}
