import React from 'react';
import { Award, Code, Compass, Trophy } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../data/portfolioData';
import { TiltCard3D } from './TiltCard3D';

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hackathons: Trophy,
  competitions: Compass,
  certifications: Award,
  milestones: Code,
};

export function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-wider text-purple-400">
            05. Growth &amp; Milestones
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Achievements &amp; hackathon journey
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            Hands-on hackathon participation alongside structured milestone slots for upcoming
            competitions, certifications, and coding consistency.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {ACHIEVEMENTS_DATA.map((item, idx) => {
            const Icon = ACHIEVEMENT_ICONS[item.id] || Award;
            const accent = idx % 2 === 0 ? 'purple' : 'blue';
            return (
              <TiltCard3D key={item.id} glowColor={accent} maxTilt={6} className="p-6 sm:p-7">
                <div className="flex h-full flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/12 text-purple-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {item.targetCycle}
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-sky-400">
                      {item.category} · {item.statusLabel}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </TiltCard3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
