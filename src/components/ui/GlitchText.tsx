"use client";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="glitch-hover">{text}</span>
    </span>
  );
}
