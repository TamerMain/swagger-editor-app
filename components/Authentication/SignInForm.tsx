'use client';

import { signIn, type AuthActionError } from '@/app/actions/auth';
import { validateEmail, validatePassword } from '@/lib/validation/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export function SignInForm() {
  const t = useTranslations('Auth');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthActionError[]>([]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const invalid = [...validateEmail(email), ...validatePassword(password)];
    if (invalid.length > 0) {
      setErrors(invalid);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const code = await signIn(email, password);
      if (code) {
        setErrors([code]);
        setLoading(false);
        return;
      }
      window.location.href = '/';
    } catch {
      setErrors(['unknown']);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} noValidate className="space-y-6 text-black">
      {errors.length > 0 && (
        <ul className="bg-red-50 text-red-600 p-3 rounded text-sm space-y-1">
          {errors.map((code) => (
            <li key={code}>{t(`errors.${code}`)}</li>
          ))}
        </ul>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border-3 border-blue-700 hover:border-blue-700 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer"
      >
        {loading ? t('signIn.loading') : t('signIn.submit')}
      </button>

      <div className="text-sm text-center">
        <Link href="/signup" className="text-blue-600 hover:underline">
          {t('signIn.toSignUp')}
        </Link>
      </div>
    </form>
  );
}
