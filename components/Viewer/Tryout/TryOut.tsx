// components/Viewer/Tryout/TryOut.tsx
"use client";

import { useState } from "react";
import { endpointTryout } from "@/app/actions/history";
import { Parameter, ResponseData } from "@/types/openapi";
import ParameterSection from "./ParameterSection";
import BodySelector from "./BodySelector";
import JsonBody from "./BodyJson";
import FileUpload from "./BodyFileUpload";
import FormDataBuilder from "./BodyFormData";
import ResponseDisplay from "./ResponseDisplay";
import UrlPreview from "./UrlPreview";
import ExecuteButton from "./ExecuteButton";
import CurlGenerator from "./CurlGenerator";

type TryOutProps = {
  operation: {
    parameters?: Parameter[];
    [key: string]: any;
  };
  path: string;
  method: string;
};

export default function TryOut({ operation, path, method }: TryOutProps) {
  // ... all your existing state ...
  const [bodyType, setBodyType] = useState<"JSON" | "Form Data" | "File">(
    "JSON",
  );
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // ✅ Base URL state - starts empty, user must fill it
  const [baseUrl, setBaseUrl] = useState<string>("");

  // ... extract parameters ...
  const parameters = operation.parameters || [];
  const pathParams = parameters.filter((p: Parameter) => p.in === "path");
  const queryParams = parameters.filter((p: Parameter) => p.in === "query");
  const headerParams = parameters.filter((p: Parameter) => p.in === "header");

  // ... buildUrl function - now returns relative path only ...
  const buildRelativeUrl = () => {
    let url = path;

    pathParams.forEach((param: Parameter) => {
      const value = paramValues[param.name] || "";
      url = url.replace(`{${param.name}}`, value);
    });

    const queryString = queryParams
      .filter((param: Parameter) => paramValues[param.name])
      .map(
        (param: Parameter) =>
          `${encodeURIComponent(param.name)}=${encodeURIComponent(paramValues[param.name])}`,
      )
      .join("&");

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  };

  // ✅ Build full URL with baseUrl (only if baseUrl is provided)
  const buildFullUrl = () => {
    const relativeUrl = buildRelativeUrl();

    // If baseUrl is empty, return just the relative URL
    if (!baseUrl) {
      return relativeUrl;
    }

    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanPath = relativeUrl.startsWith("/")
      ? relativeUrl
      : `/${relativeUrl}`;
    return `${cleanBase}${cleanPath}`;
  };

  // ... handlers ...
  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormDataChange = (key: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormDataRemove = (key: string) => {
    const newFormData = { ...formData };
    delete newFormData[key];
    setFormData(newFormData);
  };

  // ... executeRequest function ...
  const executeRequest = async () => {
    setLoading(true);
    setDownloadUrl(null);

    const fullUrl = buildFullUrl();

    // ✅ Validate that baseUrl is provided
    if (!baseUrl) {
      setResponse({
        status: 400,
        body: {
          error: "Please enter a Base URL first",
        },
        headers: {},
        isBinary: false,
      });
      setLoading(false);
      return;
    }

    let requestBody: any;
    let headers: Record<string, string> = {};

    // Add header parameters
    headerParams.forEach((param: Parameter) => {
      if (paramValues[param.name]) {
        headers[param.name] = paramValues[param.name];
      }
    });

    try {
      // Prepare body
      if (bodyType === "JSON" && body.trim()) {
        requestBody = JSON.parse(body);
        headers["Content-Type"] = "application/json";
      } else if (bodyType === "JSON") {
        // ✅ Empty JSON = no body
        requestBody = undefined;
      } else if (bodyType === "File" && selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        requestBody = fd;
      } else if (bodyType === "Form Data") {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          fd.append(key, value instanceof File ? value : String(value));
        });
        requestBody = fd;
      }

      const result = await endpointTryout(fullUrl, method, {
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
          size: result.size,
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
        headers: {},
        isBinary: false,
      });
    }

    setLoading(false);
  };

  const showUrlPreview = pathParams.length > 0 || queryParams.length > 0;

  return (
    <div className="space-y-4">
      {/* Base URL Input - User must fill this */}
      <div className="text-xs space-y-2 p-3 bg-neutral-800/30 rounded border border-neutral-700/50">
        <h4 className="font-semibold text-neutral-400">
          Base URL
          <span className="ml-1 text-red-400">*</span>
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-mono min-w-[80px]">
            Server
          </span>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
            className={`flex-1 px-2 py-1 bg-neutral-800 border rounded text-white text-sm border-neutral-600
            `}
          />
        </div>
      </div>

      {/* Parameters */}
      <ParameterSection
        title="Path Parameters"
        params={pathParams}
        values={paramValues}
        onChange={handleParamChange}
        colorClass="text-blue-400"
      />

      <ParameterSection
        title="Query Parameters"
        params={queryParams}
        values={paramValues}
        onChange={handleParamChange}
        colorClass="text-green-400"
      />

      <ParameterSection
        title="Header Parameters"
        params={headerParams}
        values={paramValues}
        onChange={handleParamChange}
        colorClass="text-yellow-400"
      />

      {/* URL Preview - now shows full URL */}
      {showUrlPreview && <UrlPreview url={buildFullUrl()} />}

      {/* Body Type Selector */}
      <BodySelector bodyType={bodyType} onChange={setBodyType} />

      {/* Body Inputs */}
      {bodyType === "JSON" && <JsonBody value={body} onChange={setBody} />}

      {bodyType === "File" && (
        <FileUpload file={selectedFile} onChange={setSelectedFile} />
      )}

      {bodyType === "Form Data" && (
        <FormDataBuilder
          values={formData}
          onChange={handleFormDataChange}
          onRemove={handleFormDataRemove}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <ExecuteButton
          loading={loading}
          onClick={executeRequest}
          // disabled={!baseUrl} // ✅ Disable if no base URL
        />

        <CurlGenerator
          method={method}
          url={buildFullUrl()}
          headers={{
            ...headerParams.reduce(
              (acc, p) => ({
                ...acc,
                [p.name]: paramValues[p.name],
              }),
              {},
            ),
            ...(bodyType === "JSON" && body
              ? { "Content-Type": "application/json" }
              : {}),
          }}
          body={
            bodyType === "JSON"
              ? (() => {
                  try {
                    return JSON.parse(body);
                  } catch {
                    return null;
                  }
                })()
              : bodyType === "File"
                ? selectedFile
                : bodyType === "Form Data"
                  ? formData
                  : null
          }
          bodyType={bodyType}
        />
      </div>

      {/* Response Display */}
      {response && (
        <ResponseDisplay response={response} downloadUrl={downloadUrl} />
      )}
    </div>
  );
}
