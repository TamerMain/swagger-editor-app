"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-white">
          Swagger UI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-neutral-300 hover:text-white">
            About
          </Link>

          {user ? (
            <>
              <Link href="/history" className="text-neutral-300 hover:text-white">
                History
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 rounded border-2 border-blue-700 hover:border-blue-700/70 hover:text-blue-300">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 rounded border-2 border-blue-700 bg-blue-900 text-white hover:border-blue-700/70 hover:bg-blue-900/70"
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
