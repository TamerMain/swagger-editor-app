import { PARAMETER_TYPE_COLORS } from "@/constants/constants";
import { Operation } from "@/types/openapi";

type DisplayParametersProps = { parameters: Operation["parameters"] };

export default function DisplayParameters({
  parameters,
}: DisplayParametersProps) {
  if (!parameters || parameters.length === 0) {
    return null;
  }

  return (
    <div className="ml-1">
      <div className="text-neutral-400 text-xs font-semibold mb-1">
        Parameters ({parameters.length})
      </div>
      <div className="mt-2 space-y-1.5">
        {parameters.map((param, idx) => (
          <div
            key={`${param.name}-${idx}`}
            className="flex items-start gap-2 text-xs bg-neutral-800/50 rounded p-1.5"
          >
            <span
              className={`px-1.5 py-0.5 rounded border font-mono text-[10px] uppercase ${PARAMETER_TYPE_COLORS[param.in]}`}
            >
              {param.in}
            </span>
            <span className="font-mono text-gray-300">
              {param.name}
              {" "}
              {param.required && (
                <span className="text-red-400 text-[10px] font-semibold">
                  *
                </span>
              )}
            </span>

            {param.schema?.type && (
              <span className="text-gray-400 text-[10px]">
                ({param.schema.type})
              </span>
            )}
            {param.description && (
              <span className="text-gray-400 text-[10px] truncate max-w-[200px]">
                - {param.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
