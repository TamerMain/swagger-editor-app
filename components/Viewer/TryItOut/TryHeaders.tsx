import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { Operation } from '@/types/openapi';
import { TRY_IT_OUT_FIELDS } from '@/constants/constants';
import { safeStringify } from '@/lib/safeStringify';

type TryHeadersProps = {
  headerParams: Operation['parameters'];
};

export default function TryHeaders({ headerParams = [] }: TryHeadersProps) {
  const t = useTranslations('TryItOut');
  const [value, setValue] = useState('');
  const isFirstRender = useRef(true);

  const headerDefault = headerParams.reduce(
    (acc, p) => {
      acc[p.name] = String(p.schema?.default ?? p.schema?.type ?? '');
      return acc;
    },
    {} as Record<string, string>,
  );

  const isEmpty = Object.keys(headerDefault).length === 0;
  const placeholder = isEmpty
    ? '{\n  "key": "value"\n}'
    : safeStringify(headerDefault);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isEmpty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(safeStringify(headerDefault));
    }
  }, [isEmpty, headerDefault]);

  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">
        {t('customHeaders')}
      </label>
      <textarea
        name={TRY_IT_OUT_FIELDS.HEADERS}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-xs font-mono"
      />
    </div>
  );
}
