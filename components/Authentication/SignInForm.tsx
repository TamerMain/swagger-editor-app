'use client';

import { signIn } from '@/app/actions/auth';
import Link from 'next/link';
import { useState } from 'react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const signInError = await signIn(email, password);

      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }

      window.location.href = '/';
    } catch {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6 text-black">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border-3 border-blue-700 hover:border-blue-700 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link href="/signup" className="text-blue-600 hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </form>
  );
}
