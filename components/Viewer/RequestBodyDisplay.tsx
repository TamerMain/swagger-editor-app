import { type Operation } from "@/types/openapi";

type RequestBodyDisplayProps = {
  requestBody: NonNullable<Operation["requestBody"]>;
};

export default function RequestBodyDisplay({
  requestBody,
}: RequestBodyDisplayProps) {
  return (
    <div className="ml-1 mt-2">
      <div className="text-gray-400 text-xs font-semibold mb-1">
        Request Body
      </div>
      <div className="text-gray-300 text-xs bg-neutral-800/50 rounded p-1.5">
        {requestBody.description && <div>{requestBody.description}</div>}
        {requestBody.content && (
          <div className="text-gray-400 text-[10px] mt-0.5">
            Content Types: {Object.keys(requestBody.content).join(", ")}
          </div>
        )}
        {requestBody.required && (
          <span className="text-red-400 text-[10px] font-semibold ml-2">
            Required
          </span>
        )}
      </div>
    </div>
  );
}
