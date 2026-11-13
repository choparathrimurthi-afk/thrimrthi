import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_OWNER } from '../data/portfolioData';

const AboutGeoScene = lazy(() =>
  import('./three/AboutGeoScene').then((mod) => ({ default: mod.AboutGeoScene })),
);

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="font-mono text-xs font-medium tracking-wider text-purple-400">
            01. About Me
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Building foundations in AI &amp; software engineering
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* 3D Animated Geometric Object */}
          <div className="lg:col-span-5">
            <Suspense
              fallback={
                <div className="flex w-full h-[320px] sm:h-[380px] lg:h-full lg:min-h-[380px] items-center justify-center rounded-2xl border border-purple-500/20 bg-[#0b0b18]">
                  <p className="font-mono text-xs text-slate-400">Loading 3D Sculpture…</p>
                </div>
              }
            >
              <AboutGeoScene />
            </Suspense>
          </div>

          {/* Editorial Bio & Structured Details */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl surface-glass p-6 sm:p-8 lg:p-10">
            <div className="space-y-6">
              <p className="text-lg sm:text-xl leading-relaxed text-slate-100 font-medium">
                {PORTFOLIO_OWNER.aboutBio}
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                As a <span className="text-white font-medium">NIAT student specializing in AI</span>{' '}
                pursuing my BTech at{' '}
                <span className="text-white font-medium">Joy University</span>, I have participated
                in several hackathons and divide my time between strengthening algorithmic thinking
                in Python, building interactive web applications, and understanding how modern
                machine learning models reason over real-world data.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Student</p>
                <p className="mt-1 font-display text-sm font-semibold text-white">
                  {PORTFOLIO_OWNER.fullName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Specialization</p>
                <p className="mt-1 font-display text-sm font-semibold text-white">
                  NIAT · Artificial Intelligence
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Approach</p>
                <p className="mt-1 font-display text-sm font-semibold text-white">
                  Learn by Shipping
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
