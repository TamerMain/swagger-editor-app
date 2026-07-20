'use client';

import { signOut } from '@/app/actions/auth';
import { useTranslations } from 'next-intl';

export function SignOutButton() {
  const t = useTranslations('Header');
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <button onClick={handleSignOut} className="text-red-400 hover:text-red-300">
      {t('signOut')}
    </button>
  );
}
