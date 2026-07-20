'use client';

import { useTranslations } from 'next-intl';

export default function HistoryFallback() {
  const t = useTranslations('History');

  return <div className="p-4 text-neutral-400">{t('loading')}</div>;
}
