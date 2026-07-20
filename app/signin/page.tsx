import { getTranslations } from 'next-intl/server';
import { SignInForm } from '@/components/Authentication/SignInForm';

export default async function SignInPage() {
  const t = await getTranslations('Auth.signIn');

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-neutral-100 rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-black">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-gray-600">{t('subtitle')}</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
