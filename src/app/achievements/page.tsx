"use client";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import NeonCard from "@/components/ui/NeonCard";
import { achievements } from "@/data/achievements";

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-16">
      <SectionHeader icon="🏆" title="ACHIEVEMENT WALL" subtitle={`${unlocked}/${total} achievements unlocked`} />

      {/* Progress */}
      <div className="max-w-xs md:max-w-md mx-auto mb-8 md:mb-12">
        <div className="xp-bar-track h-3 md:h-4">
          <div
            className="xp-bar-fill h-3 md:h-4"
            style={{ width: mounted ? `${(unlocked / total) * 100}%` : "0%" }}
          />
        </div>
        <p className="text-center text-text-muted text-[10px] md:text-sm mt-2 font-mono">
          {Math.round((unlocked / total) * 100)}% Complete
        </p>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {achievements.map((achievement, i) => (
          <div
            key={achievement.id}
            className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <NeonCard className={`p-4 md:p-6 ${!achievement.unlocked ? "opacity-50 grayscale" : ""}`}>
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`text-2xl md:text-4xl ${achievement.unlocked ? "" : "relative"}`}>
                  {achievement.unlocked ? (
                    achievement.icon
                  ) : (
                    <>
                      <span className="opacity-30">{achievement.icon}</span>
                      <span className="absolute inset-0 flex items-center justify-center text-lg md:text-2xl">🔒</span>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-[10px] md:text-sm font-bold text-text-primary tracking-wider">
                    {achievement.title}
                  </h3>
                  <p className="text-text-secondary text-[10px] md:text-sm font-body mt-0.5 md:mt-1">
                    {achievement.desc}
                  </p>
                  {achievement.date && (
                    <p className="text-text-muted text-[9px] md:text-xs font-mono mt-1.5 md:mt-2">
                      Unlocked: {achievement.date}
                    </p>
                  )}
                  {achievement.unlocked && (
                    <div className="mt-2 md:mt-3">
                      <div className="xp-bar-track h-1.5 md:h-2">
                        <div className="xp-bar-fill h-1.5 md:h-2 w-full" />
                      </div>
                      <span className="text-[9px] md:text-xs text-neon-green font-mono">100%</span>
                    </div>
                  )}
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
}
