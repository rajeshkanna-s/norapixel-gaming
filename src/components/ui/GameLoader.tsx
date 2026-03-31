"use client";

export default function GameLoader({ text = "LOADING" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Animated controller icon */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-neon-cyan/20 flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.8)] top-0 left-1/2 -translate-x-1/2" />
        </div>
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl md:text-5xl animate-float">🎮</span>
        </div>
      </div>

      {/* Loading text with animation */}
      <div className="flex items-center gap-1">
        <span className="font-heading text-sm md:text-base tracking-[0.3em] text-neon-cyan">{text}</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce"
              style={{ animationDelay: `${i * 200}ms`, animationDuration: "0.8s" }}
            />
          ))}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-48 md:w-64 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan"
          style={{
            animation: "loader-progress 1.5s ease-in-out infinite",
            width: "40%",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes loader-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
