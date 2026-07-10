'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useToast } from '@/lib/context/ToastContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showErrorToast } = useToast();
  const hasShown = useRef(false);

  useEffect(() => {
    if (!hasShown.current) {
      hasShown.current = true;
      showErrorToast(error.message || 'Something went wrong');
    }
  }, [error, showErrorToast]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-2xl font-bold text-red-400 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-400 mb-6">Please try again or go back home.</p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white inline-block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
