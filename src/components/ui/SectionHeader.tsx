"use client";

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-8 md:mb-12 animate-fade-in">
      <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 md:mb-2">
        {icon && <span className="mr-2 md:mr-3">{icon}</span>}
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-text-secondary font-body text-sm md:text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
      <div className="w-16 md:w-24 h-0.5 md:h-1 mx-auto mt-3 md:mt-4 rounded-full" style={{ background: "var(--gradient-cyber)" }} />
    </div>
  );
}
