import { getStatusColor } from "@/constants/constants";
import { Operation } from "@/types/openapi";

type DisplayResponseProps = { responses: Operation["responses"] };

export default function DisplayResponses({ responses }: DisplayResponseProps) {
  if (!responses || Object.keys(responses).length === 0) return null;

  return (
    <div className="ml-1 mt-2">
      <div className="text-neutral-400 text-xs font-semibold mb-1">
        Responses
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(responses).map(([status, response]) => (
          <div key={status} className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded border text-[10px] font-mono ${getStatusColor(status)}`}
            >
              {status}
            </span>
            {response.description && (
              <span className="text-gray-400 text-[10px] truncate max-w-[150px]">
                {response.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
