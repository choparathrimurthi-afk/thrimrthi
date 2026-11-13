import React, { useState } from 'react';
import { Terminal, X } from 'lucide-react';
import { PORTFOLIO_OWNER } from '../data/portfolioData';

export function Footer() {
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-[#070710] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-semibold text-white">
            {PORTFOLIO_OWNER.fullName}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {PORTFOLIO_OWNER.degree} · {PORTFOLIO_OWNER.university}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#education" className="hover:text-white transition-colors">
            Education
          </a>
          <button
            type="button"
            onClick={() => setSetupOpen(true)}
            className="inline-flex items-center gap-1.5 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            Local Run Guide
          </button>
        </div>
      </div>

      {/* Local Setup Instructions Modal */}
      {setupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="local-setup-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setSetupOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl surface-glass p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h3
                id="local-setup-title"
                className="font-display text-lg font-bold text-white"
              >
                Run Locally
              </h3>
              <button
                type="button"
                onClick={() => setSetupOpen(false)}
                aria-label="Close local setup guide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Prerequisites: Node.js 18+ and npm installed on your machine.
            </p>

            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#05050c] p-4 font-mono text-xs leading-relaxed text-sky-300">
{`# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev

# 3. Build production bundle
npm run build`}
            </pre>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSetupOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
