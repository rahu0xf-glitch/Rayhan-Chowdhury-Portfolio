'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  Mail,
  ArrowUp,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import {
  OFFICIAL_EMAIL,
  STORAGE_KEY_SOCIALS,
  INITIAL_SOCIAL_LINKS,
  SocialLinkItem,
} from '@/data/portfolio-data';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import { sanitizeInput, sanitizeUrl } from '@/lib/security';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactSectionProps {
  portraitFocusMode: boolean;
  onTogglePortraitFocus: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  TryHackMe: Shield,
  Facebook: Facebook,
  Instagram: Instagram,
  Email: Mail,
};

export default function ContactSection({
  portraitFocusMode,
  onTogglePortraitFocus,
  isDarkMode = false,
  onToggleDarkMode,
}: ContactSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [socialLinks] = useLocalStorageState<SocialLinkItem[]>(
    STORAGE_KEY_SOCIALS,
    INITIAL_SOCIAL_LINKS
  );

  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [preparedDraft, setPreparedDraft] = useState<ContactFormValues | null>(
    null
  );
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Dynamic official email if configured in social links, fallback to constant
  const emailItem = socialLinks.find((s) => s.id === 'soc-email');
  const targetEmail = emailItem?.handle || OFFICIAL_EMAIL;

  const validate = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    if (values.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (values.subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a clear subject line.';
    }
    if (values.message.trim().length < 10) {
      nextErrors.message =
        'Please write a brief message (at least 10 characters).';
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setPreparedDraft(null);
      return;
    }

    const draft = {
      name: sanitizeInput(values.name, 100),
      // Remove CRLF line breaks from email and subject to prevent mail header injection (OWASP A03)
      email: values.email.trim().replace(/[\r\n]/g, '').slice(0, 100),
      subject: values.subject.trim().replace(/[\r\n]/g, '').slice(0, 150),
      message: sanitizeInput(values.message, 3000),
    };
    setPreparedDraft(draft);
    setCopiedDraft(false);

    // Open mail client addressed directly to official email
    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(
      draft.subject
    )}&body=${encodeURIComponent(
      `Hello Rayhan,\n\n${draft.message}\n\n---\nFrom: ${draft.name}\nEmail: ${draft.email}`
    )}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(targetEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  const handleCopyDraft = async () => {
    if (!preparedDraft) return;
    const formatted = `To: ${targetEmail}\nSubject: ${preparedDraft.subject}\nFrom: ${preparedDraft.name} <${preparedDraft.email}>\n\n${preparedDraft.message}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    } catch {
      // Fallback
    }
  };

  const mailtoHref = preparedDraft
    ? `mailto:${targetEmail}?subject=${encodeURIComponent(
        preparedDraft.subject
      )}&body=${encodeURIComponent(
        `Hello Rayhan,\n\n${preparedDraft.message}\n\n---\nFrom: ${preparedDraft.name}\nEmail: ${preparedDraft.email}`
      )}`
    : `mailto:${targetEmail}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 pt-20 pb-14 sm:pt-28 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Direct Channels & Verified Permanent Profiles */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/40 px-3 py-1 mb-3 text-emerald-300 font-mono text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>04 · Official Channels</span>
              </div>

              <h2
                id="contact-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Let&apos;s Connect Directly.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                Whether you want to discuss Cybersecurity, TryHackMe labs, AI
                automation, MERN stack software, or creative projects, connect
                through the official direct email and verified profiles below.
              </p>

              {/* Primary Direct Email Spotlight Card */}
              <div className="mt-6 rounded-2xl border border-white/25 bg-gradient-to-br from-white/[0.12] to-black/40 p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white border border-white/30">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-white/70">
                        Primary Official Mailbox
                      </p>
                      <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                        {targetEmail}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-200 border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Real &amp; Verified</span>
                  </span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center gap-2.5">
                  <a
                    href={`mailto:${targetEmail}`}
                    className="liquid-btn-primary inline-flex min-h-[38px] items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Send Email Now</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="liquid-btn-secondary inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white whitespace-nowrap shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                        <span className="text-emerald-200">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Verified Permanent Social Channels List (Pure Clickable, Controlled via Admin) */}
              <div className="mt-7 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-sm font-semibold text-white">
                    Verified Social &amp; Lab Profiles
                  </span>
                  <span className="text-[11px] font-mono text-white/60">
                    {socialLinks.length} Channels
                  </span>
                </div>

                <div className="space-y-2.5">
                  {socialLinks.map((item) => {
                    const IconComponent = SOCIAL_ICONS[item.platform] || ExternalLink;
                    const isEmail = item.id === 'soc-email';

                    return (
                      <a
                        key={item.id}
                        href={sanitizeUrl(item.url)}
                        target={isEmail ? undefined : '_blank'}
                        rel={isEmail ? undefined : 'noopener noreferrer'}
                        className="group block rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/40 p-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 text-white transition-colors">
                              <IconComponent className="h-4 w-4 transition-transform group-hover:scale-110" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-display text-sm font-semibold text-white">
                                  {item.platform}
                                </p>
                                {item.badge && (
                                  <span className="font-mono text-[10px] text-white/60">
                                    · {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-mono text-white/75 truncate mt-0.5">
                                {item.handle}
                              </p>
                            </div>
                          </div>

                          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white text-white group-hover:text-black transition-all">
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </GlassSurface>
          </motion.div>

          {/* Right Column: Direct Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-7"
          >
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="mb-5 pb-4 border-b border-white/15">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Write Directly to Rayhan
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                  Submitting this form dispatches your message directly to{' '}
                  <strong className="text-white font-mono">{targetEmail}</strong>{' '}
                  using your default email client or clipboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold tracking-wide text-white/90 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? 'contact-name-error' : undefined
                      }
                      onChange={(e) => {
                        setValues((v) => ({ ...v, name: e.target.value }));
                        if (errors.name)
                          setErrors((er) => ({ ...er, name: undefined }));
                      }}
                      placeholder="e.g. Alex Rahman"
                      className="glass-input min-h-[46px] w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40"
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="mt-1.5 text-xs text-rose-200"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold tracking-wide text-white/90 mb-2"
                    >
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? 'contact-email-error' : undefined
                      }
                      onChange={(e) => {
                        setValues((v) => ({ ...v, email: e.target.value }));
                        if (errors.email)
                          setErrors((er) => ({ ...er, email: undefined }));
                      }}
                      placeholder="you@example.com"
                      className="glass-input min-h-[46px] w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40"
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="mt-1.5 text-xs text-rose-200"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold tracking-wide text-white/90 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={values.subject}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? 'contact-subject-error' : undefined
                    }
                    onChange={(e) => {
                      setValues((v) => ({ ...v, subject: e.target.value }));
                      if (errors.subject)
                        setErrors((er) => ({ ...er, subject: undefined }));
                    }}
                    placeholder="Cybersecurity collaboration, software project, or inquiry"
                    className="glass-input min-h-[46px] w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40"
                  />
                  {errors.subject && (
                    <p
                      id="contact-subject-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-200"
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold tracking-wide text-white/90 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : undefined
                    }
                    onChange={(e) => {
                      setValues((v) => ({ ...v, message: e.target.value }));
                      if (errors.message)
                        setErrors((er) => ({ ...er, message: undefined }));
                    }}
                    placeholder="Write your message here..."
                    className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 leading-relaxed"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-200"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <p className="text-xs text-white/70">
                    Recipient target:{' '}
                    <span className="font-mono text-white underline">
                      {targetEmail}
                    </span>
                  </p>

                  <button
                    type="submit"
                    className="liquid-btn-primary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message to Rayhan</span>
                  </button>
                </div>
              </form>

              {/* Delivery Action Panel */}
              {preparedDraft && (
                <div
                  role="region"
                  aria-live="polite"
                  className="mt-6 rounded-2xl border border-white/25 bg-white/[0.08] p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-sm font-semibold text-white">
                      Draft Prepared for {targetEmail}
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/80">
                    If your email app did not open automatically, click below to launch it or copy the full formatted text:
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={mailtoHref}
                      className="liquid-btn-primary inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Open in Mail App</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="liquid-btn-secondary inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                          <span>Copied Formatted Message!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Message Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </GlassSurface>
          </motion.div>
        </div>

        {/* Minimalist Quiet Footer */}
        <footer className="mt-16 sm:mt-24">
          <div className="liquid-glass-readable rounded-full px-5 py-3.5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/75">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Rayhan Chowdhury · Contact:{' '}
              <a
                href={`mailto:${targetEmail}`}
                className="text-white underline underline-offset-2 hover:text-white font-mono"
              >
                {targetEmail}
              </a>
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {onToggleDarkMode && (
                <>
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                        <span>Vivid Red Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-white/90" aria-hidden="true" />
                        <span>Eye-Comfort Dark Mode</span>
                      </>
                    )}
                  </button>

                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                </>
              )}

              <button
                type="button"
                onClick={onTogglePortraitFocus}
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                {portraitFocusMode ? (
                  <>
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Restore Glass Interface</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>HD 4K Pure Portrait View</span>
                  </>
                )}
              </button>

              <span aria-hidden="true" className="text-white/30">
                ·
              </span>

              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                <span>Top</span>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
