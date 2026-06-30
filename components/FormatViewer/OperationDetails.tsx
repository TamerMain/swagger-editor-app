import MethodBadge from "@/components/FormatViewer/MethodBadge";
import ParametersList from "@/components/FormatViewer/ParameterList";
import RequestBodyDisplay from "@/components/FormatViewer/RequestBodyDisplay";
import ResponsesDisplay from "@/components/FormatViewer/ResponsesDisplay";
import { type HttpMethod, type Operation } from "@/types/openapi";

type OperationDetailsProps = {
  method: HttpMethod;
  operation: Operation;
};

export default function OperationDetails({
  method,
  operation,
}: OperationDetailsProps) {
  return (
    <div className="mt-3 first:mt-0">
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
        <div className="flex gap-1 mb-2 ml-1">
          {operation.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {operation.parameters && operation.parameters.length > 0 && (
        <div className="ml-1">
          <div className="text-gray-400 text-xs font-semibold mb-1">
            Parameters ({operation.parameters.length})
          </div>
          <ParametersList parameters={operation.parameters} />
        </div>
      )}

      {operation.requestBody && (
        <RequestBodyDisplay requestBody={operation.requestBody} />
      )}
      {operation.responses && (
        <ResponsesDisplay responses={operation.responses} />
      )}
    </div>
  );
}
