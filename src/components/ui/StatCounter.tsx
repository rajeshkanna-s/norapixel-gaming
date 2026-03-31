"use client";
import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/lib/hooks";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export default function StatCounter({
  value,
  label,
  suffix = "",
  duration = 2000,
}: StatCounterProps) {
  const [ref, isVisible] = useIntersectionObserver();
  const displayValue = useAnimatedNumber(isVisible ? value : 0, duration);

  return (
    <div ref={ref} className="text-center neon-card p-3 md:p-4 animate-shimmer">
      <div className="font-mono text-2xl md:text-4xl lg:text-5xl font-bold text-neon-cyan mb-0.5 md:mb-1">
        {formatDisplay(displayValue)}
        <span className="text-sm md:text-lg text-text-secondary ml-0.5 md:ml-1">{suffix}</span>
      </div>
      <div className="text-text-secondary text-[10px] md:text-sm font-body">{label}</div>
    </div>
  );
}

function useAnimatedNumber(target: number, duration: number): number {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return current;
}

function formatDisplay(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}
