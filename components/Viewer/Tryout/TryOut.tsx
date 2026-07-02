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
  const [bodyType, setBodyType] = useState<"json" | "formdata" | "file">(
    "json",
  );
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // ... extract parameters ...
  const parameters = operation.parameters || [];
  const pathParams = parameters.filter((p: Parameter) => p.in === "path");
  const queryParams = parameters.filter((p: Parameter) => p.in === "query");
  const headerParams = parameters.filter((p: Parameter) => p.in === "header");
  console.log([pathParams, queryParams, headerParams]);
   console.log(operation);

  // ... buildUrl function ...
  const buildUrl = () => {
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

    const fullUrl = buildUrl();
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

      {/* URL Preview */}
      {showUrlPreview && <UrlPreview url={buildUrl()} />}

      {/* Body Type Selector */}
      <BodySelector bodyType={bodyType} onChange={setBodyType} />

      {/* Body Inputs */}
      {bodyType === "json" && <JsonBody value={body} onChange={setBody} />}

      {bodyType === "file" && (
        <FileUpload file={selectedFile} onChange={setSelectedFile} />
      )}

      {bodyType === "formdata" && (
        <FormDataBuilder
          values={formData}
          onChange={handleFormDataChange}
          onRemove={handleFormDataRemove}
        />
      )}

      {/* ✅ Action Buttons - PASTE HERE */}
      <div className="flex gap-2">
        <ExecuteButton loading={loading} onClick={executeRequest} />

        <CurlGenerator
          method={method}
          url={buildUrl()}
          headers={{
            ...headerParams.reduce(
              (acc, p) => ({
                ...acc,
                [p.name]: paramValues[p.name],
              }),
              {},
            ),
            ...(bodyType === "json" && body
              ? { "Content-Type": "application/json" }
              : {}),
          }}
          body={
            bodyType === "json"
              ? (() => {
                  try {
                    return JSON.parse(body);
                  } catch {
                    return null;
                  }
                })()
              : bodyType === "file"
                ? selectedFile
                : bodyType === "formdata"
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
