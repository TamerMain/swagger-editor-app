'use server';

import { createClient } from '@/lib/supabase/server';

export async function loadSchema() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('userschema')
    .select('content')
    .eq('user_id', user.id)
    .maybeSingle();

  return data?.content || null;
}

export async function saveSchema(content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('userschema')
    .upsert({ user_id: user.id, content }, { onConflict: 'user_id' });

  if (error) throw error;
}
