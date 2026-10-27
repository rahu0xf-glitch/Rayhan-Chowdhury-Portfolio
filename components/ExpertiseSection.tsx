'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Shield,
  BrainCircuit,
  Code2,
  Cpu,
  Clapperboard,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import {
  INITIAL_EXPERTISE_DOMAINS,
  SKILL_STAGES,
  SkillStage,
  ExpertiseDomain,
} from '@/data/portfolio-data';

const STORAGE_KEY_EXPERTISE = 'rayhan_portfolio_expertise_v1';

const DOMAIN_ICONS = {
  shield: Shield,
  brain: BrainCircuit,
  code: Code2,
  cpu: Cpu,
  film: Clapperboard,
};

export default function ExpertiseSection() {
  const prefersReducedMotion = useReducedMotion();
  const [domains, setDomains, resetDomains] = useLocalStorageState<
    ExpertiseDomain[]
  >(STORAGE_KEY_EXPERTISE, INITIAL_EXPERTISE_DOMAINS);
  const [stageFilter, setStageFilter] = useState<'ALL' | SkillStage>('ALL');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [activeSkillNote, setActiveSkillNote] = useState<string | null>(null);

  const cycleSkillStage = (domainId: string, skillId: string) => {
    const targetDomain = domains.find((d) => d.id === domainId);
    const targetSkill = targetDomain?.skills.find((s) => s.id === skillId);
    if (targetSkill) {
      const currentIdx = SKILL_STAGES.indexOf(targetSkill.stage);
      const nextStage = SKILL_STAGES[(currentIdx + 1) % SKILL_STAGES.length];
      setActiveSkillNote(`${targetSkill.name} set to "${nextStage}"`);
      setDomains((prev) =>
        prev.map((domain) =>
          domain.id !== domainId
            ? domain
            : {
                ...domain,
                skills: domain.skills.map((skill) =>
                  skill.id === skillId ? { ...skill, stage: nextStage } : skill
                ),
              }
        )
      );
    }
  };

  const handleSkillClick = (
    domainId: string,
    skillId: string,
    skillName: string,
    stage: SkillStage
  ) => {
    if (editMode) {
      cycleSkillStage(domainId, skillId);
    } else {
      setActiveSkillNote(
        `${skillName} — Current stage: ${stage}. Enable "Edit Skill Levels" to customize.`
      );
    }
  };

  const handleResetStages = () => {
    resetDomains();
    setActiveSkillNote('Skill proficiency labels restored to defaults.');
  };

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="relative z-10 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header Panel */}
        <GlassSurface
          variant="readable"
          className="mb-8 sm:mb-10 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-wider text-white/70 mb-2">
                02 · Multidisciplinary Capabilities
              </p>
              <h2
                id="expertise-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Five Core Pillars of Exploration
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                Honest, evolving capability stages across security, intelligence,
                software engineering, computer systems, and visual media. Click
                any skill chip to inspect or customize its current stage.
              </p>
            </div>

            {/* Edit Skill Levels Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditMode((prev) => !prev);
                  setActiveSkillNote(null);
                }}
                aria-pressed={editMode}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  editMode
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'liquid-btn-secondary text-white'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {editMode ? 'Editing Levels (Click Any Skill)' : 'Edit Skill Levels'}
                </span>
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={handleResetStages}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Stage Filter Bar */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div
              role="group"
              aria-label="Filter skills by proficiency stage"
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`min-h-[36px] rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  stageFilter === 'ALL'
                    ? 'bg-white text-neutral-950 font-semibold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                All Stages
              </button>
              {SKILL_STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setStageFilter(stage)}
                  className={`min-h-[36px] rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    stageFilter === stage
                      ? 'bg-white text-neutral-950 font-semibold'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {activeSkillNote && (
              <p
                role="status"
                aria-live="polite"
                className="text-xs font-mono text-white/85"
              >
                {activeSkillNote}
              </p>
            )}
          </div>
        </GlassSurface>

        {/* Five Sculpted Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {domains.map((domain, idx) => {
            const IconComponent = DOMAIN_ICONS[domain.iconName];
            const filteredSkills =
              stageFilter === 'ALL'
                ? domain.skills
                : domain.skills.filter((s) => s.stage === stageFilter);

            // Staggered bento proportions across 6-col desktop grid so portrait breathes around panels
            const colSpanClass =
              idx < 2
                ? 'lg:col-span-3'
                : idx < 4
                ? 'lg:col-span-3'
                : 'md:col-span-2 lg:col-span-6';

            return (
              <motion.div
                key={domain.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.42,
                  delay: prefersReducedMotion ? 0 : idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={colSpanClass}
              >
                <GlassSurface
                  as="article"
                  variant="readable"
                  className="h-full p-6 sm:p-7 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-white/65 tabular-nums">
                        {domain.index} · {domain.subtitle}
                      </p>
                      <h3 className="font-display mt-1 text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {domain.title}
                      </h3>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-white/80 max-w-3xl">
                    {domain.description}
                  </p>

                  {/* Interactive Skill Chips */}
                  <div className="mt-5 pt-4 border-t border-white/12">
                    {filteredSkills.length === 0 ? (
                      <p className="text-xs text-white/60 py-2">
                        No skills in this pillar currently labeled &ldquo;
                        {stageFilter}&rdquo;.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() =>
                              handleSkillClick(
                                domain.id,
                                skill.id,
                                skill.name,
                                skill.stage
                              )
                            }
                            title={
                              editMode
                                ? `Click to cycle stage for ${skill.name}`
                                : `${skill.name} (${skill.stage})`
                            }
                            className={`group inline-flex min-h-[36px] items-center gap-2 rounded-xl px-3 py-1.5 text-left text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                              editMode
                                ? 'bg-white/18 border border-white/45 text-white hover:bg-white/28'
                                : 'bg-white/[0.08] border border-white/18 text-white/95 hover:bg-white/16 hover:border-white/35'
                            }`}
                          >
                            <span className="font-medium">{skill.name}</span>
                            <span
                              aria-hidden="true"
                              className="text-white/40"
                            >
                              ·
                            </span>
                            <span className="font-mono text-[11px] text-white/70 group-hover:text-white/90">
                              {skill.stage}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassSurface>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
