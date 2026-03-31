"use client";

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: "default" | "glass" | "gradient";
}

export default function NeonCard({
  children,
  className = "",
  onClick,
  hover = true,
  variant = "default",
}: NeonCardProps) {
  const variants = {
    default: "neon-card",
    glass: "glass rounded-xl overflow-hidden",
    gradient: "neon-card bg-gradient-to-br from-bg-card via-bg-surface/50 to-bg-card",
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${variants[variant]}
        transition-all duration-300
        ${hover ? "cursor-pointer hover:border-neon-cyan/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,245,255,0.12)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
