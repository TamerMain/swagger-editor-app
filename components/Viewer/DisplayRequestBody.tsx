import { Operation } from "@/types/openapi";

type DisplayRequestBodyProps = { requestBody: Operation["requestBody"] };

export default function DisplayRequestBody({
  requestBody,
}: DisplayRequestBodyProps) {
  if (!requestBody) {
    return null;
  }

  return (
    <div className="ml-1 mt-2">
      <div className="text-neutral-400 text-xs font-semibold mb-1">
        Request Body{" "}
        {requestBody.required && <span className="text-red-400">*</span>}
      </div>
      <div className="text-gray-300 text-xs bg-neutral-800/50 rounded p-1.5">
        {requestBody.description && <div>{requestBody.description}</div>}
        {requestBody.content && (
          <div className="text-gray-400 text-[10px] mt-0.5">
            Content Types: {Object.keys(requestBody.content).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
