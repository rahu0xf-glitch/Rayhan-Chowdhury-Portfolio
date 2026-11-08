'use client';

import React, { useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownRight,
  Mail,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  HERO_CONTENT as DEFAULT_HERO_CONTENT,
  OFFICIAL_EMAIL,
  STORAGE_KEY_HERO,
  STORAGE_KEY_SOCIALS,
  INITIAL_SOCIAL_LINKS,
  SocialLinkItem,
} from '@/data/portfolio-data';
import { useLocalStorageState } from '@/hooks/use-local-storage';

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  TryHackMe: Shield,
  Facebook: Facebook,
  Instagram: Instagram,
  Email: Mail,
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [heroContent] = useLocalStorageState(
    STORAGE_KEY_HERO,
    DEFAULT_HERO_CONTENT
  );
  const [socialLinks] = useLocalStorageState<SocialLinkItem[]>(
    STORAGE_KEY_SOCIALS,
    INITIAL_SOCIAL_LINKS
  );

  const handleScrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  // Dynamic heading words for character-by-character kinetic reveal
  const titleWords = (heroContent.heading || 'RAYHAN CHOWDHURY')
    .toUpperCase()
    .split(' ')
    .filter(Boolean);

  const heroSocials = socialLinks.filter((s) => s.id !== 'soc-email');

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end pb-10 pt-24 sm:pb-14 lg:justify-center lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/*
          Composed in left negative space on desktop (max-w-[580px]) so Rayhan's face
          and upper body in the center-right frame remain completely unobstructed, crisp and clear.
          On mobile, positioned in the lower viewport with high readability.
        */}
        <div className="max-w-xl lg:max-w-[580px]">
          {/* Eyebrow with Animated Live Status Dot */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/35 backdrop-blur-md px-3.5 py-1.5 mb-4 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-white/95 uppercase">
              {heroContent.eyebrow}
            </span>
            <Sparkles className="h-3 w-3 text-red-200" aria-hidden="true" />
          </motion.div>

          {/* Main Heading: "RAYHAN CHOWDHURY" with Original Crisp White Color & Staggered 3D Kinetic Entrance */}
          <div className="relative">
            <h1
              className="relative hero-text-optical font-display text-4xl sm:text-6xl lg:text-[4.35rem] font-bold tracking-tight text-white leading-[1.03]"
              style={{ textWrap: 'balance' }}
            >
              <span className="sr-only">{heroContent.heading}</span>
              <span aria-hidden="true" className="flex flex-wrap gap-x-3.5 sm:gap-x-4">
                {titleWords.map((word, wordIdx) => (
                  <span key={`${word}-${wordIdx}`} className="inline-flex overflow-hidden">
                    {word.split('').map((char, charIdx) => {
                      const overallIdx = wordIdx * 10 + charIdx;
                      return (
                        <motion.span
                          key={`${word}-${charIdx}`}
                          initial={
                            prefersReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: 42,
                                  rotateX: -45,
                                  filter: 'blur(8px)',
                                }
                          }
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            filter: 'blur(0px)',
                          }}
                          transition={{
                            duration: 0.65,
                            delay: prefersReducedMotion ? 0 : 0.08 + overallIdx * 0.035,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="inline-block transform-gpu text-white hover:scale-105 transition-transform"
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Animated Tagline */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: prefersReducedMotion ? 0 : 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-3.5 sm:mt-4 flex items-center gap-2"
          >
            <p
              className="hero-text-optical font-display text-xl sm:text-2xl lg:text-[1.85rem] font-semibold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              {heroContent.tagline}
            </p>
          </motion.div>

          {/* Supporting Text in Liquid Glass Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: prefersReducedMotion ? 0 : 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-4 sm:mt-5 rounded-2xl liquid-glass-readable px-4 py-3.5 sm:px-5 sm:py-4 shadow-xl"
          >
            <p className="text-sm sm:text-base leading-relaxed text-white/95">
              {heroContent.supportingText}
            </p>
          </motion.div>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: prefersReducedMotion ? 0 : 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, 'about')}
              className="liquid-btn-primary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-900"
            >
              <span>{heroContent.primaryCta}</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="liquid-btn-secondary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Mail className="h-4 w-4 text-white/90" aria-hidden="true" />
              <span>{heroContent.secondaryCta}</span>
            </a>
          </motion.div>

          {/* Verified Social Quick-Dock Bar */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: prefersReducedMotion ? 0 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            <span className="text-xs font-mono text-white/70 mr-1 hidden sm:inline">
              Verified Profiles:
            </span>

            {heroSocials.map((item) => {
              const IconComp = SOCIAL_ICONS[item.platform] || ExternalLink;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open Rayhan's ${item.platform} profile`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 hover:bg-white/20 hover:border-white/50 px-3 py-1.5 text-xs text-white/90 hover:text-white transition-all backdrop-blur-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <IconComp className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-[11px] sm:text-xs">
                    {item.platform}
                  </span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
