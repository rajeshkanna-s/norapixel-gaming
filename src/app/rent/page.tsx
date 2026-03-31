"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import NeonButton from "@/components/ui/NeonButton";
import InView from "@/components/ui/InView";
import { ArrowRight } from "lucide-react";

const rentalGames = [
  { id: 1, title: "GTA V", platform: "PC / PS5", price: "₹80/day", status: "available" as const, image: "🎮", genre: "Action / Open World" },
  { id: 2, title: "God of War Ragnarök", platform: "PS5", price: "₹100/day", status: "available" as const, image: "⚔️", genre: "Action / Adventure" },
  { id: 3, title: "Spider-Man 2", platform: "PS5", price: "₹90/day", status: "coming-soon" as const, image: "🕷️", genre: "Action / Adventure" },
  { id: 4, title: "FIFA 25", platform: "PC / PS5 / Xbox", price: "₹70/day", status: "available" as const, image: "⚽", genre: "Sports" },
  { id: 5, title: "Elden Ring", platform: "PC / PS5", price: "₹90/day", status: "available" as const, image: "🗡️", genre: "RPG / Action" },
  { id: 6, title: "Call of Duty: MW III", platform: "PC / PS5 / Xbox", price: "₹80/day", status: "coming-soon" as const, image: "🔫", genre: "FPS / Shooter" },
  { id: 7, title: "Hogwarts Legacy", platform: "PC / PS5", price: "₹85/day", status: "available" as const, image: "🧙", genre: "RPG / Adventure" },
  { id: 8, title: "Cyberpunk 2077", platform: "PC / PS5", price: "₹75/day", status: "available" as const, image: "🤖", genre: "RPG / Open World" },
];

export default function RentPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16 relative z-10">
      <SectionHeader icon="🕹️" title="GAME RENTALS" subtitle="Rent premium games at affordable prices • Play more, pay less" />

      {/* Coming Soon Banner */}
      <InView animation="scale">
        <div className="mb-8 md:mb-10 text-center">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-neon-yellow/30 bg-neon-yellow/5 animate-border-glow" style={{ animationDuration: "2s" }}>
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-neon-yellow"></span>
            </span>
            <span className="font-heading text-[10px] md:text-sm text-neon-yellow tracking-wider">🚀 LAUNCHING SOON — Full rental service coming!</span>
          </div>
        </div>
      </InView>

      {/* How It Works */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        {[
          { icon: "📋", title: "1. CHOOSE", desc: "Pick a game from our collection" },
          { icon: "💬", title: "2. CONTACT", desc: "DM us on Instagram to book" },
          { icon: "🎮", title: "3. PLAY", desc: "Get the game & start playing!" },
        ].map((step, i) => (
          <InView key={step.title} animation="fade-up" delay={i * 100}>
            <div className="neon-card p-3 md:p-6 text-center animate-shimmer">
              <div className="text-2xl md:text-4xl mb-2 md:mb-3">{step.icon}</div>
              <h3 className="font-heading text-neon-cyan text-[9px] md:text-sm mb-1 md:mb-2 tracking-wider">{step.title}</h3>
              <p className="text-text-secondary font-body text-[10px] md:text-sm hidden sm:block">{step.desc}</p>
            </div>
          </InView>
        ))}
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
        {rentalGames.map((game, i) => (
          <InView key={game.id} animation="fade-up" delay={i * 60}>
            <div className="neon-card p-3 md:p-5 relative overflow-hidden group hover:border-neon-cyan/40">
              <div className="absolute top-2 md:top-3 right-2 md:right-3">
                {game.status === "available" ? (
                  <span className="badge-available text-[8px] md:text-[10px]">AVAILABLE</span>
                ) : (
                  <span className="badge-coming-soon text-[8px] md:text-[10px]">SOON</span>
                )}
              </div>

              <div className="text-3xl md:text-5xl mb-2 md:mb-4 mt-1 md:mt-2 group-hover:scale-110 transition-transform">{game.image}</div>
              <h3 className="font-heading text-[10px] md:text-sm text-text-primary mb-0.5 md:mb-1 leading-tight">{game.title}</h3>
              <p className="text-text-muted text-[9px] md:text-xs font-mono mb-0.5 md:mb-1 hidden sm:block">{game.genre}</p>
              <p className="text-text-secondary text-[9px] md:text-xs font-body mb-2 md:mb-3">{game.platform}</p>

              <div className="flex items-center justify-between">
                <span className="font-mono text-neon-cyan font-bold text-xs md:text-sm">{game.price}</span>
                {game.status === "available" ? (
                  <a href="https://www.instagram.com/norapixel_gaming?igsh=MXh5M2Fnc2w5eDBuZQ%3D%3D" target="_blank" rel="noopener noreferrer" className="arrow-slide flex items-center gap-1 text-[8px] md:text-[10px] font-heading tracking-wider text-neon-purple hover:text-neon-cyan transition-colors">
                    RENT <ArrowRight className="w-3 h-3 arrow-icon" />
                  </a>
                ) : (
                  <span className="text-[8px] md:text-[10px] font-heading tracking-wider text-text-muted">NOTIFY ME</span>
                )}
              </div>
            </div>
          </InView>
        ))}
      </div>

      {/* CTA */}
      <InView animation="scale">
        <div className="text-center neon-card p-5 md:p-8 animate-shimmer">
          <Image src="/logo.png" alt="NoraPixel" width={60} height={60} className="rounded-full mx-auto mb-3 w-12 h-12 md:w-[60px] md:h-[60px]" style={{ boxShadow: "var(--glow-cyan)" }} />
          <h3 className="font-heading text-sm md:text-xl text-neon-cyan mb-2 tracking-wider">WANT TO RENT A GAME?</h3>
          <p className="text-text-secondary font-body mb-4 md:mb-6 max-w-md mx-auto text-xs md:text-base">
            DM us on Instagram to check availability, pricing, and delivery options.
          </p>
          <a href="https://www.instagram.com/norapixel_gaming?igsh=MXh5M2Fnc2w5eDBuZQ%3D%3D" target="_blank" rel="noopener noreferrer">
            <NeonButton variant="cyan" size="md" className="arrow-slide inline-flex items-center gap-2">
              📩 DM ON INSTAGRAM <ArrowRight className="w-4 h-4 arrow-icon" />
            </NeonButton>
          </a>
        </div>
      </InView>
    </div>
  );
}
