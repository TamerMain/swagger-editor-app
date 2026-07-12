import { SignInForm } from '@/components/Authentication/SignInForm';

export default async function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-neutral-100 rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-black">Sign In</h2>
          <p className="mt-2 text-center text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
