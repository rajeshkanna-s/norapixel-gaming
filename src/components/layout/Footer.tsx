import Link from "next/link";
import Image from "next/image";
import { Video } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/games", label: "Games" },
  { href: "/youtube", label: "YouTube" },
  { href: "/rent", label: "Rent" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { icon: Video, href: socialLinks.youtube, label: "YouTube", color: "hover:text-red-500" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--t-divider)] bg-bg-secondary/50 mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 md:mb-4 group">
              <Image
                src="/newlogo.jpg"
                alt="NoraPixel Gaming"
                width={28}
                height={28}
                className="rounded-full group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] transition-all w-6 h-6 md:w-7 md:h-7"
              />
              <span className="font-heading text-xs md:text-sm text-neon-cyan tracking-wider">NORAPIXEL</span>
            </Link>
            <p className="text-text-muted text-xs font-body leading-relaxed">
              Content Creator • Gamer • Streamer
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-[10px] md:text-xs text-text-secondary mb-2 md:mb-3 tracking-wider">NAVIGATE</h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              {footerLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-muted hover:text-neon-cyan text-xs font-body transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-[10px] md:text-xs text-text-secondary mb-2 md:mb-3 tracking-wider">MORE</h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              {footerLinks.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-muted hover:text-neon-cyan text-xs font-body transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-[10px] md:text-xs text-text-secondary mb-2 md:mb-3 tracking-wider">CONNECT</h4>
            <div className="flex gap-2 md:gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-text-muted ${social.color} transition-all p-1.5 md:p-2 rounded bg-bg-card/50 border border-[var(--t-border-subtle)] hover:border-[var(--t-border-accent)]`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="neon-divider w-full mb-4 md:mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-text-muted text-[10px] md:text-xs font-mono">
          <span>© {new Date().getFullYear()} NoraPixel Gaming. All rights reserved.</span>
          <span className="text-neon-cyan/40">Built with 💜 for gaming</span>
        </div>
      </div>
    </footer>
  );
}
