import { useTranslations } from 'next-intl';
import { Spec } from '@/types/openapi';
import { TRY_IT_OUT_FIELDS } from '@/constants/constants';

type TryURLProps = {
  servers: Spec['servers'];
};

export default function TryURL({ servers }: TryURLProps) {
  const t = useTranslations('TryItOut');

  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">
        {t('baseUrl')}
        <span className="text-red-500"> *</span>
      </label>
      <input
        name={TRY_IT_OUT_FIELDS.URL}
        type="url"
        placeholder={servers?.[0]?.url || 'https://api.example.com'}
        className="w-full px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
      />
    </div>
  );
}
