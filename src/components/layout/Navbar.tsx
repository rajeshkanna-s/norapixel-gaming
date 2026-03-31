"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Volume2, VolumeX } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/youtube", label: "YouTube" },
  { href: "/instagram", label: "Instagram" },
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
  const [muted, setMuted] = useState(true);

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
            ? "glass py-1.5 md:py-2 shadow-[0_1px_0_rgba(0,245,255,0.15),0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-2.5 md:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2 group">
            <Image
              src="/logo.png"
              alt="NoraPixel Gaming"
              width={40}
              height={40}
              className="rounded-full group-hover:drop-shadow-[0_0_10px_rgba(0,245,255,0.8)] transition-all w-8 h-8 md:w-10 md:h-10"
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
                    style={{ boxShadow: "0 0 10px rgba(0,245,255,0.5)" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setMuted(!muted)}
              className="text-text-secondary hover:text-neon-cyan transition-colors p-1"
              aria-label="Toggle sound"
            >
              {muted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

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
          {navLinks.map((link, i) => (
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
