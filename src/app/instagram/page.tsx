"use client";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCounter from "@/components/ui/StatCounter";
import { socialLinks } from "@/data/socialLinks";

const instagramPosts = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  caption: [
    "New setup reveal 🎮", "Tournament day!", "Late night grind sessions 🌙",
    "When the aim hits different 🎯", "Unboxing new gear!", "GG WP! 🏆",
    "Stream highlights reel", "Behind the scenes 📸", "PC build progress",
    "Fan meetup was insane!", "New merch drop soon 👀", "Gaming room glow up ✨",
  ][i],
  gradient: [
    "from-purple-600 to-pink-500", "from-blue-600 to-cyan-400", "from-orange-500 to-red-500",
    "from-green-500 to-teal-400", "from-pink-500 to-yellow-400", "from-indigo-500 to-purple-500",
    "from-red-500 to-orange-400", "from-cyan-400 to-blue-500", "from-yellow-400 to-orange-500",
    "from-teal-400 to-green-500", "from-purple-500 to-indigo-500", "from-pink-400 to-rose-500",
  ][i],
  emoji: ["🎮", "🏆", "🌙", "🎯", "📦", "💪", "🎬", "📸", "🖥️", "🤝", "👕", "✨"][i],
}));

export default function InstagramPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16">
      <SectionHeader icon="📸" title="GRAM HIGHLIGHTS" subtitle="Behind the scenes and gaming moments" />

      {/* Instagram Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-3 mb-10 md:mb-16">
        {instagramPosts.map((post, i) => (
          <a
            key={post.id}
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative aspect-square rounded-md md:rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
              <span className="text-3xl md:text-5xl">{post.emoji}</span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-center px-1">
                <div className="text-lg md:text-2xl mb-1">📸</div>
                <p className="text-white text-[8px] md:text-xs font-body">{post.caption}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        <StatCounter value={450} label="Posts" />
        <StatCounter value={85000} label="Followers" suffix="+" />
        <StatCounter value={320} label="Following" />
      </div>

      {/* Follow CTA */}
      <div className="text-center">
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 md:px-8 py-2.5 md:py-3 font-heading text-[10px] md:text-sm uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105"
          style={{
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            color: "white",
          }}
        >
          Follow on Instagram →
        </a>
      </div>
    </div>
  );
}
