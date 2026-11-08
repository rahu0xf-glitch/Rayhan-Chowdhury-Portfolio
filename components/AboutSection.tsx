'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import {
  ABOUT_HEADING,
  ABOUT_DESCRIPTION,
  INITIAL_ABOUT_BLOCKS,
  AboutBlock,
  STORAGE_KEY_ABOUT_DESC,
  STORAGE_KEY_ABOUT_BLOCKS,
} from '@/data/portfolio-data';

export default function AboutSection() {
  const prefersReducedMotion = useReducedMotion();
  const [description] = useLocalStorageState<string>(
    STORAGE_KEY_ABOUT_DESC,
    ABOUT_DESCRIPTION
  );
  const [blocks] = useLocalStorageState<AboutBlock[]>(
    STORAGE_KEY_ABOUT_BLOCKS,
    INITIAL_ABOUT_BLOCKS
  );

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Asymmetric layout leaving center-right breathing space so the portrait remains clearly visible */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Primary Narrative Glass Panel */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <p className="font-mono text-xs tracking-wider text-white/70 mb-2">
                01 · Profile &amp; Direction
              </p>

              <h2
                id="about-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                {ABOUT_HEADING}
              </h2>

              <div className="mt-5">
                <p className="text-base sm:text-[17px] leading-relaxed text-white/90">
                  &ldquo;{description}&rdquo;
                </p>
              </div>
            </GlassSurface>
          </motion.div>

          {/* Intentional Portrait Breathing Column on Desktop (1 col spacer) + Pure Read-Only Profile Cards */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden="true" />

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.4,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  index === blocks.length - 1 ? 'sm:col-span-2' : 'col-span-1'
                }
              >
                <GlassSurface
                  as="article"
                  variant="readable"
                  className="h-full p-6 hover:-translate-y-0.5 transition-transform"
                >
                  <p className="font-mono text-xs text-white/65 mb-2">
                    {block.label}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-white tracking-tight">
                    {block.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                    {block.content}
                  </p>
                </GlassSurface>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
