import { parameterTypeColors } from "@/constants/constants";
import { type Parameter } from "@/types/openapi";

type ParametersListProps = { parameters: Parameter[] };

export default function ParametersList({ parameters }: ParametersListProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <div className="text-gray-500 text-xs italic mt-1">No parameters</div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      {parameters.map((param, idx) => (
        <div
          key={`${param.name}-${idx}`}
          className="flex items-start gap-2 text-xs bg-gray-800/50 rounded p-1.5"
        >
          <span
            className={`px-1.5 py-0.5 rounded border font-mono text-[10px] uppercase ${parameterTypeColors[param.in]}`}
          >
            {param.in}
          </span>
          <span className="font-mono text-white">{param.name}</span>
          {param.required && (
            <span className="text-red-400 text-[10px] font-semibold">
              required
            </span>
          )}
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
  );
}
