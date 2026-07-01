"use client";

import { useState } from "react";
import { endpointTryout } from "@/app/actions/history";

interface TryOutProps {
  operation: any;
  path: string;
  method: string;
}

export default function TryOut({ operation, path, method }: TryOutProps) {
  const [bodyType, setBodyType] = useState<"json" | "formdata" | "file">(
    "json",
  );
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [response, setResponse] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleFormDataChange = (key: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const executeRequest = async () => {
    setLoading(true);
    setDownloadUrl(null);

    let requestBody: any;
    let headers: Record<string, string> = {};

    try {
      // Prepare body based on type
      if (bodyType === "json") {
        requestBody = JSON.parse(body);
        headers["Content-Type"] = "application/json";
      } else if (bodyType === "file" && selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        requestBody = fd;
      } else if (bodyType === "formdata") {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          fd.append(key, value instanceof File ? value : String(value));
        });
        requestBody = fd;
      }

      // Call server action
      const result = await endpointTryout(path, method, {
        headers,
        body: requestBody,
      });

      // Handle binary response
      if (result.isBinary) {
        const blob = new Blob([
          Uint8Array.from(atob(result.body), (c) => c.charCodeAt(0)),
        ]);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResponse({
          status: result.status,
          headers: result.headers,
          body: `📁 Binary file (${result.size} bytes)`,
          blob,
          isBinary: true,
        });
      } else {
        setResponse({
          status: result.status,
          headers: result.headers,
          body: result.body,
          isBinary: false,
        });
      }
    } catch (error) {
      setResponse({
        status: 500,
        body: {
          error: error instanceof Error ? error.message : "Request failed",
        },
        isBinary: false,
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Body Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {["json", "formdata", "file"].map((type) => (
          <button
            key={type}
            onClick={() => setBodyType(type as any)}
            className={`px-3 py-1 text-sm rounded capitalize ${
              bodyType === type
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* JSON Body */}
      {bodyType === "json" && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-32 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm font-mono"
          placeholder='{"key": "value"}'
        />
      )}

      {/* File Upload */}
      {bodyType === "file" && (
        <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-400 hover:text-blue-300"
          >
            {selectedFile ? `📎 ${selectedFile.name}` : "Click to select file"}
          </label>
          {selectedFile && (
            <div className="text-xs text-gray-400 mt-1">
              Size: {(selectedFile.size / 1024).toFixed(1)} KB
            </div>
          )}
        </div>
      )}

      {/* FormData */}
      {bodyType === "formdata" && (
        <div className="space-y-2">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newFormData = { ...formData };
                  delete newFormData[key];
                  setFormData({ ...newFormData, [e.target.value]: value });
                }}
                placeholder="Key"
                className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              />
              {value instanceof File ? (
                <span className="text-xs text-gray-400">{value.name}</span>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFormDataChange(key, e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
              )}
              <button
                onClick={() => {
                  const newFormData = { ...formData };
                  delete newFormData[key];
                  setFormData(newFormData);
                }}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => setFormData({ ...formData, [""]: "" })}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            + Add Field
          </button>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={executeRequest}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm disabled:opacity-50"
      >
        {loading ? "⏳ Sending..." : "🚀 Execute"}
      </button>

      {/* Response */}
      {response && (
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
      )}
    </div>
  );
}
