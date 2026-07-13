'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSticky(false);
    const containers = document.querySelectorAll('.scroll-container');
    let timer: NodeJS.Timeout;

    const onScroll = () => {
      timer = setTimeout(() => {
        const atBottom = Array.from(containers).some(
          (el) => el.scrollTop + el.clientHeight >= el.scrollHeight - 200,
        );
        setIsSticky(atBottom);
      }, 100);
    };

    containers.forEach((el) => el.addEventListener('scroll', onScroll));
    return () => {
      clearTimeout(timer);
      containers.forEach((el) => el.removeEventListener('scroll', onScroll));
    };
  }, [pathname]);

  return (
    <>
      {isSticky && (
        <footer
          className={`flex h-[4vh] bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-700 mt-auto`}
        >
          <div className="w-[80vw] mx-auto px-4 flex items-center justify-between self-center">
            <span className="text-sm text-neutral-300">
              {t('copyright', { year: String(new Date().getFullYear()) })}
            </span>

            <Link
              href="/about"
              className="text-sm text-neutral-300 hover:text-white transition"
            >
              {t('about')}
            </Link>
          </div>
        </footer>
      )}
    </>
  );
}
