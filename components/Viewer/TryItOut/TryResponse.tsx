import { getStatusColor } from '@/constants/constants';

type TryResponseProps = {
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    ok?: boolean;
    statusText?: string;
  };
};

export default function TryResponse({ response }: TryResponseProps) {
  let displayBody = response.body;
  if (typeof response.body === 'string') {
    try {
      displayBody = JSON.parse(response.body);
    } catch {
      displayBody = response.body;
    }
  }

  const bodyString =
    typeof displayBody === 'string'
      ? displayBody
      : JSON.stringify(displayBody, null, 2);

  const errorMessage =
    typeof displayBody === 'object' &&
    displayBody !== null &&
    'error' in displayBody
      ? (displayBody as { error: string }).error
      : null;

  return (
    <div className="border border-neutral-700 rounded p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getStatusColor(String(response.status))}`}
          >
            {response.status || 'ERR'}{' '}
            {response.statusText && `- ${response.statusText}`}
          </span>
          {!response.ok && (
            <span className="text-xs text-red-400">Error</span>
          )}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(bodyString)}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Copy
        </button>
      </div>
      {errorMessage && (
        <div className="mt-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-800">
          ❌ {errorMessage}
        </div>
      )}
      <pre className="mt-2 text-xs text-neutral-300 overflow-auto max-h-60">
        {bodyString}
      </pre>
    </div>
  );
}
