'use server';

import { createClient } from '@/lib/supabase/server';

export async function getHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  return data;
}
