"use client";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
  color: string;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ["#00F5FF", "#BF00FF", "#FF006E", "#39FF14"];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 4 + 4,
        color: colors[Math.floor(Math.random() * 4)],
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `float-up ${p.duration}s ${p.delay}s infinite linear`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
