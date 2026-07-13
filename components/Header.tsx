'use client';

import { SignOutButton } from './Authentication/SignoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const { user } = useAuth();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    setIsSticky(false);
    const containers = document.querySelectorAll('.scroll-container');
    let timer: NodeJS.Timeout;

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsSticky(Array.from(containers).some((el) => el.scrollTop > 0));
      }, 100);
    };

    containers.forEach((el) => el.addEventListener('scroll', onScroll));
    return () => {
      clearTimeout(timer);
      containers.forEach((el) => el.removeEventListener('scroll', onScroll));
    };
  }, [pathname]);

  return (
    <nav
      className={`sticky flex justify-center h-full ${isSticky ? 'max-h-[3vh] hover:max-h-[5vh]' : 'max-h-[5vh]'} z-50 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700 transition-all`}
    >
      <div className="w-[80vw] mx-auto px-4 flex items-center justify-between self-center">
        <Link href="/" className="font-bold text-white">
          Swagger UI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <LanguageSwitcher />

          <Link href="/about" className="text-white hover:text-blue-400">
            {t('about')}
          </Link>
          {user ? (
            <>
              <Link href="/history" className="text-white hover:text-blue-400">
                {t('history')}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`px-3 ${isSticky ? '' : 'py-0.5'} rounded border-2 border-blue-500 hover:border-blue-600 hover:text-blue-400`}
              >
                {t('signIn')}
              </Link>
              <Link
                href="/signup"
                className={`px-3 ${isSticky ? '' : 'py-0.5'} rounded border-2 border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700`}
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
