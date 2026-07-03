import { formatBytes } from '@/lib/formatBytes';
import { type DatabaseRow } from '@/types/supabase';

type HistoryItemProps = {
  item: DatabaseRow;
};

export default function HistoryItem({ item }: HistoryItemProps) {
  const getStatusColor = (code: number) => {
    if (code === 0) return 'text-red-300 bg-red-900 border-red-700'; // ERR
    if (code >= 200 && code < 300)
      return 'text-green-400 bg-green-900 border-green-700'; // 2xx
    if (code >= 300 && code < 400)
      return 'text-blue-400 bg-blue-900 border-blue-700'; // 3xx
    if (code >= 400 && code < 500)
      return 'text-yellow-400 bg-yellow-900 border-yellow-700'; // 4xx
    if (code >= 500) return 'text-red-300 bg-red-500 border-red-700'; // 5xx
    return 'text-gray-400 bg-gray-900 border-gray-700'; // Unknown
  };

  return (
    <div className=" p-3 border-1 rounded bg-neutral-900/50 border-neutral-800 ">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-1 text-xs rounded border-2 ${getStatusColor(item.status_code)}`}
          >
            {item.status_code || 'ERR'}
          </span>
          <span className="font-mono text-sm font-medium">{item.method}</span>
          <span className="text-sm text-neutral-600 truncate max-w-[300px]">
            {item.endpoint}
          </span>
        </div>
        <div className="text-sm text-neutral-500 flex items-center gap-3 flex-shrink-0 ml-4">
          {item.duration_ms && <span>⏱ {item.duration_ms}ms</span>}
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
        <span>📤 Request: {formatBytes(item.request_size)}</span>
        <span>📥 Response: {formatBytes(item.response_size)}</span>
      </div>
      {item.error_details && (
        <div className="mt-2 text-xs w-fit text-red-400 bg-red-950/30 p-2 rounded border border-red-800">
          ❌ {item.error_details}
        </div>
      )}
    </div>
  );
}
