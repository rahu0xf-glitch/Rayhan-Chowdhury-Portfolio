'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import PortraitBackground from '@/components/PortraitBackground';
import GlassNavbar from '@/components/GlassNavbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';

export default function PortfolioShell() {
  const [portraitFocusMode, setPortraitFocusMode] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      {/* Continuous Exact Uploaded Portrait Background */}
      <PortraitBackground portraitFocusMode={portraitFocusMode} />

      {/* Restore UI Floating Pill when User Activates Pure Portrait Preview */}
      {portraitFocusMode && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            type="button"
            onClick={() => setPortraitFocusMode(false)}
            className="liquid-btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span>Show Portfolio Interface</span>
          </button>
        </div>
      )}

      {/* Floating Liquid-Glass Navigation */}
      <div
        className={`transition-opacity duration-500 ${
          portraitFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <GlassNavbar />
      </div>

      {/* Sculpted Water-Glass Content Sections Floating Above the Continuous Portrait */}
      <main
        id="main-content"
        className={`relative z-10 transition-opacity duration-500 ${
          portraitFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <HeroSection />
        <AboutSection />
        <ExpertiseSection />
        <ProjectsSection />
        <ContactSection
          portraitFocusMode={portraitFocusMode}
          onTogglePortraitFocus={() => setPortraitFocusMode((prev) => !prev)}
        />
      </main>
    </div>
  );
}
