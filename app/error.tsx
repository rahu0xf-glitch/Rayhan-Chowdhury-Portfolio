'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Portfolio runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#d80006] px-6 text-white">
      <div className="liquid-glass-readable max-w-md rounded-3xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Unexpected Interface Error
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-white/80">
          Something interrupted rendering this view. You can safely reload the
          interface below.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="liquid-btn-primary mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold"
        >
          Reload Portfolio
        </button>
      </div>
    </div>
  );
}
