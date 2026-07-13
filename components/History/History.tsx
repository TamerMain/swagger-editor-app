import { useTranslations } from 'next-intl';
import Link from 'next/link';
import HistoryItem from './HistoryItem';
import { type HistoryRow } from '@/types/supabase';

type HistoryProps = {
  history: HistoryRow[] | null;
};

export default function History({ history }: HistoryProps) {
  const t = useTranslations('History');

  const sortedHistory = history
    ? [...history].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
    : null;

  if (!sortedHistory || sortedHistory.length === 0) {
    return (
      <div className="flex-1 p-4 overflow-auto scroll-container scrollbar-thin scrollbar-thumb-neutral-400">
        <h1 className="text-2xl font-bold mb-4 text-center">{t('title')}</h1>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">{t('empty')}</p>
          <div className="space-x-4">
            <Link
              href="/"
              className="px-3 py-2 rounded border-2 border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700"
            >
              {t('goHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 scroll-container overflow-auto scrollbar-thin scrollbar-thumb-neutral-400">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="space-y-2">
        {sortedHistory.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
