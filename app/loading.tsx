export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen w-full items-center justify-center bg-[#d80006] px-6 text-white"
    >
      <div className="liquid-glass-readable rounded-3xl px-8 py-6 text-center">
        <p className="font-display text-lg font-semibold tracking-tight">
          RAYHAN CHOWDHURY
        </p>
        <p className="mt-1 font-mono text-xs text-white/75">
          Preparing portfolio experience...
        </p>
      </div>
    </div>
  );
}
