"use client";

import { ResponseData } from "@/types/openapi";

interface ResponseDisplayProps {
  response: ResponseData;
  downloadUrl: string | null;
}

export default function ResponseDisplay({ response, downloadUrl }: ResponseDisplayProps) {
  if (!response) return null;

  return (
    <div className="mt-4 border border-gray-700 rounded p-3">
      <div className="flex justify-between items-center">
        <span
          className={`font-mono ${response.status < 400 ? "text-green-400" : "text-red-400"}`}
        >
          Status: {response.status}
        </span>
        {response.isBinary && downloadUrl && (
          <a
            href={downloadUrl}
            download="response-file"
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
          >
            ⬇ Download
          </a>
        )}
      </div>

      {response.isBinary ? (
        <div className="mt-2 text-sm text-gray-400">
          {response.body}
          {downloadUrl && (
            <div className="mt-1 text-xs text-blue-400">
              Click Download to save file
            </div>
          )}
        </div>
      ) : (
        <pre className="mt-2 p-3 bg-gray-800 rounded text-sm text-gray-300 overflow-auto max-h-60">
          {JSON.stringify(response.body, null, 2)}
        </pre>
      )}
    </div>
  );
}