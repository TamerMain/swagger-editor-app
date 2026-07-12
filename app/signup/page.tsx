import { SignUpForm } from '@/components/Authentication/SignupForm';

export default async function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-black">
            Create Account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Sign up to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
