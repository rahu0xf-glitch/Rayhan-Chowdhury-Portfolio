'use client';

import React, { useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, Mail } from 'lucide-react';
import { HERO_CONTENT } from '@/data/portfolio-data';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end pb-10 pt-24 sm:pb-14 lg:justify-center lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/*
          Composed in left negative space on desktop (max-w-[540px]) so Sayed Hasan's face
          and upper body in the right-center frame remain completely clear and prominent.
          On mobile, positioned cleanly in the lower viewport below his face and upper chest.
        */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl lg:max-w-[540px]"
        >
          {/* Small Eyebrow */}
          <p className="hero-text-optical font-mono text-[11px] sm:text-xs font-medium tracking-[0.22em] text-white/90 mb-3 sm:mb-4">
            {HERO_CONTENT.eyebrow}
          </p>

          {/* Main Heading */}
          <h1
            className="hero-text-optical font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-white leading-[1.04]"
            style={{ textWrap: 'balance' }}
          >
            {HERO_CONTENT.heading}
          </h1>

          {/* Tagline */}
          <p
            className="hero-text-optical font-display mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white/95"
            style={{ textWrap: 'balance' }}
          >
            {HERO_CONTENT.tagline}
          </p>

          {/* Supporting Text wrapped in a subtle translucent water-glass strip on mobile/desktop for effortless WCAG contrast */}
          <div className="mt-4 sm:mt-5 rounded-2xl liquid-glass-readable px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-sm sm:text-base leading-relaxed text-white/90">
              {HERO_CONTENT.supportingText}
            </p>
          </div>

          {/* Primary & Secondary Liquid-Glass CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, 'about')}
              className="liquid-btn-primary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-900"
            >
              <span>{HERO_CONTENT.primaryCta}</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="liquid-btn-secondary inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Mail className="h-4 w-4 text-white/85" aria-hidden="true" />
              <span>{HERO_CONTENT.secondaryCta}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
