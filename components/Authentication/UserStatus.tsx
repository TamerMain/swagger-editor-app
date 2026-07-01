import { createClient } from '@/lib/supabase/server'

export async function UserStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <a href="/login" className="text-blue-600 hover:underline">
        Sign In
      </a>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{user.email}</span>
    </div>
  )
}