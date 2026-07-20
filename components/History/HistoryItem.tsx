import { useFormatter, useTranslations } from 'next-intl';
import { formatBytes } from '@/lib/formatBytes';
import { type HistoryRow } from '@/types/supabase';
import { METHOD_COLORS, getHistoryStatusColor } from '@/constants/constants';

type HistoryItemProps = {
  item: HistoryRow;
};

export default function HistoryItem({ item }: HistoryItemProps) {
  const t = useTranslations('History');
  const format = useFormatter();

  return (
    <div className="p-3 border border-neutral-800 rounded bg-neutral-900/50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${
              METHOD_COLORS[
                item.method.toLowerCase() as keyof typeof METHOD_COLORS
              ] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}
          >
            {item.method}
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-mono ${getHistoryStatusColor(item.status_code)}`}
          >
            {item.status_code || 'ERR'}
          </span>
          <span className="text-sm text-neutral-300 truncate max-w-[300px]">
            {item.endpoint}
          </span>
        </div>
        <div className="text-sm text-neutral-500 flex items-center gap-3 flex-shrink-0 ml-4">
          {item.duration_ms && <span>⏱ {item.duration_ms}ms</span>}
          <span>
            {format.dateTime(new Date(item.timestamp), {
              dateStyle: 'short',
              timeStyle: 'medium',
            })}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
        <span>
          📤 {t('request')}: {formatBytes(item.request_size)}
        </span>
        <span>
          📥 {t('response')}: {formatBytes(item.response_size)}
        </span>
      </div>
      {item.error_details && (
        <div className="mt-2 text-xs w-fit text-red-400 bg-red-950/30 p-2 rounded border border-red-800">
          ❌ {item.error_details}
        </div>
      )}
    </div>
  );
}
