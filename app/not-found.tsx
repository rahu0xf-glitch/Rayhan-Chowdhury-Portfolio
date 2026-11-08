import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#d80006] text-white p-6 text-center">
      <div className="liquid-glass-readable rounded-3xl p-8 max-w-md w-full">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-white/80 mb-6">
          The requested page could not be located.
        </p>
        <Link
          href="/"
          className="liquid-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
