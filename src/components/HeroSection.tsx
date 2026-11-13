import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Download } from 'lucide-react';
import { PORTFOLIO_OWNER } from '../data/portfolioData';
import { HeroNeuralScene } from './three/HeroNeuralScene';

interface HeroSectionProps {
  onDownloadResume: () => void;
}

export function HeroSection({ onDownloadResume }: HeroSectionProps) {
  const [avatarError, setAvatarError] = useState(false);

  const scrollToProjects = () => {
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="top" className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      {/* Subtle atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-purple-600/12 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 right-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Typographic + Portrait Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Introduction Text (Left) + Large Circular Portrait (Right) */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                <p className="font-mono text-sm font-medium tracking-wide text-sky-400">
                  {PORTFOLIO_OWNER.greeting}
                </p>
                <h1
                  className="font-display text-4xl sm:text-[2.75rem] xl:text-[3.35rem] font-bold tracking-tight text-white leading-[1.08]"
                  style={{ textWrap: 'balance' }}
                >
                  {PORTFOLIO_OWNER.headline}
                </h1>
                <p className="font-display text-lg sm:text-xl xl:text-2xl font-semibold bg-gradient-to-r from-purple-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                  {PORTFOLIO_OWNER.role}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 shrink-0 self-start sm:self-center">
                <div className="relative h-40 w-40 sm:h-44 sm:w-44 lg:h-52 lg:w-52">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-purple-500 via-violet-500 to-sky-400 opacity-80 blur-[10px]"
                  />
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-purple-400/75 bg-white shadow-2xl">
                    {avatarError ? (
                      <div className="flex h-full w-full items-center justify-center bg-[#0d0d1c] font-display text-3xl font-bold text-purple-200">
                        CT
                      </div>
                    ) : (
                      <img
                        src={PORTFOLIO_OWNER.avatarUrl}
                        alt={`${PORTFOLIO_OWNER.fullName} portrait`}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </div>
                </div>
                <p className="font-display text-base sm:text-lg font-semibold tracking-wide text-white text-center">
                  {PORTFOLIO_OWNER.fullName}
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              {PORTFOLIO_OWNER.heroSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-700/25 hover:from-purple-500 hover:to-blue-500 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                Explore My Work
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 hover:border-sky-400/50 hover:bg-white/10 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Download className="h-4 w-4 text-sky-400" aria-hidden="true" />
                Download Resume
              </button>
            </div>
          </motion.div>

          {/* Right 3D Interactive Neural Core Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <HeroNeuralScene />
          </motion.div>
        </div>

        {/* Full-Width Profile Anchor Row below the Split */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-6">
          <div>
            <p className="text-xs font-medium text-slate-400">Program</p>
            <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white">
              BTech CSE (AI &amp; ML)
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Institute &amp; University</p>
            <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white">
              NIAT · Joy University
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Specialization</p>
            <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white">
              NIAT Student · AI Track
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Experience</p>
            <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white">
              Multi-Hackathon Builder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
