import SwaggerParser from '@apidevtools/swagger-parser';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as yaml from 'js-yaml';
import { FORMAT } from '@/constants/constants';
import { type Format, type Spec } from '@/types/openapi';

export interface ParseResult {
  valid: boolean;
  data?: Spec;
  error?: string;
  format?: Format;
}

export async function parseFormat(content: string): Promise<ParseResult> {
  try {
    const format = detectFormat(content);
    const isJson = format === 'json';
    const data = isJson ? JSON.parse(content) : yaml.load(content);

    const originalLog = console.log;
    const originalError = console.error;
    try {
      console.log = () => {};
      console.error = () => {};
      await SwaggerParser.validate(data);
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }

    // Unwrap $ref syntax
    const resolved = (await $RefParser.dereference(data)) as Spec;

    return {
      valid: true,
      data: resolved,
      format: isJson ? FORMAT.JSON : FORMAT.YAML,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error
          ? getReadableError(error.message)
          : 'Invalid OpenAPI specification',
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

function detectFormat(content: string): 'json' | 'yaml' {
  const trimmed = content.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  if (/^(openapi|swagger|info|paths|components):/i.test(trimmed)) {
    return 'yaml';
  }

  if (!trimmed) return 'yaml';

  try {
    JSON.parse(trimmed);
    return 'json';
  } catch {
    return 'yaml';
  }
}

const getReadableError = (message: string): string => {
  const errors: Record<string, string> = {
    'expected a document, but the input is empty':
      'No content provided. Please paste an OpenAPI specification.',
  };

  for (const [key, value] of Object.entries(errors)) {
    if (message.includes(key)) return value;
  }

  return message;
};
