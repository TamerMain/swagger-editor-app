import { useTranslations } from 'next-intl';
import { Operation } from '@/types/openapi';
import { safeStringify } from '@/lib/safeStringify';

type DisplayRequestBodyProps = { requestBody: Operation['requestBody'] };

export default function DisplayRequestBody({
  requestBody,
}: DisplayRequestBodyProps) {
  const t = useTranslations('Viewer');
  if (!requestBody) return null;

  const content =
    requestBody.content?.['application/json'] ||
    Object.values(requestBody.content || {})[0];
  const schema = content?.schema;
  const example = content?.example || schema?.example;

  return (
    <div className="ml-1 mt-2">
      <div className="text-neutral-400 text-xs font-semibold mb-1">
        {t('requestBody')}{' '}
        {requestBody.required && <span className="text-red-400">*</span>}
      </div>
      <div className="text-gray-300 text-xs bg-neutral-800/50 rounded p-1.5">
        {requestBody.description && <div>{requestBody.description}</div>}
        {requestBody.content && (
          <div className="text-gray-400 text-[10px] mt-0.5">
            {t('contentTypes')}: {Object.keys(requestBody.content).join(', ')}
          </div>
        )}
        <>
          {schema && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] text-white hover:text-blue-400">
                {t('schema')}
              </summary>
              <pre className="mt-1 p-2 bg-neutral-900/50 rounded text-[10px] overflow-auto max-h-40">
                {safeStringify(schema)}
              </pre>
            </details>
          )}
          {example && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] text-white hover:text-blue-300">
                {t('example')}
              </summary>
              <pre className="mt-1 p-2 bg-neutral-900/50 rounded text-[10px] overflow-auto max-h-40">
                {safeStringify(example)}
              </pre>
            </details>
          )}
        </>
      </div>
    </div>
  );
}
