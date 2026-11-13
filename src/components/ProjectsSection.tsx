import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code2, ExternalLink, Layers, X } from 'lucide-react';
import { PROJECTS_DATA, type ProjectItem } from '../data/portfolioData';
import { TiltCard3D } from './TiltCard3D';

function ProjectArtwork({ project }: { project: ProjectItem }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#13132b] via-[#1c133a] to-[#0a1326] p-6 text-center">
        <Layers className="h-8 w-8 text-purple-300/80" aria-hidden="true" />
        <p className="mt-2 font-display text-sm font-semibold text-slate-200">
          {project.title}
        </p>
      </div>
    );
  }

  return (
    <img
      src={project.imageUrl}
      alt={`${project.title} 3D architectural preview`}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-medium tracking-wider text-purple-400">
            03. Selected Work
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Projects built to solve real problems
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            Practical systems and interactive web experiences crafted while exploring AI, emergency
            workflows, sustainability, and 3D browser graphics.
          </p>
        </motion.div>

        {/* 3D Interactive Project Cards */}
        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_DATA.map((project) => (
            <TiltCard3D
              key={project.id}
              glowColor={project.accent}
              maxTilt={7}
              className="group flex flex-col"
            >
              <article className="flex h-full flex-col justify-between">
                <div>
                  {/* 16:9 Project Visual */}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-[#0b0b18]">
                    <ProjectArtwork project={project} />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b18] via-transparent to-transparent opacity-75"
                    />
                  </div>

                  {/* Card Copy */}
                  <div className="p-6">
                    <p className="font-mono text-xs text-sky-400">{project.subtitle}</p>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-white leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {project.description}
                    </p>

                    {/* Clean Unboxed Tech Stack with typographic separators (no pills) */}
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-[11px] font-medium text-slate-400">Technology Stack</p>
                      <p className="mt-1 font-mono text-xs leading-relaxed text-purple-200/90">
                        {project.techStack.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-6 pb-6 pt-1">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-purple-400/35 bg-purple-600/20 px-4 py-2.5 text-xs font-semibold text-white hover:border-purple-400 hover:bg-purple-600/35 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                    GitHub Repository
                    <ExternalLink className="h-3 w-3 opacity-80" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </article>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {/* Project Architecture Details Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setActiveProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl surface-glass overflow-hidden"
          >
            <div className="relative aspect-video w-full border-b border-white/10 bg-[#0b0b18]">
              <ProjectArtwork project={activeProject} />
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label="Close project details"
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#080812]/85 text-white hover:bg-[#080812] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <p className="font-mono text-xs text-sky-400">{activeProject.subtitle}</p>
                <h3
                  id="project-modal-title"
                  className="mt-1 font-display text-2xl font-bold text-white"
                >
                  {activeProject.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {activeProject.description}
              </p>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-purple-300">System Architecture</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {activeProject.architectureNote}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Technologies Used</p>
                <p className="mt-1 font-mono text-xs text-slate-200">
                  {activeProject.techStack.join(' · ')}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-xs font-semibold text-white hover:from-purple-500 hover:to-blue-500 transition-colors"
                >
                  Open on GitHub
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
