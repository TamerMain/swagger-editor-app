import { useTranslations } from 'next-intl';
import { type Spec } from '@/types/openapi';

type ViewerHeaderProps = { spec: Spec; totalOperations: number };

export default function ViewerHeader({
  spec,
  totalOperations,
}: ViewerHeaderProps) {
  const t = useTranslations('ViewerHeader');

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">{spec.info.title}</h2>
      <p className="text-gray-400 text-sm mb-2">
        {t('version')}: {spec.info.version}
      </p>

      {spec.info.description && (
        <p className="text-gray-300 text-sm mb-4">{spec.info.description}</p>
      )}

      {spec.servers && spec.servers.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-400">{t('servers')}:</div>
          {spec.servers.map((server, index) => (
            <div key={index} className="text-xs text-gray-300">
              {server.url}
              {' | '}
              {server.description && `${server.description}`}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 text-sm text-gray-400 mb-4">
        <span>
          {t('paths')}: {Object.keys(spec.paths).length}
        </span>
        <span>•</span>
        <span>
          {t('operations')}: {totalOperations}
        </span>
        {spec.components?.schemas && (
          <>
            <span>•</span>
            <span>
              {t('schemas')}: {Object.keys(spec.components.schemas).length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
