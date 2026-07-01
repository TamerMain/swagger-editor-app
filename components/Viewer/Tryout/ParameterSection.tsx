"use client";

import { Parameter } from "@/types/openapi";

interface ParameterSectionProps {
  title: string;
  params: Parameter[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  colorClass?: string;
}

export default function ParameterSection({
  title,
  params,
  values,
  onChange,
  colorClass = "text-blue-400",
}: ParameterSectionProps) {
  if (params.length === 0) return null;

  return (
    <div className="space-y-2 p-3 bg-gray-800/30 rounded border border-gray-700/50">
      <h4 className="text-sm font-semibold text-gray-400">{title}</h4>
      {params.map((param) => (
        <div key={param.name} className="flex items-center gap-2">
          {param.description && (
            <span className="text-xs text-gray-500" title={param.description}>
              ⓘ
            </span>
          )}
          <span className={`text-sm ${colorClass} font-mono min-w-[80px]`}>
            {param.name}
          </span>
          <input
            type="text"
            value={values[param.name] || ""}
            onChange={(e) => onChange(param.name, e.target.value)}
            placeholder={param.required ? "Required" : "Optional"}
            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          />
          {param.required && <span className="text-red-400 text-xs">*</span>}
        </div>
      ))}
    </div>
  );
}

