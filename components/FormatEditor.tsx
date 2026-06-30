"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { useState, useEffect } from "react";
import { parseFormat, convertFormat } from "@/lib/formatParser";
import { FORMAT } from "@/constants/constants";
import { type Format } from "@/types/openapi";

interface FormatEditorProps {
  onSpecChange?: (content: string) => void;
}

export default function FormatEditor({ onSpecChange }: FormatEditorProps) {
  const [code, setCode] = useState("");
  const [format, setFormat] = useState<Format>(FORMAT.YAML);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const loadSpec = async () => {
      try {
        const res = await fetch("/examples/petstorebigger.yaml");
        let content = await res.text();
        setCode(content);

        // ✅ Validate on initial load
        await validateContent(content);
      } catch (error) {
        console.error("Failed to load spec:", error);
        setErrors(["Failed to load specification file"]);
      }
    };
    loadSpec();
  }, []);

  const validateContent = async (content: string) => {
    const result = await parseFormat(content);

    if (result.valid) {
      setErrors([]);
      setIsValid(true);
      if (result.format && result.format !== format) {
        setFormat(result.format);
      }
      onSpecChange?.(content);
    } else {
      setErrors([result.error || "Invalid specification"]);
      setIsValid(false);
      onSpecChange?.("");
    }
  };

  const handleChange = async (value: string) => {
    setCode(value);
    await validateContent(value);
  };

  const handleFormatSwitch = () => {
    console.log("Current code:", code); // ← Check console
    console.log("Current format:", format);
    try {
      const newFormat = format === FORMAT.JSON ? FORMAT.YAML : FORMAT.JSON;
      const converted = convertFormat(code, format, newFormat);
      setCode(converted);
      setFormat(newFormat);
      setErrors([]);
    } catch (error) {
      setErrors(["Failed to convert format"]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Format:</span>
          <span
            className={`px-2 py-1 text-xs rounded font-mono ${
              format === "json" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {format.toUpperCase()}
          </span>

          {isValid && (
            <span className="text-xs text-green-400">✓ Valid OpenAPI</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFormatSwitch}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition"
            disabled={errors.length !== 0}
          >
            Switch to {format === FORMAT.JSON ? "YAML" : "JSON"}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[format === FORMAT.JSON ? json() : yaml(), oneDark]}
          onChange={handleChange}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="sticky bottom-0 w-full p-3 border-t border-red-500 bg-red-900/50">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-400 font-mono">
              ❌ {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
