import {
  FORMAT,
  HTTP_METHODS,
  PARAMETER_TYPES,
  BODY_TYPES,
} from '@/constants/constants';

export type Format = (typeof FORMAT)[keyof typeof FORMAT];
export type HttpMethods = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
export type BodyTypes = (typeof BODY_TYPES)[keyof typeof BODY_TYPES];
export type ParameterType =
  (typeof PARAMETER_TYPES)[keyof typeof PARAMETER_TYPES];

export interface Spec {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, unknown>;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  parameters?: Parameter[];
}

export interface Operation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

export interface Parameter {
  name: string;
  in: ParameterType;
  required?: boolean;
  description?: string;
  schema?: Schema;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, { schema?: Schema; default?: unknown }>;
}

export interface Response {
  description?: string;
  content?: Record<string, { schema?: Schema; default?: unknown }>;
}

export interface Schema {
  type?: string;
  default?: unknown;
}

export type RequestBodyTypes =
  | string
  | ArrayBuffer
  | Uint8Array
  | FormData
  | Blob
  | File
  | URLSearchParams
  | JsonValue
  | number
  | boolean
  | null
  | undefined;

export type JsonValue =
  string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface ResponseData {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  isBinary?: boolean;
  size?: number;
  blob?: Blob;
}
