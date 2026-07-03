import SwaggerParser from "@apidevtools/swagger-parser";
import * as yaml from "js-yaml";
import { FORMAT } from "@/constants/constants";
import { type Format } from "@/types/openapi";

export interface ParseResult {
  valid: boolean;
  data?: any;
  error?: string;
  format?: Format;
}

export async function parseFormat(content: string): Promise<ParseResult> {
  try {
    const isJson = content.trim().startsWith("{");
    const data = isJson ? JSON.parse(content) : yaml.load(content);
    
    const originalLog = console.log;
    const originalError = console.error;
    console.log = () => {};
    console.error = () => {};
    await SwaggerParser.validate(data);
    console.log = originalLog;
    console.error = originalError;

    return {
      valid: true,
      data,
      format: isJson ? FORMAT.JSON : FORMAT.YAML,
    };
  } catch (error) {
    console.error("❌ Validation failed:", error);
    return {
      valid: false,
      error:
        error instanceof Error
          ? error.message
          : "Invalid OpenAPI specification",
    };
  }
}

export function convertFormat(
  content: string,
  from: Format,
  to: Format,
): string {
  const data = from === FORMAT.JSON ? JSON.parse(content) : yaml.load(content);
  return to === FORMAT.JSON
    ? JSON.stringify(data, null, 2)
    : yaml.dump(data, { indent: 2 });
}
