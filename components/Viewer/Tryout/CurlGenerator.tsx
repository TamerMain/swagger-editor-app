"use client";

import { useState } from "react";

interface CurlGeneratorProps {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  bodyType?: "json" | "formdata" | "file";
}

export default function CurlGenerator({ 
  method, 
  url, 
  headers, 
  body, 
  bodyType 
}: CurlGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateCurl = () => {
    // Build curl command parts
    let curl = `curl -X ${method.toUpperCase()}`;
    
    // Add headers
    Object.entries(headers).forEach(([key, value]) => {
      // Skip Content-Type for FormData (curl handles it)
      if (bodyType === "formdata" && key === "Content-Type") return;
      curl += ` \\\n  -H "${key}: ${value}"`;
    });
    
    // Add body
    if (body) {
      if (bodyType === "json") {
        curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(body)}'`;
      } else if (bodyType === "formdata") {
        // FormData requires special handling
        Object.entries(body).forEach(([key, value]) => {
          if (value instanceof File) {
            curl += ` \\\n  -F "${key}=@${value.name}"`;
          } else {
            curl += ` \\\n  -F "${key}=${value}"`;
          }
        });
      } else if (bodyType === "file" && body instanceof File) {
        curl += ` \\\n  -F "file=@${body.name}"`;
      }
    }
    
    // Add URL
    curl += ` \\\n  "${url}"`;
    
    return curl;
  };

  const handleCopy = async () => {
    const curlCommand = generateCurl();
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center gap-2"
    >
      <span>📋</span>
      {copied ? "Copied!" : "Generate cURL"}
    </button>
  );
}