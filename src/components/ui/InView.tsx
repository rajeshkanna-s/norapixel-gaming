"use client";
import { useEffect, useRef, useState } from "react";

interface InViewProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
  once?: boolean;
}

export default function InView({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  once = true,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const baseHidden: Record<string, string> = {
    "fade-up": "opacity-0 translate-y-8",
    "fade-left": "opacity-0 -translate-x-8",
    "fade-right": "opacity-0 translate-x-8",
    "scale": "opacity-0 scale-90",
    "fade": "opacity-0",
  };

  const baseVisible = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${
        isVisible ? baseVisible : baseHidden[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
