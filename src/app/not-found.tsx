"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import NeonButton from "@/components/ui/NeonButton";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative z-10">
      <div className={`transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
        <Image src="/logo.png" alt="NoraPixel" width={80} height={80} className="rounded-full mx-auto mb-4 w-16 h-16 md:w-20 md:h-20" style={{ boxShadow: "var(--glow-purple)" }} />
        <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl font-black neon-text mb-4 glitch-hover">
          404
        </h1>
      </div>

      <div className={`transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl gradient-text mb-2">
          GAME OVER — Page Not Found
        </h2>
        <p className="text-text-secondary font-body mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
          The page you&apos;re looking for has respawned elsewhere. Check the URL or head back to safety.
        </p>

        <div className="text-4xl md:text-6xl mb-6 md:mb-8 animate-float">😵</div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link href="/"><NeonButton variant="cyan">Go Home</NeonButton></Link>
          <Link href="/games"><NeonButton variant="purple">Play a Game</NeonButton></Link>
        </div>
      </div>
    </div>
  );
}
