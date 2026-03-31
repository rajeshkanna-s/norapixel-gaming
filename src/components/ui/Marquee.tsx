"use client";

interface MarqueeProps {
  items: string[];
  speed?: number;
  separator?: string;
  className?: string;
}

export default function Marquee({
  items,
  speed = 30,
  separator = "✦",
  className = "",
}: MarqueeProps) {
  // Duplicate items for seamless loop
  const content = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex items-center gap-6 md:gap-8 animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {content.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 md:gap-8">
            <span className="font-heading text-sm md:text-lg text-text-muted/50 tracking-[0.2em] uppercase hover:text-neon-cyan transition-colors duration-200">
              {item}
            </span>
            <span className="text-neon-cyan/30 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
