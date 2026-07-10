import dynamic from 'next/dynamic';
import { getHistory } from '@/app/actions/history';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const History = dynamic(() => import('@/components/History/History'), {
  loading: () => <div>Loading...</div>,
  ssr: true,
});

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/');
  }

  const history = await getHistory();

  return <History history={history} />;
}