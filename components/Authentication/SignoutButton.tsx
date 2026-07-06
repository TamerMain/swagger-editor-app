'use client';

import { signOut } from '@/app/actions/auth';

export function SignOutButton() {

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <button onClick={handleSignOut} className="text-red-400 hover:text-red-300">
      Sign Out
    </button>
  );
}
