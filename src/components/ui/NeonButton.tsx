"use client";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "cyan" | "purple" | "pink" | "green";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantStyles = {
  cyan: {
    base: "border-neon-cyan/60 text-neon-cyan",
    bg: "bg-gradient-to-r from-neon-cyan/10 to-neon-cyan/5",
    hover: "hover:from-neon-cyan/25 hover:to-neon-cyan/15 hover:shadow-[0_0_25px_rgba(0,245,255,0.4),0_0_60px_rgba(0,245,255,0.1)] hover:border-neon-cyan",
  },
  purple: {
    base: "border-neon-purple/60 text-neon-purple",
    bg: "bg-gradient-to-r from-neon-purple/10 to-neon-purple/5",
    hover: "hover:from-neon-purple/25 hover:to-neon-purple/15 hover:shadow-[0_0_25px_rgba(191,0,255,0.4),0_0_60px_rgba(191,0,255,0.1)] hover:border-neon-purple",
  },
  pink: {
    base: "border-neon-pink/60 text-neon-pink",
    bg: "bg-gradient-to-r from-neon-pink/10 to-neon-pink/5",
    hover: "hover:from-neon-pink/25 hover:to-neon-pink/15 hover:shadow-[0_0_25px_rgba(255,0,110,0.4),0_0_60px_rgba(255,0,110,0.1)] hover:border-neon-pink",
  },
  green: {
    base: "border-neon-green/60 text-neon-green",
    bg: "bg-gradient-to-r from-neon-green/10 to-neon-green/5",
    hover: "hover:from-neon-green/25 hover:to-neon-green/15 hover:shadow-[0_0_25px_rgba(57,255,20,0.4),0_0_60px_rgba(57,255,20,0.1)] hover:border-neon-green",
  },
};

const sizeClasses = {
  sm: "px-4 py-2 text-[10px] md:text-xs",
  md: "px-5 md:px-6 py-2.5 md:py-3 text-[10px] md:text-sm",
  lg: "px-6 md:px-8 py-3 md:py-4 text-xs md:text-base",
};

export default function NeonButton({
  children,
  variant = "cyan",
  size = "md",
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: NeonButtonProps) {
  const v = variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-heading uppercase tracking-widest border-2 rounded-lg cursor-pointer
        transition-all duration-300 relative overflow-hidden
        hover:scale-[1.04] active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${v.base} ${v.bg} ${v.hover}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Shimmer sweep */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
