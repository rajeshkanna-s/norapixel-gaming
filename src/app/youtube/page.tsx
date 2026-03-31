"use client";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import NeonCard from "@/components/ui/NeonCard";

const videos = [
  { id: "OAyJxo4lKRM", title: "NoraPixel Gaming Video" },
  { id: "BqMNazC3QfA", title: "NoraPixel Gaming Video" },
  { id: "5Ol1hNs3OXk", title: "NoraPixel Gaming Video" },
];

export default function YouTubePage() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(0);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16">
      <SectionHeader icon="📺" title="LATEST DROPS" subtitle="Fresh content straight from the channel" />

      {/* Featured Video — Full Embed */}
      <div className={`mb-8 md:mb-12 transition-all duration-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="neon-card p-0.5 md:p-1 animate-glow-pulse">
          <div className="relative pb-[56.25%] bg-bg-surface rounded-lg overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videos[selected].id}`}
              title={videos[selected].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Video Thumbnails — Click to Play */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-10 md:mb-16">
        {videos.map((video, i) => (
          <div
            key={video.id}
            className={`transition-all duration-500 cursor-pointer ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            onClick={() => setSelected(i)}
          >
            <NeonCard className={`group ${selected === i ? "ring-2 ring-neon-cyan" : ""}`}>
              <div className="relative pb-[56.25%] bg-bg-surface overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl md:text-4xl">▶</div>
                </div>
                {selected === i && (
                  <div className="absolute top-2 left-2 bg-neon-cyan/90 text-black text-[9px] md:text-xs px-2 py-0.5 rounded font-heading">
                    NOW PLAYING
                  </div>
                )}
              </div>
            </NeonCard>
          </div>
        ))}
      </div>

      {/* Subscribe CTA */}
      <div className="text-center">
        <a
          href="https://youtube.com/@norapixelgaming"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 md:px-8 py-2.5 md:py-3 font-heading text-[10px] md:text-sm uppercase tracking-widest bg-red-600 text-white rounded hover:bg-red-700 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-105"
        >
          Subscribe on YouTube →
        </a>
      </div>
    </div>
  );
}
