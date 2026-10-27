'use client';

import React, { useRef, useState, useCallback } from 'react';

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'readable';
  interactiveGlow?: boolean;
  as?: 'div' | 'article' | 'section' | 'aside';
}

export default function GlassSurface({
  children,
  className = '',
  variant = 'readable',
  interactiveGlow = true,
  as: Component = 'div',
}: GlassSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [glowCoords, setGlowCoords] = useState<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: 50,
    y: 20,
    active: false,
  });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactiveGlow || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowCoords({ x, y, active: true });
    },
    [interactiveGlow]
  );

  const handlePointerLeave = useCallback(() => {
    if (!interactiveGlow) return;
    setGlowCoords((prev) => ({ ...prev, active: false }));
  }, [interactiveGlow]);

  const baseClass =
    variant === 'readable' ? 'liquid-glass-readable' : 'liquid-glass';

  return (
    <Component
      ref={containerRef as React.RefObject<never>}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden rounded-3xl transition-transform duration-200 ease-out ${baseClass} ${className}`}
    >
      {/* Top water-droplet meniscus specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />

      {/* Subtle bottom crimson bounce reflection from the red studio backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-400/35 to-transparent"
      />

      {/* Pointer-responsive liquid caustic reflection on desktop */}
      {interactiveGlow && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 ${
            glowCoords.active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(380px circle at ${glowCoords.x}% ${glowCoords.y}%, rgba(255,255,255,0.13), rgba(255,90,95,0.05) 42%, transparent 72%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </Component>
  );
}
