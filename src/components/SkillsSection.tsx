import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BrainCircuit,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  Layers,
  Terminal,
} from 'lucide-react';
import { SKILLS_DATA, type SkillItem } from '../data/portfolioData';
import { TiltCard3D } from './TiltCard3D';

type SkillFilter = 'All' | 'AI & Core' | 'Web & Tooling';

const SKILL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: Terminal,
  'artificial-intelligence': BrainCircuit,
  'machine-learning': Cpu,
  javascript: Code2,
  html: FileCode2,
  css: Layers,
  'git-github': GitBranch,
};

const ACCENT_ICON_BG: Record<SkillItem['accent'], string> = {
  blue: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-400/25',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-400/25',
};

export function SkillsSection() {
  const [filter, setFilter] = useState<SkillFilter>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('python');

  const filteredSkills =
    filter === 'All'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((skill) => skill.category === filter);

  const selectedSkill =
    SKILLS_DATA.find((s) => s.id === selectedSkillId) || SKILLS_DATA[0];

  return (
    <section id="skills" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-medium tracking-wider text-sky-400">
              02. Technical Stack
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Core skills &amp; engineering toolkit
            </h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter skills by domain"
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#0d0d1c] p-1 self-start md:self-auto"
          >
            {(['All', 'AI & Core', 'Web & Tooling'] as SkillFilter[]).map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(tab)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/30 text-white border border-purple-400/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Floating Skill Cards */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredSkills.map((skill) => {
            const IconComponent = SKILL_ICONS[skill.id] || Code2;
            const isSelected = selectedSkill.id === skill.id;
            return (
              <TiltCard3D
                key={skill.id}
                glowColor={skill.accent}
                maxTilt={9}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`cursor-pointer p-6 ${
                  isSelected ? 'ring-1 ring-purple-400/55' : ''
                }`}
              >
                <div className="flex h-full flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${ACCENT_ICON_BG[skill.accent]}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {skill.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {skill.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-purple-300/90">
                      {skill.descriptor}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {skill.focus}
                    </p>
                  </div>
                </div>
              </TiltCard3D>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
