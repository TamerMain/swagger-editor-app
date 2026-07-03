import { Operation } from '@/types/openapi';
import { TRY_IT_OUT_FIELDS } from '@/constants/constants';

type TryHeadersProps = {
  headerParams: Operation['parameters'];
};

export default function TryHeaders({ headerParams = [] }: TryHeadersProps) {
  const headerDefault = headerParams.reduce(
    (acc, p) => {
      acc[p.name] = String(p.schema?.default ?? p.schema?.type ?? '');
      return acc;
    },
    {} as Record<string, string>,
  );

  const isEmpty = Object.keys(headerDefault).length === 0;

  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">
        Custom Headers
      </label>
      <textarea
        name={TRY_IT_OUT_FIELDS.HEADERS}
        placeholder={
          isEmpty
            ? '{\n  "key": "value"\n}'
            : JSON.stringify(headerDefault, null, 2)
        }
        className="w-full h-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-xs font-mono"
      />
    </div>
  );
}
