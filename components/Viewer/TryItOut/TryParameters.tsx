import {
  PARAMETER_TYPE_COLORS,
  TRY_IT_OUT_FIELDS,
} from "@/constants/constants";
import { type ParameterType } from "@/types/openapi";

type TryParametersProps = {
  type: ParameterType;
  params: Array<{
    name: string;
    required?: boolean;
  }>;
};

export default function TryParameters({ type, params }: TryParametersProps) {
  if (params.length === 0) return null;

  const getPlaceholder = (p: any) => {
    if (p.schema?.default !== undefined) return String(p.schema.default);
    if (p.schema?.type) return p.schema.type;
    return p.required ? "required" : "optional";
  };

  return (
    <div>
      <h2 className="text-xs text-neutral-400 capitalize mb-1">
        {`${type} Response`}
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
            placeholder={getPlaceholder(p)}
            className="flex-1 px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
          />
        </div>
      ))}
    </div>
  );
}
