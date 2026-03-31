"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import InView from "@/components/ui/InView";
import { socialLinks } from "@/data/socialLinks";
import { Video, Camera, Mail, Send, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const inquiryTypes = ["Brand Deal", "Sponsorship", "Collaboration", "Fan Message", "Other"];

const socials = [
  { icon: Video, label: "YouTube", handle: "@norapixelgaming", followers: "150K", href: socialLinks.youtube, color: "text-red-500", bg: "bg-red-500/10" },
  { icon: Camera, label: "Instagram", handle: "@norapixel_gaming", followers: "85K", href: socialLinks.instagram, color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: Mail, label: "Email", handle: socialLinks.email, followers: "", href: `mailto:${socialLinks.email}`, color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
];

const inputClass = `
  w-full bg-bg-surface/80 border border-white/10 rounded-lg
  px-4 py-3 text-sm text-text-primary font-body
  placeholder:text-text-muted/60
  focus:border-neon-cyan/60 focus:outline-none
  focus:shadow-[0_0_0_3px_rgba(0,245,255,0.08),0_0_20px_rgba(0,245,255,0.08)]
  hover:border-white/20
  transition-all duration-200
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", type: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "e01c5152-4ca0-43bc-b72e-4e703ed3b116",
          from_name: "NoraPixel Website",
          subject: `[NoraPixel] ${formData.type} — ${formData.name}`,
          name: formData.name,
          email: formData.email,
          inquiry_type: formData.type,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", type: "", message: "" });
      } else {
        // Fallback: open mailto
        window.location.href = `mailto:${socialLinks.email}?subject=${encodeURIComponent(`[${formData.type}] From ${formData.name}`)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
        setStatus("success");
      }
    } catch {
      // Fallback: open mailto on network error
      window.location.href = `mailto:${socialLinks.email}?subject=${encodeURIComponent(`[${formData.type}] From ${formData.name}`)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
      setStatus("success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16 relative z-10">
      <SectionHeader icon="📬" title="GET IN TOUCH" subtitle="Collabs, brand deals, or just wanna say hi?" />

      <div className="grid lg:grid-cols-5 gap-6 md:gap-10">
        {/* Contact Form — 3 columns */}
        <InView animation="fade-left" className="lg:col-span-3">
          {status === "success" ? (
            <div className="neon-card p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-neon-green" />
              </div>
              <h3 className="font-heading text-lg md:text-2xl text-neon-green mb-2 tracking-wider">MESSAGE SENT!</h3>
              <p className="text-text-secondary font-body text-sm md:text-base mb-6">GG! I&apos;ll get back to you within 48 hours. 🎮</p>
              <button
                onClick={() => setStatus("idle")}
                className="font-heading text-xs tracking-widest uppercase text-neon-cyan hover:text-neon-purple transition-colors cursor-pointer"
              >
                ← Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="neon-card p-5 md:p-8">
              {/* Form header */}
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 md:pb-5 border-b border-white/5">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-heading text-sm md:text-base text-text-primary tracking-wider">SEND A MESSAGE</h3>
                  <p className="text-text-muted text-[10px] md:text-xs font-body">All fields marked * are required</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-text-secondary text-[11px] md:text-xs font-heading uppercase tracking-wider mb-2">
                      Name <span className="text-neon-pink">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-[11px] md:text-xs font-heading uppercase tracking-wider mb-2">
                      Email <span className="text-neon-pink">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-text-secondary text-[11px] md:text-xs font-heading uppercase tracking-wider mb-2">
                    Inquiry Type <span className="text-neon-pink">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select inquiry type...</option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-text-secondary text-[11px] md:text-xs font-heading uppercase tracking-wider mb-2">
                    Message <span className="text-neon-pink">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell me about your project, idea, or just say hello..."
                  />
                  <div className="text-right mt-1">
                    <span className={`text-[10px] font-mono ${formData.message.length > 900 ? "text-neon-red" : "text-text-muted/40"}`}>
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 md:py-4 rounded-lg font-heading text-xs md:text-sm uppercase tracking-[0.2em]
                    bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20
                    border border-neon-cyan/40 text-neon-cyan
                    hover:from-neon-cyan/30 hover:to-neon-purple/30 hover:border-neon-cyan/70
                    hover:shadow-[0_0_30px_rgba(0,245,255,0.2),0_0_60px_rgba(191,0,255,0.1)]
                    active:scale-[0.98] transition-all duration-300 cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> SENDING...</>
                  ) : (
                    <><Send className="w-4 h-4" /> SEND MESSAGE</>
                  )}
                </button>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-neon-red text-xs font-body p-3 rounded-lg bg-neon-red/5 border border-neon-red/20">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Something went wrong. Please try again or DM on Instagram.
                  </div>
                )}
              </div>
            </form>
          )}
        </InView>

        {/* Right column — 2 columns */}
        <InView animation="fade-right" delay={150} className="lg:col-span-2">
          <div className="space-y-3 md:space-y-4">
            {/* Logo card */}
            <div className="neon-card p-5 md:p-6 text-center">
              <Image src="/logo.png" alt="NoraPixel" width={70} height={70} className="rounded-full mx-auto mb-3 w-14 h-14 md:w-[70px] md:h-[70px]" style={{ boxShadow: "var(--glow-cyan)" }} />
              <h3 className="font-heading text-xs md:text-sm text-neon-cyan tracking-wider mb-1">NORAPIXEL GAMING</h3>
              <p className="text-text-muted text-[10px] md:text-xs font-body">Content Creator • Gamer • Streamer</p>
            </div>

            {/* Social cards */}
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-card p-3.5 md:p-4 flex items-center gap-3 md:gap-4 transition-all block group"
              >
                <div className={`p-2.5 rounded-xl ${social.bg} border border-white/5`}>
                  <social.icon className={`w-5 h-5 ${social.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-[11px] md:text-xs text-text-primary tracking-wider">{social.label}</div>
                  <div className="text-text-muted text-[10px] md:text-xs font-mono truncate">{social.handle}</div>
                </div>
                {social.followers && (
                  <div className="text-neon-cyan font-mono text-xs font-bold">{social.followers}</div>
                )}
                <ArrowRight className="w-4 h-4 text-text-muted/20 group-hover:text-neon-cyan group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}

            {/* Quick tip */}
            <div className="neon-card p-4 md:p-5 bg-gradient-to-br from-neon-green/5 to-transparent border-neon-green/15">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="font-heading text-[11px] md:text-xs text-neon-green mb-1 tracking-wider">FASTEST RESPONSE</h4>
                  <p className="text-text-secondary font-body text-[11px] md:text-xs leading-relaxed">
                    DM on Instagram for quickest replies. Business emails get responded within 48hrs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
}
