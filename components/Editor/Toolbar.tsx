"use client";

import { FORMAT } from "@/constants/constants";
import { type Format } from "@/types/openapi";

type ToolbarProps = {
  format: Format;
  isValid: boolean;
  errors: string[];
  onFormatSwitch: () => void;
};

export default function Toolbar({
  format,
  isValid,
  errors,
  onFormatSwitch,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-900 border-b border-neutral-700">
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-400">Format:</span>
        <span
          className={`px-2 py-1 text-xs border-2 rounded font-mono ${
            format === FORMAT.JSON
              ? "text-blue-400 bg-blue-500/20 border-blue-700"
              : "text-green-400 bg-green-500/20 border-green-700"
          }`}
        >
          {format.toUpperCase()}
        </span>

        {isValid && (
          <span className="text-xs text-green-500">
            Valid OpenAPI 3.0 Specification
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onFormatSwitch}
          className={`px-2 py-1 text-xs rounded font-mono cursor-pointer ${
            format === FORMAT.JSON
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={errors.length !== 0}
        >
          Switch to {format === FORMAT.JSON ? "YAML" : "JSON"}
        </button>
      </div>
    </div>
  );
}
