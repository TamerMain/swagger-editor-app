'use client';

import { SignOutButton } from './Authentication/SignoutButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const supabase = createClient();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className={`sticky flex justify-center h-full max-h-[5vh] ${isSticky && '-mt-[4vh] hover:mt-0'} z-50 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700 transition-all`}
    >
      <div className="w-[80vw] mx-auto px-4 flex items-center justify-between self-center">
        <Link href="/" className="font-bold text-white">
          Swagger UI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-white hover:text-blue-400">
            About
          </Link>

          {user ? (
            <>
              <Link href="/history" className="text-white hover:text-blue-400">
                History
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-3 py-0.5 rounded border-2 border-blue-500 hover:border-blue-600 hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-0.5 rounded border-2 border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
