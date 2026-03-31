"use client";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import NeonCard from "@/components/ui/NeonCard";
import { setupData } from "@/data/setup";
import { Star } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < rating ? "text-neon-yellow fill-neon-yellow" : "text-text-muted"}`} />
      ))}
    </div>
  );
}

interface SetupItem {
  name: string;
  category: string;
  specs: string;
  price: string;
  rating: number;
  icon: string;
}

function SetupSection({ title, items, color, mounted }: { title: string; items: SetupItem[]; color: string; mounted: boolean }) {
  return (
    <div className="mb-8 md:mb-12">
      <h3 className="font-heading text-sm md:text-lg mb-4 md:mb-6 tracking-wider" style={{ color }}>{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {items.map((item, i) => (
          <div
            key={item.name}
            className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <NeonCard className="p-3 md:p-5 flex gap-3 md:gap-4 items-center">
              <div className="text-2xl md:text-3xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-[10px] md:text-sm font-bold text-text-primary truncate">{item.name}</h4>
                <p className="text-text-muted text-[9px] md:text-xs font-mono truncate">{item.category} • {item.specs}</p>
                <div className="flex items-center gap-2 md:gap-3 mt-1">
                  <Stars rating={item.rating} />
                  <span className="text-neon-green font-mono text-[9px] md:text-xs">{item.price}</span>
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SetupPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16">
      <SectionHeader icon="⚙️" title="MY SETUP" subtitle="The gear behind the grind" />

      <div className={`neon-card p-5 md:p-8 mb-8 md:mb-12 text-center bg-gradient-to-br from-bg-card to-bg-surface animate-shimmer transition-all duration-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">🖥️</div>
        <h3 className="font-heading text-sm md:text-xl text-neon-cyan mb-1 md:mb-2 animate-text-glow">The Battle Station</h3>
        <p className="text-text-secondary font-body text-xs md:text-base">RTX 4070 Ti • Ryzen 7 7800X3D • 32GB DDR5 • ROG Swift 165Hz</p>
      </div>

      <SetupSection title="🖥️ PC BUILD" items={setupData.pcBuild} color="#00F5FF" mounted={mounted} />
      <SetupSection title="🎮 PERIPHERALS" items={setupData.peripherals} color="#BF00FF" mounted={mounted} />
      <SetupSection title="🪑 FURNITURE" items={setupData.furniture} color="#FF6B00" mounted={mounted} />
    </div>
  );
}
