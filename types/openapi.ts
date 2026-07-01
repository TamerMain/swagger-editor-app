export type Format = "json" | "yaml";
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type FetchParams = {
  headers?: HeadersInit;
  body?: BodyInit;
  [key: string]: unknown;
};


export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
  };
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
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
  in: "path" | "query" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: Schema;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, { schema?: Schema; example?: any }>;
}

export interface Response {
  description: string;
  content?: Record<string, { schema?: Schema; example?: any }>;
}

export interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  enum?: string[];
  example?: any;
}

