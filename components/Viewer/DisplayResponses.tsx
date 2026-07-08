import { getStatusColor } from '@/constants/constants';
import { Operation } from '@/types/openapi';
import { safeStringify } from '@/lib/safeStringify';

type DisplayResponseProps = { responses: Operation['responses'] };

export default function DisplayResponses({ responses }: DisplayResponseProps) {
  if (!responses || Object.keys(responses).length === 0) return null;

  return (
    <div className="ml-1 mt-2">
      <div className="text-neutral-400 text-xs font-semibold mb-1">
        Responses
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(responses).map(([status, response]) => {
          const content = response.content?.['application/json'];
          const schema = content?.schema;
          const example = content?.example || schema?.example;

          return (
            <details
              key={status}
              className="border border-neutral-700 rounded p-1"
            >
              <summary className="cursor-pointer flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded border text-[10px] font-mono ${getStatusColor(status)}`}
                >
                  {status}
                </span>
                {response.description && (
                  <span
                    className={`text-sm ${schema || example ? 'text-white hover:text-blue-400' : 'text-gray-400'} text-[10px] truncate max-w-[150px]`}
                  >
                    {response.description}
                  </span>
                )}
              </summary>
              <div className="">
                <>
                  {schema && (
                    <div className="text-xs text-neutral-300">
                      <div className="text-neutral-400 text-[10px] font-semibold">
                        Schema:
                      </div>
                      <pre className="mt-1 p-2 bg-neutral-800/50 rounded text-[10px] overflow-auto max-h-40">
                        {safeStringify(schema)}
                      </pre>
                    </div>
                  )}
                  {example && (
                    <div className="text-xs text-neutral-300 mt-2">
                      <div className="text-neutral-400 text-[10px] font-semibold">
                        Example:
                      </div>
                      <pre className="mt-1 p-2 bg-neutral-800/50 rounded text-[10px] overflow-auto max-h-40">
                        {safeStringify(example)}
                      </pre>
                    </div>
                  )}
                </>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
