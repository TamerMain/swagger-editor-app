import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignUpForm } from '@/components/Authentication/SignupForm'

export default async function SignUpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="mt-2 text-center text-gray-600">
            Sign up to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}