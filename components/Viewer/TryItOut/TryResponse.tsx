import { getStatusColor } from "@/constants/constants";

type TryResponseProps = {
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  };
};

export default function TryResponse({ response }: TryResponseProps) {
  const displayBody =
    typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

  return (
    <div className="border border-neutral-700 rounded p-3">
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-0.5 text-[10px] font-mono rounded border  ${getStatusColor(String(response.status))}`}
        >
          {response.status}
        </span>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              JSON.stringify(response.body, null, 2),
            )
          }
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Copy
        </button>
      </div>
      <pre className="mt-2 text-xs text-neutral-300 overflow-auto max-h-60">
        {JSON.stringify(displayBody, null, 2)}
      </pre>
    </div>
  );
}
