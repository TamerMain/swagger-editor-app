'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/context/ToastContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  const { showErrorToast } = useToast();
  const hasShown = useRef(false);

  useEffect(() => {
    if (!hasShown.current) {
      hasShown.current = true;
      showErrorToast(error.message || t('fallback'));
    }
  }, [error, showErrorToast, t]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-2xl font-bold text-red-400 mb-4">{t('title')}</h1>
      <p className="text-gray-400 mb-6">{t('description')}</p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {t('tryAgain')}
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white inline-block"
        >
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
