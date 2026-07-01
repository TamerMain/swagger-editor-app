"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { useState, useEffect } from "react";
import { parseFormat, convertFormat } from "@/lib/formatParser";
import { FORMAT } from "@/constants/constants";
import { type Format } from "@/types/openapi";

interface EditorProps {
  onSpecChange?: (content: string) => void;
}

export default function Editor({ onSpecChange }: EditorProps) {
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
            className={`px-2 py-1 text-xs border-2 rounded font-mono ${
              format === "json"
                ? "bg-blue-500/20 border-blue-500/30"
                : "bg-green-500/20 border-green-500/30"
            }`}
          >
            {format.toUpperCase()}
          </span>

          {isValid && (
            <span className="text-xs text-green-500">✓ Valid OpenAPI</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFormatSwitch}
            className={`px-2 py-1 text-xs border-2 rounded font-mono ${
              format === "json"
                ? "bg-green-500/20 hover:bg-green-500/20 border-green-500/30"
                : "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30"
            }`}
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
