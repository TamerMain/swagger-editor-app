import HistoryItem from './HistoryItem';
import { type DatabaseRow } from '@/types/supabase';

type HistoryProps = {
  history: DatabaseRow[] | null;
};

export default function History({ history }: HistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Request History</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            You haven't executed any requests yet
          </p>
          <div className="space-x-4">
            <a href="/" className="text-blue-500 hover:underline">
              Go to Editor
            </a>
            <a href="/viewer" className="text-blue-500 hover:underline">
              Go to Viewer
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Request History</h1>
      <div className="space-y-2">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
