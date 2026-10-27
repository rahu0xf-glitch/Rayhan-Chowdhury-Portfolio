'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pencil, Check, RotateCcw } from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import {
  ABOUT_HEADING,
  ABOUT_DESCRIPTION,
  INITIAL_ABOUT_BLOCKS,
  AboutBlock,
} from '@/data/portfolio-data';

const STORAGE_KEY_BLOCKS = 'rayhan_portfolio_about_blocks_v1';
const STORAGE_KEY_DESC = 'rayhan_portfolio_about_desc_v1';

export default function AboutSection() {
  const prefersReducedMotion = useReducedMotion();
  const [description, setDescription, resetDescription] =
    useLocalStorageState<string>(STORAGE_KEY_DESC, ABOUT_DESCRIPTION);
  const [blocks, setBlocks, resetBlocks] = useLocalStorageState<AboutBlock[]>(
    STORAGE_KEY_BLOCKS,
    INITIAL_ABOUT_BLOCKS
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleBlockChange = (
    id: string,
    field: 'title' | 'content',
    value: string
  ) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleReset = () => {
    resetDescription();
    resetBlocks();
  };

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
                {isEditing ? (
                  <div>
                    <label
                      htmlFor="about-main-bio"
                      className="block text-xs font-medium text-white/75 mb-1.5"
                    >
                      Primary Introduction Quote
                    </label>
                    <textarea
                      id="about-main-bio"
                      rows={4}
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-white leading-relaxed"
                    />
                  </div>
                ) : (
                  <p className="text-base sm:text-[17px] leading-relaxed text-white/90">
                    &ldquo;{description}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-7 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="liquid-btn-secondary inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {isEditing ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Customize Profile</span>
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset Default</span>
                  </button>
                )}
              </div>
            </GlassSurface>
          </motion.div>

          {/* Intentional Portrait Breathing Column on Desktop (1 col spacer) + Editable Profile Cards */}
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
                  className="h-full p-6 hover:-translate-y-0.5"
                >
                  <p className="font-mono text-xs text-white/65 mb-2">
                    {block.label}
                  </p>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`title-${block.id}`}
                          className="sr-only"
                        >
                          {block.label} Heading
                        </label>
                        <input
                          id={`title-${block.id}`}
                          type="text"
                          value={block.title}
                          onChange={(e) =>
                            handleBlockChange(block.id, 'title', e.target.value)
                          }
                          className="glass-input w-full rounded-xl px-3 py-2 text-sm font-semibold text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`content-${block.id}`}
                          className="sr-only"
                        >
                          {block.label} Details
                        </label>
                        <textarea
                          id={`content-${block.id}`}
                          rows={4}
                          value={block.content}
                          onChange={(e) =>
                            handleBlockChange(
                              block.id,
                              'content',
                              e.target.value
                            )
                          }
                          className="glass-input w-full rounded-xl px-3 py-2 text-sm text-white/90 leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-lg font-semibold text-white tracking-tight">
                        {block.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                        {block.content}
                      </p>
                    </>
                  )}
                </GlassSurface>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
