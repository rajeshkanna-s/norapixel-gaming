"use client";
import Link from "next/link";
import Image from "next/image";
import { Video, Camera, ChevronDown, ArrowRight, Gamepad2, Trophy, Zap, Clock } from "lucide-react";
import { heroData, socialLinks } from "@/data/socialLinks";
import NeonButton from "@/components/ui/NeonButton";
import InView from "@/components/ui/InView";
import Marquee from "@/components/ui/Marquee";
import StatCounter from "@/components/ui/StatCounter";
import { useEffect, useState } from "react";

const socials = [
  { icon: Video, href: socialLinks.youtube, color: "hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]", label: "YouTube" },
  { icon: Camera, href: socialLinks.instagram, color: "hover:text-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]", label: "Instagram" },
];

const marqueeGames = [
  "GTA V", "Valorant", "BGMI", "Minecraft", "Elden Ring", "FIFA 25",
  "God of War", "Spider-Man", "Cyberpunk 2077", "Call of Duty", "Fortnite",
  "Hogwarts Legacy", "Red Dead Redemption", "Apex Legends",
];

const expertise = [
  { num: "01", title: "Gaming Content", desc: "High-quality gameplay videos, walkthroughs, and reviews across AAA and indie titles.", icon: "🎮", color: "text-neon-cyan" },
  { num: "02", title: "Live Streaming", desc: "Engaging live streams with interactive gameplay and real-time community interaction.", icon: "🔴", color: "text-neon-red" },
  { num: "03", title: "Game Rentals", desc: "Premium game rental service — play the latest titles at affordable prices.", icon: "🕹️", color: "text-neon-green" },
  { num: "04", title: "Competitive Gaming", desc: "Tournament participation and esports coverage across FPS and battle royale genres.", icon: "🏆", color: "text-neon-yellow" },
  { num: "05", title: "Tech & Gear Reviews", desc: "In-depth reviews of gaming hardware, peripherals, and setup recommendations.", icon: "⚙️", color: "text-neon-purple" },
];

export default function HomePage() {
  const [subtitle, setSubtitle] = useState("");
  const [mounted, setMounted] = useState(false);
  const fullSubtitle = heroData.subtitle;

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      setSubtitle(fullSubtitle.slice(0, i + 1));
      i++;
      if (i >= fullSubtitle.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullSubtitle]);

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 md:w-[500px] md:h-[500px] bg-neon-cyan/5 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/3 right-1/6 w-64 h-64 md:w-[400px] md:h-[400px] bg-neon-purple/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: "1.5s" }} />

        {/* Main content */}
        <div className="text-center z-10 w-full max-w-4xl mx-auto">
          {/* Logo */}
          <div className={`mb-4 md:mb-6 transition-all duration-700 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            <div className="relative inline-block">
              <Image
                src="/logo.png"
                alt="NoraPixel Gaming"
                width={180}
                height={180}
                className="rounded-full mx-auto border-2 border-neon-cyan/40 w-28 h-28 sm:w-36 sm:h-36 md:w-[180px] md:h-[180px]"
                style={{ boxShadow: "0 0 40px rgba(0,245,255,0.25), 0 0 80px rgba(191,0,255,0.1)" }}
                priority
              />
              <div className="absolute inset-[-6px] md:inset-[-10px] rounded-full border border-neon-cyan/20 animate-rotate-slow" />
              <div className="absolute inset-[-14px] md:inset-[-22px] rounded-full border border-neon-purple/10 animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
            </div>
          </div>

          {/* Gamer Tag */}
          <h1
            className={`font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-2 md:mb-3 neon-text tracking-wider transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            {heroData.gamerTag}
          </h1>

          {/* Typewriter subtitle */}
          <p className={`font-mono text-[10px] sm:text-xs md:text-sm text-text-secondary mb-4 md:mb-5 tracking-widest transition-opacity duration-500 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <span className="text-neon-cyan">//</span>{" "}
            <span className="typing-cursor">{subtitle}</span>
          </p>

          {/* Tagline */}
          <h2 className={`font-heading text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold gradient-text mb-5 md:mb-7 animate-text-glow inline-block px-3 md:px-4 py-2 rounded transition-all duration-600 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {heroData.tagline}
          </h2>

          {/* CTAs with Indium-style arrow-slide */}
          <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-10 transition-all duration-600 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <Link href="/games">
              <NeonButton size="lg" variant="cyan" className="arrow-slide flex items-center gap-2">
                ▶ {heroData.ctaPrimary} <ArrowRight className="w-4 h-4 arrow-icon" />
              </NeonButton>
            </Link>
            <Link href="/rent" className="arrow-slide flex items-center gap-2 text-text-secondary hover:text-neon-purple transition-colors font-body group text-sm md:text-base">
              Rent Games <ArrowRight className="w-4 h-4 arrow-icon" />
            </Link>
          </div>

          {/* Social Icons */}
          <div className={`flex justify-center gap-3 md:gap-4 transition-opacity duration-500 delay-1000 ${mounted ? "opacity-100" : "opacity-0"}`}>
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-text-muted ${social.color} transition-all duration-200 rounded-full p-2.5 md:p-3 bg-bg-card/60 border border-white/5 hover:border-white/20 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-sm`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-6 md:bottom-8 animate-bounce-down transition-opacity duration-500 delay-[1200ms] ${mounted ? "opacity-100" : "opacity-0"}`}>
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-text-muted" />
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="py-6 md:py-8 border-y border-white/5 relative z-10">
        <Marquee items={marqueeGames} speed={35} />
      </section>

      {/* ═══ EXPERTISE SECTION (Indium-inspired accordion list) ═══ */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 py-16 md:py-24 relative z-10">
        <InView animation="fade-up">
          <div className="text-center mb-10 md:mb-14">
            <p className="font-mono text-xs text-neon-cyan tracking-[0.3em] uppercase mb-2">WHAT WE DO</p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold gradient-text">Our Expertise</h2>
            <div className="neon-divider w-24 md:w-32 mx-auto mt-4" />
          </div>
        </InView>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Expertise list */}
          <div className="space-y-0">
            {expertise.map((item, i) => (
              <InView key={item.num} animation="fade-left" delay={i * 100}>
                <div className="group border-b border-white/5 py-4 md:py-6 hover:bg-white/[0.02] px-3 md:px-4 rounded-lg transition-all duration-200 cursor-default">
                  <div className="flex items-start gap-3 md:gap-5">
                    <span className="font-mono text-xs md:text-sm text-text-muted/40 mt-1">{item.num}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-1">
                        <span className="text-xl md:text-2xl">{item.icon}</span>
                        <h3 className={`font-heading text-sm md:text-xl tracking-wider ${item.color} group-hover:animate-text-glow transition-all`}>{item.title}</h3>
                      </div>
                      <p className="text-text-secondary font-body text-xs md:text-sm leading-relaxed max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-text-muted/30 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                </div>
              </InView>
            ))}
          </div>

          {/* Feature showcase */}
          <InView animation="fade-right" delay={200}>
            <div className="neon-card p-6 md:p-8 text-center lg:sticky lg:top-24">
              <div className="relative inline-block mb-4 md:mb-6">
                <Image
                  src="/logo.png"
                  alt="NoraPixel"
                  width={120}
                  height={120}
                  className="rounded-full w-20 h-20 md:w-[120px] md:h-[120px] mx-auto"
                  style={{ boxShadow: "var(--glow-cyan)" }}
                />
                <div className="absolute inset-[-8px] rounded-full border border-neon-cyan/15 animate-neon-pulse" />
              </div>
              <h3 className="font-heading text-sm md:text-lg text-neon-cyan mb-2 tracking-wider">NORAPIXEL GAMING</h3>
              <p className="text-text-secondary font-body text-xs md:text-sm mb-4 md:mb-6">
                Your one-stop destination for gaming content, live streams, competitive gameplay, and game rentals.
              </p>
              <Link href="/about" className="arrow-slide inline-flex items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors font-body text-sm">
                Learn more <ArrowRight className="w-4 h-4 arrow-icon" />
              </Link>
            </div>
          </InView>
        </div>
      </section>

      {/* ═══ STATS SECTION (Indium-inspired counters) ═══ */}
      <section className="relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-20">
          <InView animation="fade-up">
            <div className="text-center mb-8 md:mb-12">
              <p className="font-mono text-xs text-neon-purple tracking-[0.3em] uppercase mb-2">IMPACT</p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold gradient-text">By The Numbers</h2>
              <div className="neon-divider w-24 md:w-32 mx-auto mt-4" />
            </div>
          </InView>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <InView animation="fade-up" delay={0}><StatCounter value={150000} label="Subscribers" suffix="+" /></InView>
            <InView animation="fade-up" delay={100}><StatCounter value={2000000} label="Total Views" suffix="+" /></InView>
            <InView animation="fade-up" delay={200}><StatCounter value={500} label="Videos Made" suffix="+" /></InView>
            <InView animation="fade-up" delay={300}><StatCounter value={5000} label="Hours Streamed" suffix="+" /></InView>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED SECTIONS ═══ */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 py-16 md:py-24 relative z-10">
        <InView animation="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <p className="font-mono text-xs text-neon-green tracking-[0.3em] uppercase mb-2">EXPLORE</p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold gradient-text">Quick Access</h2>
            <div className="neon-divider w-24 md:w-32 mx-auto mt-4" />
          </div>
        </InView>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            { icon: "🎮", title: "Play Games", desc: "27+ browser games", href: "/games", color: "from-neon-cyan/10 to-neon-purple/10" },
            { icon: "🕹️", title: "Rent Games", desc: "Premium titles", href: "/rent", color: "from-neon-green/10 to-neon-cyan/10" },
            { icon: "📺", title: "Watch Videos", desc: "Latest drops", href: "/youtube", color: "from-red-500/10 to-neon-orange/10" },
            { icon: "📸", title: "Instagram", desc: "Behind the scenes", href: "/instagram", color: "from-pink-500/10 to-neon-purple/10" },
          ].map((card, i) => (
            <InView key={card.title} animation="scale" delay={i * 80}>
              <Link href={card.href}>
                <div className={`neon-card p-4 md:p-6 text-center group cursor-pointer bg-gradient-to-br ${card.color} hover:animate-glow-pulse`}>
                  <div className="text-3xl md:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{card.icon}</div>
                  <h3 className="font-heading text-[10px] md:text-sm text-text-primary mb-0.5 md:mb-1 tracking-wider">{card.title}</h3>
                  <p className="text-text-muted text-[9px] md:text-xs font-body">{card.desc}</p>
                  <ArrowRight className="w-4 h-4 text-text-muted/30 group-hover:text-neon-cyan mx-auto mt-2 md:mt-3 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </InView>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM MARQUEE ═══ */}
      <section className="py-4 md:py-6 border-t border-white/5 relative z-10">
        <Marquee items={["Content Creator", "Gamer", "Streamer", "Reviewer", "Esports", "Community Builder"]} speed={40} separator="◆" />
      </section>
    </>
  );
}
