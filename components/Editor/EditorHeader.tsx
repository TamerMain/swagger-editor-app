'use client';

import { FORMAT } from '@/constants/constants';
import { type Format } from '@/types/openapi';

type EditorHeaderProps = {
  format: Format;
  isAuth: boolean;
  isSaving: boolean;
  errors: string[];
  onSchemaClear: () => void;
  onSchemaSave: () => void;
  onFormatSwitch: () => void;
};

export default function EditorHeader({
  format,
  isAuth,
  isSaving,
  errors,
  onSchemaClear,
  onSchemaSave,
  onFormatSwitch,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-900 border-b border-neutral-700">
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-400">Format:</span>
        <span
          className={`px-2 py-1 text-xs border-2 rounded font-mono ${
            format === FORMAT.JSON
              ? 'text-blue-400 bg-blue-500/20 border-blue-700'
              : 'text-green-400 bg-green-500/20 border-green-700'
          }`}
        >
          {format.toUpperCase()}
        </span>

        {errors.length === 0 && (
          <span className="text-xs text-green-500">
            Valid OpenAPI 3.0 Specification
          </span>
        )}
      </div>

      <div className="flex gap-2 font-mono">
        <button
          onClick={onSchemaClear}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Clear
        </button>
        {isAuth && (
          <button
            onClick={() => onSchemaSave()}
            className={`w-28 px-2 py-1 text-xs ${errors.length > 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} rounded`}
            disabled={errors.length > 0}
          >
            {isSaving
              ? 'Saving...'
              : errors.length > 0
                ? 'Invalid Schema'
                : 'Save Schema'}
          </button>
        )}
        <button
          onClick={onFormatSwitch}
          className={`px-2 py-2 text-xs rounded cursor-pointer ${
            format === FORMAT.JSON
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={errors.length > 0}
        >
          Switch to {format === FORMAT.JSON ? 'YAML' : 'JSON'}
        </button>
      </div>
    </div>
  );
}
