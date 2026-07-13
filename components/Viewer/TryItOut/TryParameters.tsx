import { useTranslations } from 'next-intl';
import {
  PARAMETER_TYPE_COLORS,
  TRY_IT_OUT_FIELDS,
} from '@/constants/constants';
import { type ParameterType, type Parameter } from '@/types/openapi';
import { useState, useEffect, useRef } from 'react';

type TryParametersProps = {
  type: ParameterType;
  params: Parameter[];
};

export default function TryParameters({ type, params }: TryParametersProps) {
  const t = useTranslations('TryItOut');
  const [values, setValues] = useState<Record<string, string>>({});
  const isFirstRender = useRef(true);

  const getPlaceholder = (p: Parameter) => {
    if (Array.isArray(p.schema?.type)) {
      return p.schema.type.join(' | ');
    }
    if (p.schema?.default !== undefined) return String(p.schema.default);
    if (p.schema?.type) return p.schema.type;

    return p.required ? t('required') : t('optional');
  };

  const getDefaultValue = (p: Parameter): string => {
    if (p.example !== undefined) return String(p.example);
    if (p.schema?.example !== undefined) return String(p.schema.example);
    if (p.schema?.default !== undefined) return String(p.schema.default);
    return '';
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const initialValues: Record<string, string> = {};
    params.forEach((p) => {
      const val = getDefaultValue(p);
      if (val) initialValues[p.name] = val;
    });
    setValues(initialValues);
  }, [params]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  if (params.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs text-neutral-400 capitalize mb-1">
        {t('parameterType', { type })}
      </h2>
      {params.map((p) => (
        <div
          key={p.name}
          className="flex gap-2 mt-1 px-2 py-1 bg-neutral-800/50 rounded"
        >
          <label
            className={`w-16 text-xs ${PARAMETER_TYPE_COLORS[type]} flex items-center`}
          >
            {p.name}
            {p.required && (
              <span className="text-xs text-red-500 ml-0.5">*</span>
            )}
          </label>
          <input
            name={`${TRY_IT_OUT_FIELDS.PARAMETER}_${type}_${p.name}`}
            type="text"
            value={values[p.name] || ''}
            onChange={(e) => handleChange(p.name, e.target.value)}
            placeholder={getPlaceholder(p)}
            className="flex-1 px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
          />
        </div>
      ))}
    </div>
  );
}
