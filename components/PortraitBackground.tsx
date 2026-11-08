'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { PORTRAIT_IMAGE_PATH } from '@/data/portfolio-data';

interface PortraitBackgroundProps {
  portraitFocusMode: boolean;
  isDarkMode?: boolean;
}

export default function PortraitBackground({
  portraitFocusMode,
  isDarkMode = false,
}: PortraitBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 h-[100lvh] w-screen overflow-hidden select-none pointer-events-none transition-colors duration-700 ${
        isDarkMode ? 'bg-[#080204]' : 'bg-[#ea0005]'
      }`}
    >
      {/* Exact Uploaded Original Portrait Photograph — HD 4K Quality with Eye-Comfort Dark Mode */}
      <div className="relative h-full w-full">
        <Image
          src={PORTRAIT_IMAGE_PATH}
          alt="Rayhan Chowdhury portrait"
          fill
          priority
          quality={100}
          sizes="100vw"
          referrerPolicy="no-referrer"
          className={`object-cover object-[55%_16%] sm:object-[54%_18%] lg:object-[48%_16%] transition-all duration-700 ease-out ${
            isDarkMode
              ? 'brightness-[0.42] contrast-[1.08] saturate-[0.75]'
              : 'contrast-[1.04] saturate-[1.04] brightness-[1.02]'
          }`}
          style={{
            imageRendering: 'auto',
          }}
        />
      </div>

      {/* Eye Comfort Deep Night Overlay when Dark Mode is active */}
      {isDarkMode && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#080204]/90 pointer-events-none transition-opacity duration-700"
        />
      )}

      {/* Crystal Clear Minimalist Edge Balance — Keeps face and vivid red field razor sharp and unobstructed */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          portraitFocusMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Mobile lower-half soft reading gradient so lower text stays crisp without touching upper face/head */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/40 via-black/15 to-transparent lg:hidden" />

        {/* Desktop ultra-gentle left-column optical anchor leaving the vivid red field and subject 100% crisp */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-black/18 via-black/5 to-transparent" />
      </div>

      {/* Restrained Floating Water-Drop Liquid Glass Orbs in Negative Space */}
      {!portraitFocusMode && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -14, 0], x: [0, 6, 0] }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="water-orb hidden md:block absolute top-[20%] right-[9%] h-14 w-14 rounded-full opacity-80"
          />
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 12, 0], x: [0, -8, 0] }
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            className="water-orb hidden lg:block absolute bottom-[22%] right-[16%] h-8 w-8 rounded-full opacity-70"
          />
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -10, 0] }
            }
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
            className="water-orb hidden xl:block absolute top-[15%] left-[36%] h-6 w-6 rounded-full opacity-65"
          />
        </div>
      )}
    </div>
  );
}
