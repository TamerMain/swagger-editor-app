'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { setLocale } from '@/app/actions/locale';
import { LOCALES, type Locale } from '@/constants/constants';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as Locale;
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
  };

  return (
    <select
      aria-label={t('label')}
      value={locale}
      onChange={onChange}
      disabled={isPending}
      className="bg-neutral-800 text-neutral-100 text-sm rounded px-2 py-1 border border-neutral-700 disabled:opacity-50"
    >
      {LOCALES.map((code) => (
        <option key={code} value={code}>
          {t(`locale.${code}`)}
        </option>
      ))}
    </select>
  );
}
