'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { PORTRAIT_IMAGE_PATH } from '@/data/portfolio-data';

interface PortraitBackgroundProps {
  portraitFocusMode: boolean;
}

export default function PortraitBackground({
  portraitFocusMode,
}: PortraitBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 h-[100lvh] w-screen overflow-hidden bg-[#ea0005] select-none pointer-events-none"
    >
      {/* Exact Uploaded Original Portrait Photograph — Zero Filters or Replacement */}
      <div className="relative h-full w-full">
        <Image
          src={PORTRAIT_IMAGE_PATH}
          alt="Rayhan Chowdhury portrait against vivid red studio background"
          fill
          priority
          quality={95}
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-[55%_16%] sm:object-[54%_18%] lg:object-[48%_16%] transition-transform duration-700 ease-out"
        />
      </div>

      {/* Ultra-subtle localized edge contrast veil ONLY along bottom/left edges when reading UI; completely transparent in Portrait Focus Mode */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          portraitFocusMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Mobile lower-half soft reading gradient so lower text stays crisp without touching upper face/head */}
        <div className="absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-t from-black/60 via-black/22 to-transparent lg:hidden" />

        {/* Desktop gentle left-column optical anchor leaving the vivid red field and subject completely vibrant */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[46%] bg-gradient-to-r from-black/24 via-black/8 to-transparent" />
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
