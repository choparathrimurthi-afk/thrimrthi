import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Linkedin,
  Mail,
  Send,
} from 'lucide-react';
import { PORTFOLIO_OWNER } from '../data/portfolioData';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_OWNER.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard is restricted
      window.location.href = `mailto:${PORTFOLIO_OWNER.email}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please complete your name, email address, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    setError('');
  };

  const mailtoComposeUrl = `mailto:${PORTFOLIO_OWNER.email}?subject=${encodeURIComponent(
    `Portfolio Inquiry from ${name || 'Visitor'}`,
  )}&body=${encodeURIComponent(message ? `${message}\n\nFrom: ${name} (${email})` : '')}`;

  return (
    <section id="contact" className="py-20 sm:py-24 border-t border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-wider text-sky-400">
            06. Contact
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Let&apos;s connect &amp; build together
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            Open to collaborating on AI/ML experiments, student hackathons, and software projects.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl surface-glass p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/15 text-purple-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <a
                      href={`mailto:${PORTFOLIO_OWNER.email}`}
                      className="font-mono text-sm font-medium text-white hover:text-purple-300 transition-colors break-all"
                    >
                      {PORTFOLIO_OWNER.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-sky-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <a
              href={PORTFOLIO_OWNER.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl surface-glass-interactive p-6 group"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-500/15 text-sky-300">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">GitHub</p>
                  <p className="font-mono text-sm font-medium text-white group-hover:text-sky-300 transition-colors">
                    github.com/thrimurthi
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href={PORTFOLIO_OWNER.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl surface-glass-interactive p-6 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300 shrink-0">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">LinkedIn</p>
                  <p className="font-mono text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate">
                    in/thrimurthi-choppara-752005412
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors shrink-0 ml-2" />
            </a>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl surface-glass p-6 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/35 bg-sky-500/15 text-sky-300">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Message prepared for Ch. Thrimurthi
                  </h3>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">
                    Thanks, <span className="text-white font-medium">{name}</span>. Your note has
                    been recorded in this preview session. You can also dispatch it directly via
                    your default mail client below.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={mailtoComposeUrl}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-purple-500 hover:to-blue-500 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Open in Email Client
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Kumar"
                        required
                        className="mt-2 w-full rounded-xl border border-white/12 bg-[#080812]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        required
                        className="mt-2 w-full rounded-xl border border-white/12 bg-[#080812]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your project idea, hackathon team invite, or question..."
                      required
                      className="mt-2 w-full rounded-xl border border-white/12 bg-[#080812]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-y"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-rose-400">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-slate-400">
                      Direct reply to <span className="text-slate-200">{email || 'your inbox'}</span>
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-700/25 hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
