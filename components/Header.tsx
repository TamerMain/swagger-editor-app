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
    console.log("1");
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-white hover:text-blue-400">
          Swagger UI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>

          {user ? (
            <>
              <Link href="/history" className="text-gray-300 hover:text-white">
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
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
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
