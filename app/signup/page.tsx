import { getTranslations } from 'next-intl/server';
import { SignUpForm } from '@/components/Authentication/SignupForm';

export default async function SignUpPage() {
  const t = await getTranslations('Auth.signUp');
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-black">
            {t('createAccount')}
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {t('Sign up to get started')}
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
