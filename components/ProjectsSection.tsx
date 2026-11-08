'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ExternalLink,
  Github,
  FileText,
  X,
} from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import {
  INITIAL_PROJECTS,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectItem,
  STORAGE_KEY_PROJECTS,
} from '@/data/portfolio-data';
import { sanitizeUrl } from '@/lib/security';

function ProjectVisualArtwork({
  motif,
  title,
  customImageUrl,
}: {
  motif: ProjectItem['visualMotif'];
  title: string;
  customImageUrl?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (customImageUrl && !imgError) {
    return (
      <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/35">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customImageUrl}
          alt={`${title} preview`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.10] via-black/35 to-rose-950/50 flex items-center justify-center">
      {/* Subtle top-left specular gleam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-white/12 blur-2xl"
      />

      {motif === 'lattice' && (
        <svg
          viewBox="0 0 240 120"
          className="h-28 w-52 text-white/75"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="120" cy="60" r="38" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="120" cy="60" r="20" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.2" />
          <path
            d="M40 60H200M120 12V108M68 28L172 92M172 28L68 92"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <circle cx="120" cy="60" r="4" fill="currentColor" />
          <circle cx="82" cy="60" r="3" fill="currentColor" fillOpacity="0.7" />
          <circle cx="158" cy="60" r="3" fill="currentColor" fillOpacity="0.7" />
        </svg>
      )}

      {motif === 'neural' && (
        <svg
          viewBox="0 0 240 120"
          className="h-28 w-52 text-white/80"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 84C64 84 76 34 120 34C164 34 176 76 216 42"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
          <path
            d="M24 56C68 56 86 92 128 72C170 52 184 26 216 26"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <circle cx="62" cy="68" r="3.5" fill="currentColor" />
          <circle cx="120" cy="34" r="4.5" fill="currentColor" />
          <circle cx="168" cy="58" r="3.5" fill="currentColor" />
        </svg>
      )}

      {motif === 'interface' && (
        <svg
          viewBox="0 0 240 120"
          className="h-28 w-52 text-white/75"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="38"
            y="20"
            width="164"
            height="80"
            rx="10"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
          <line
            x1="38"
            y1="38"
            x2="202"
            y2="38"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <rect
            x="52"
            y="50"
            width="60"
            height="36"
            rx="5"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          <line x1="124" y1="56" x2="186" y2="56" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
          <line x1="124" y1="68" x2="174" y2="68" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
          <line x1="124" y1="80" x2="160" y2="80" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
        </svg>
      )}

      {motif === 'architecture' && (
        <svg
          viewBox="0 0 240 120"
          className="h-28 w-52 text-white/75"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            points="120,20 190,50 120,80 50,50"
            stroke="currentColor"
            strokeOpacity="0.65"
            strokeWidth="1.3"
          />
          <polyline
            points="50,66 120,96 190,66"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <polyline
            points="50,80 120,110 190,80"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.1"
          />
        </svg>
      )}

      {motif === 'prism' && (
        <svg
          viewBox="0 0 240 120"
          className="h-28 w-52 text-white/80"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            points="120,20 172,94 68,94"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="1.4"
          />
          <line
            x1="32"
            y1="66"
            x2="94"
            y2="57"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <line
            x1="146"
            y1="57"
            x2="208"
            y2="44"
            stroke="currentColor"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <line
            x1="152"
            y1="67"
            x2="208"
            y2="64"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <line
            x1="158"
            y1="77"
            x2="208"
            y2="84"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion();
  const [projects] = useLocalStorageState<ProjectItem[]>(
    STORAGE_KEY_PROJECTS,
    INITIAL_PROJECTS
  );
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>('All Projects');
  const [selectedCaseStudy, setSelectedCaseStudy] =
    useState<ProjectItem | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCaseStudy(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const visibleProjects =
    activeCategory === 'All Projects'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-10 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header & Category Filter Bar */}
        <GlassSurface
          variant="readable"
          className="mb-8 sm:mb-10 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-wider text-white/70 mb-2">
                03 · Selected Works &amp; Labs
              </p>
              <h2
                id="projects-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Project Showcase
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                Structured across cybersecurity labs, intelligent data workflows,
                full-stack software, and creative digital media.
              </p>
            </div>
          </div>

          {/* Segmented Category Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-1.5"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isSelected
                      ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </GlassSurface>

        {/* Project Cards Grid */}
        {visibleProjects.length === 0 ? (
          <GlassSurface variant="readable" className="p-10 text-center">
            <p className="text-base font-medium text-white">
              No projects in &ldquo;{activeCategory}&rdquo; yet.
            </p>
          </GlassSurface>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.4,
                  delay: prefersReducedMotion ? 0 : index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <GlassSurface
                  as="article"
                  variant="readable"
                  className="flex h-full flex-col p-5 sm:p-6 hover:-translate-y-1 transition-transform"
                >
                  <ProjectVisualArtwork
                    motif={project.visualMotif}
                    title={project.title}
                    customImageUrl={project.customImageUrl}
                  />

                  {/* Category & Live Indicator Badge */}
                  <div className="mt-4 flex items-center justify-between gap-2 text-xs text-white/70">
                    <span className="font-mono text-xs">{project.category}</span>
                    {project.liveUrl && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span>Live on Vercel</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <h3 className="font-display mt-2 text-lg sm:text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-white/80 flex-1">
                    {project.summary}
                  </p>

                  {/* Unboxed Technologies List */}
                  {project.technologies.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-white/12 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-white/70">
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={`${project.id}-${tech}`}>
                          <span>{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-white/35">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Project Links: View Project, GitHub, Case Study */}
                  <div className="mt-5 pt-3.5 border-t border-white/12 flex flex-wrap items-center gap-2.5">
                    {project.liveUrl && (
                      <a
                        href={sanitizeUrl(project.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="liquid-btn-primary inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Visit Live Website</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={sanitizeUrl(project.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/14 px-3.5 py-1.5 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <Github className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>GitHub</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedCaseStudy(project)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/14 px-3.5 py-1.5 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Case Study</span>
                    </button>
                  </div>
                </GlassSurface>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Lightbox Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCaseStudy(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="liquid-glass-readable max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-white/70">
                    {selectedCaseStudy.category} · Case Study
                  </p>
                  <h3
                    id="case-study-modal-title"
                    className="font-display mt-1 text-2xl font-bold text-white"
                  >
                    {selectedCaseStudy.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCaseStudy(null)}
                  aria-label="Close case study"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5">
                <ProjectVisualArtwork
                  motif={selectedCaseStudy.visualMotif}
                  title={selectedCaseStudy.title}
                  customImageUrl={selectedCaseStudy.customImageUrl}
                />
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="font-display text-sm font-semibold text-white">
                    Overview
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                    {selectedCaseStudy.caseStudyOverview}
                  </p>
                </div>

                {selectedCaseStudy.caseStudyObjectives.length > 0 && (
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white">
                      Key Objectives &amp; Scope
                    </h4>
                    <ul className="mt-2 space-y-2 text-sm text-white/80 list-disc pl-5">
                      {selectedCaseStudy.caseStudyObjectives.map((obj, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white/70">
                    {selectedCaseStudy.technologies.join(' · ')}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {selectedCaseStudy.caseStudyUrl && (
                      <a
                        href={sanitizeUrl(selectedCaseStudy.caseStudyUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="liquid-btn-primary inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Full Write-Up</span>
                      </a>
                    )}

                    {selectedCaseStudy.liveUrl && (
                      <a
                        href={sanitizeUrl(selectedCaseStudy.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="liquid-btn-secondary inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>View Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
