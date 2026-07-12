'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signUp, type AuthActionError } from '@/app/actions/auth';
import { validateEmail, validatePassword } from '@/lib/validation/auth';

type FormErrorCode = AuthActionError | 'passwordsMismatch';

export function SignUpForm() {
  const t = useTranslations('Auth');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrorCode[]>([]);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const invalid: FormErrorCode[] = [
      ...validateEmail(email),
      ...validatePassword(password),
    ];
    if (password !== confirmPassword) invalid.push('passwordsMismatch');

    if (invalid.length > 0) {
      setErrors(invalid);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const code = await signUp(email, password);
      if (code) {
        setErrors([code]);
      } else {
        setSuccess(true);
      }
    } catch {
      setErrors(['unknown']);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-green-50 text-green-600 p-4 rounded">
          <p>{t('signUp.success')}</p>
          <Link href="/signin" className="text-blue-600 hover:underline">
            {t('signUp.goToSignIn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} noValidate className="space-y-6 text-black">
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
          className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        <p className="mt-1 text-xs text-gray-500">{t('fields.passwordHint')}</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border-3 border-blue-600 hover:border-blue-700 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer"
      >
        {loading ? t('signUp.loading') : t('signUp.submit')}
      </button>

      <div className="text-sm text-center">
        <Link href="/signin" className="text-blue-600 hover:underline">
          {t('signUp.toSignIn')}
        </Link>
      </div>
    </form>
  );
}
