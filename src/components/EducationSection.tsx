import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { EDUCATION_TIMELINE } from '../data/portfolioData';

export function EducationSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <section id="education" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-wider text-sky-400">
            04. Academic Path
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Education &amp; AI specialization roadmap
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            BTech – Computer Science and Engineering (AI &amp; ML) at Joy University.
          </p>
        </div>

        {/* Futuristic Animated Timeline */}
        <div ref={timelineRef} className="relative mt-12 pl-8 sm:pl-12">
          {/* Static background track */}
          <div
            aria-hidden="true"
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-white/10"
          />

          {/* Scroll-driven neon beam */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-purple-400 via-sky-400 to-violet-500"
          />

          <div className="space-y-8">
            {EDUCATION_TIMELINE.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Static geometric node marker */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[25px] sm:-left-[37px] top-6 flex h-5 w-5 items-center justify-center rounded-md border ${
                    node.isCurrent
                      ? 'border-sky-400 bg-[#0d1428] shadow-[0_0_16px_rgba(56,189,248,0.45)]'
                      : 'border-purple-400/40 bg-[#120e24]'
                  }`}
                >
                  <GraduationCap
                    className={`h-3 w-3 ${
                      node.isCurrent ? 'text-sky-300' : 'text-purple-300'
                    }`}
                  />
                </div>

                <div
                  className={`rounded-2xl surface-glass p-6 sm:p-8 ${
                    node.isCurrent ? 'border-sky-400/30' : ''
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono">
                      <span className={node.isCurrent ? 'text-sky-300' : 'text-purple-300'}>
                        {node.phase}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">
                        ·
                      </span>
                      <span className="tabular-nums text-slate-400">{node.period}</span>
                      {node.isCurrent && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-sky-300 font-medium">Current Year</span>
                        </>
                      )}
                    </div>

                    <span className="font-mono text-xs text-slate-400">
                      {node.institution}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-white">
                    {node.degree}
                  </h3>

                  <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">
                    {node.summary}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-white/10 pt-4 sm:grid-cols-3">
                    {node.highlights.map((highlight) => (
                      <p key={highlight} className="text-xs sm:text-sm text-slate-200">
                        <span className="mr-2 text-purple-400" aria-hidden="true">
                          —
                        </span>
                        {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
