import { formatBytes } from "@/lib/formatBytes";

export default function HistoryItem({ item }: { item: any }) {
  const getStatusColor = (code: number) => {
    if (code < 400) return "bg-green-500";
    if (code < 500) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="border p-3 rounded">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status code */}
          <span
            className={`px-2 py-1 text-xs rounded text-white ${getStatusColor(item.status_code)}`}
          >
            {item.status_code || "ERR"}
          </span>

          {/* Method */}
          <span className="font-mono text-sm font-medium">{item.method}</span>

          {/* Endpoint */}
          <span className="text-sm text-neutral-600 truncate max-w-[300px]">
            {item.endpoint}
          </span>

          {/* Error indicator */}
          {/* {item.error_details && (
            <span className="text-xs text-red-500">⚠️ Error</span>
          )} */}
        </div>

        <div className="text-sm text-neutral-500 flex items-center gap-3 flex-shrink-0 ml-4">
          {item.duration_ms && <span>⏱ {item.duration_ms}ms</span>}
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* ✅ Payload Sizes */}
      <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
        {item.request_size !== null && item.request_size > 0 && (
          <span>📤 Request: {formatBytes(item.request_size)}</span>
        )}
        {item.response_size !== null && item.response_size > 0 && (
          <span>📥 Response: {formatBytes(item.response_size)}</span>
        )}
        {(!item.request_size || item.request_size === 0) &&
          (!item.response_size || item.response_size === 0) && (
            <span className="text-neutral-400">No size data</span>
          )}
      </div>

      {/* Error details (only if error exists) */}
      {item.error_details && (
        <div className="mt-2 p-2 rounded border-2 border-red-200 text-sm text-red-600 bg-neutral-50">
          ❌ {item.error_details}
        </div>
      )}
    </div>
  );
}
