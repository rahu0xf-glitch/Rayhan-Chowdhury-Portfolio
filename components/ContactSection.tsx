'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Mail,
  ArrowUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import { INITIAL_SOCIAL_LINKS, SocialLinkItem } from '@/data/portfolio-data';

const STORAGE_KEY_SOCIALS = 'rayhan_portfolio_socials_v1';

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
}

export default function ContactSection({
  portraitFocusMode,
  onTogglePortraitFocus,
}: ContactSectionProps) {
  const prefersReducedMotion = useReducedMotion();

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
  const [copied, setCopied] = useState<boolean>(false);

  const [socialLinks, setSocialLinks] = useLocalStorageState<SocialLinkItem[]>(
    STORAGE_KEY_SOCIALS,
    INITIAL_SOCIAL_LINKS
  );
  const [editingSocials, setEditingSocials] = useState<boolean>(false);

  const updateSocialItem = (
    id: string,
    field: 'handle' | 'url',
    value: string
  ) => {
    setSocialLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

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

    setPreparedDraft({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    });
    setCopied(false);
  };

  const handleCopyDraft = async () => {
    if (!preparedDraft) return;
    const formatted = `Subject: ${preparedDraft.subject}\nFrom: ${preparedDraft.name} <${preparedDraft.email}>\n\n${preparedDraft.message}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  // Resolve configured email if user set one in SocialLinks
  const configuredEmailItem = socialLinks.find((s) => s.id === 'soc-email');
  const rawEmailTarget = configuredEmailItem?.url
    ? configuredEmailItem.url.replace(/^mailto:/i, '').trim()
    : '';

  const mailtoHref = preparedDraft
    ? `mailto:${encodeURIComponent(rawEmailTarget)}?subject=${encodeURIComponent(
        preparedDraft.subject
      )}&body=${encodeURIComponent(
        `Name: ${preparedDraft.name}\nEmail: ${preparedDraft.email}\n\n${preparedDraft.message}`
      )}`
    : '#contact';

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 pt-20 pb-14 sm:pt-28 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Direct Channels & Configurable Socials */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <p className="font-mono text-xs tracking-wider text-white/70 mb-2">
                04 · Connect &amp; Collaborate
              </p>
              <h2
                id="contact-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Let&apos;s Start a Conversation.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                Interested in collaborating on software engineering, security
                research, data initiatives, or creative media? Reach out using
                the form or connect through direct channels below.
              </p>

              {/* Configurable Social Links */}
              <div className="mt-7 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-sm font-semibold text-white">
                    Social &amp; Direct Profiles
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingSocials((prev) => !prev)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/12 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{editingSocials ? 'Done' : 'Configure Links'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {socialLinks.map((soc) => {
                    const isEmail = soc.id === 'soc-email';
                    const resolvedHref = soc.url
                      ? isEmail && !soc.url.startsWith('mailto:')
                        ? `mailto:${soc.url}`
                        : soc.url
                      : '';

                    return (
                      <div
                        key={soc.id}
                        className="rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3"
                      >
                        {editingSocials ? (
                          <div className="space-y-2">
                            <p className="font-mono text-xs text-white/75">
                              {soc.platform}
                            </p>
                            <input
                              type="text"
                              value={soc.handle}
                              onChange={(e) =>
                                updateSocialItem(
                                  soc.id,
                                  'handle',
                                  e.target.value
                                )
                              }
                              aria-label={`${soc.platform} display label`}
                              placeholder="Display handle or label"
                              className="glass-input w-full rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={soc.url}
                              onChange={(e) =>
                                updateSocialItem(soc.id, 'url', e.target.value)
                              }
                              aria-label={`${soc.platform} URL or email`}
                              placeholder={
                                isEmail
                                  ? 'name@example.com'
                                  : 'https://...'
                              }
                              className="glass-input w-full rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-white/65">
                                {soc.platform}
                              </p>
                              <p className="text-sm font-medium text-white truncate">
                                {soc.handle}
                              </p>
                            </div>
                            {resolvedHref ? (
                              <a
                                href={resolvedHref}
                                target={isEmail ? undefined : '_blank'}
                                rel={
                                  isEmail ? undefined : 'noopener noreferrer'
                                }
                                aria-label={`Open ${soc.platform}`}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              >
                                <ExternalLink
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </a>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingSocials(true)}
                                className="text-xs font-mono text-white/65 hover:text-white underline underline-offset-4 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                              >
                                Set URL
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassSurface>
          </motion.div>

          {/* Right Column: Validated Glass Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold tracking-wide text-white/90 mb-2"
                    >
                      Name
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
                      placeholder="Your full name"
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
                      Email
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
                    Subject
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
                    placeholder="Project collaboration, inquiry, or opportunity"
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
                    Message
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
                  <p className="text-xs text-white/65">
                    Prepares a verified message draft for your mail client or
                    clipboard—no unconfigured silent server drops.
                  </p>

                  <button
                    type="submit"
                    className="liquid-btn-primary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>

              {/* Honest Delivery Action Panel */}
              {preparedDraft && (
                <div
                  role="region"
                  aria-live="polite"
                  className="mt-6 rounded-2xl border border-white/25 bg-white/[0.08] p-4 sm:p-5"
                >
                  <p className="text-sm font-semibold text-white">
                    Message Draft Ready to Dispatch
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/80">
                    Because a backend email relay is not yet connected, this
                    form does not falsely claim automatic delivery. Choose how
                    you would like to send your prepared message:
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={mailtoHref}
                      className="liquid-btn-primary inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Open in Email App</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="liquid-btn-secondary inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Formatted Message</span>
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
              &copy; {new Date().getFullYear()} Rayhan Chowdhury · Technology
              Beyond Boundaries.
            </p>

            <div className="flex items-center gap-4">
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
                    <span>Preview Pure Portrait</span>
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
