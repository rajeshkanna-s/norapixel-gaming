"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Volume2, VolumeX, Music, Sun, Moon } from "lucide-react";
import { useAudio } from "@/components/providers/AudioProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/youtube", label: "YouTube" },
  { href: "/games", label: "Games" },
  { href: "/achievements", label: "Achievements" },
  { href: "/setup", label: "Setup" },
  { href: "/rent", label: "Rent" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { muted, toggleMute, trackName } = useAudio();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "glass py-1.5 md:py-2 shadow-[0_1px_0_var(--t-border-accent),0_4px_30px_rgba(0,0,0,0.15)]"
            : "bg-transparent py-2.5 md:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2 group">
            <Image
              src="/newlogo.jpg"
              alt="NoraPixel Gaming"
              width={40}
              height={40}
              className="rounded-full group-hover:drop-shadow-[0_0_10px_rgba(var(--t-particle-color),0.6)] transition-all w-8 h-8 md:w-10 md:h-10"
            />
            <span className="font-heading text-sm md:text-xl font-bold text-neon-cyan glitch-hover tracking-wider">
              NORAPIXEL
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 xl:px-3 py-2 text-xs xl:text-sm font-body font-medium transition-all duration-200 relative ${
                  pathname === link.href
                    ? "text-neon-cyan"
                    : "text-text-secondary hover:text-neon-cyan"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span
                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-neon-cyan rounded-full animate-scale-in"
                    style={{ boxShadow: `0 0 10px rgba(var(--t-particle-color), 0.4)` }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-1.5 rounded-full transition-all duration-300 text-text-secondary hover:text-neon-cyan hover:bg-bg-card/50"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Volume / Now Playing */}
            <div className="relative group flex items-center">
              <button
                onClick={toggleMute}
                className={`relative p-1.5 rounded-full transition-all duration-300 ${
                  muted
                    ? "text-text-secondary hover:text-neon-cyan"
                    : "text-neon-cyan audio-pulse"
                }`}
                aria-label="Toggle background music"
                title={muted ? "Play epic soundtrack" : `Now playing: ${trackName}`}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

              {/* Now-playing tooltip */}
              {!muted && trackName && (
                <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="glass rounded-lg px-3 py-2 flex items-center gap-2 whitespace-nowrap border border-neon-cyan/20">
                    <Music className="w-3 h-3 text-neon-cyan animate-spin" style={{ animationDuration: "3s" }} />
                    <span className="text-[10px] md:text-xs text-neon-cyan font-medium">{trackName}</span>
                  </div>
                </div>
              )}
            </div>

            <Link href="/games" className="hidden md:inline-flex neon-btn text-[10px] xl:text-xs py-1.5 xl:py-2 px-3 xl:px-4">
              ▶ PLAY GAMES
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-neon-cyan p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center transition-all duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className={`flex flex-col items-center gap-5 transition-transform duration-200 ${isOpen ? "scale-100" : "scale-95"}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xl sm:text-2xl font-heading tracking-wider transition-colors ${
                pathname === link.href
                  ? "text-neon-cyan neon-text"
                  : "text-text-secondary hover:text-neon-cyan"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/games" className="neon-btn mt-4 text-sm">
            ▶ PLAY GAMES
          </Link>
        </div>
      </div>
    </>
  );
}
