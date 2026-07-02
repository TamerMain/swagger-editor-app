// components/Viewer/OperationDetails.tsx
import MethodBadge from "@/components/Viewer/MethodBadge";
import ParametersList from "@/components/Viewer/ParameterList";
import RequestBodyDisplay from "@/components/Viewer/RequestBodyDisplay";
import ResponsesDisplay from "@/components/Viewer/ResponsesDisplay";
import TryOut from "@/components/Viewer/Tryout/TryOut";
import { type HttpMethod, type Operation } from "@/types/openapi";

type OperationDetailsProps = {
  method: HttpMethod;
  operation: Operation;
  path: string;
  pathItemParameters?: any[]; // ✅ Add path-level params
};

export default function OperationDetails({
  method,
  operation,
  path,
  pathItemParameters = [], // ✅ Default to empty array
}: OperationDetailsProps) {
  // ✅ Merge path-level + operation-level parameters
  const mergedParameters = [
    ...(pathItemParameters || []), // PathItem level params (e.g., userId)
    ...(operation.parameters || []), // Operation level params (e.g., limit, page)
  ];

  // ✅ Remove duplicates (if same param appears in both places)
  const uniqueParameters = mergedParameters.filter(
    (param, index, self) =>
      index === self.findIndex((p) => p.name === param.name && p.in === param.in)
  );

  // ✅ Create merged operation with all parameters
  const mergedOperation = {
    ...operation,
    parameters: uniqueParameters,
  };

  return (
    <div className="pt-3 first:mt-0">
      <div className="flex items-center gap-2 mb-1">
        <MethodBadge method={method} />
        {operation.summary && (
          <span className="text-gray-300 text-sm">{operation.summary}</span>
        )}
        {operation.operationId && (
          <span className="text-gray-500 text-[10px] font-mono">
            {operation.operationId}
          </span>
        )}
      </div>

      {operation.description && (
        <p className="text-gray-400 text-xs mb-2 ml-1">
          {operation.description}
        </p>
      )}

      {operation.tags && operation.tags.length > 0 && (
        <div className="flex gap-1 mb-2 ml-1 flex-wrap">
          {operation.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ✅ Use merged parameters for display */}
      {uniqueParameters && uniqueParameters.length > 0 && (
        <div className="ml-1">
          <div className="text-gray-400 text-xs font-semibold mb-1">
            Parameters ({uniqueParameters.length})
          </div>
          <ParametersList parameters={uniqueParameters} />
        </div>
      )}

      {operation.requestBody && (
        <RequestBodyDisplay requestBody={operation.requestBody} />
      )}

      {operation.responses && Object.keys(operation.responses).length > 0 && (
        <ResponsesDisplay responses={operation.responses} />
      )}

      <div className="mt-4">
        <details>
          <summary className="w-fit px-3 py-1 rounded border-2 border-blue-700 hover:border-blue-700/70 cursor-pointer text-neutral-50 hover:text-blue-300 text-sm">
            Try It Out
          </summary>
          <div className="mt-3">
            <TryOut 
              operation={mergedOperation} // ✅ Pass merged operation with all params
              path={path}
              method={method}
            />
          </div>
        </details>
      </div>
    </div>
  );
}