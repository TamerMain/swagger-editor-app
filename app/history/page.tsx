import { getHistory } from '@/app/actions/history';
import History from '@/components/History/History';

export default async function HistoryPage() {
  const history = await getHistory();

  return <History history={history} />;
}
