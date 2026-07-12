import { type Parameter } from '@/types/openapi';

export const FORMAT = {
  JSON: 'json',
  YAML: 'yaml',
} as const;

export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch',
} as const;

export const PARAMETER_TYPES = {
  PATH: 'path',
  QUERY: 'query',
  HEADER: 'header',
  COOKIE: 'cookie',
} as const;

export const BODY_TYPES = {
  JSON: 'json',
  TEXT: 'text',
  FORM_DATA: 'formdata',
  FILE: 'file',
} as const;

export const TRY_IT_OUT_FIELDS = {
  URL: 'url',
  HEADERS: 'headers',
  BODY: {
    CURRENT_TYPE: 'body_type',
    JSON: 'body_json',
    TEXT: 'body_text',
    FILE: 'body_file',
    FORM_DATA: {
      KEY: 'body_formdata_key',
      VALUE: 'body_formdata_value',
    },
  },
  PARAMETER: 'param',
} as const;

export const METHOD_COLORS = {
  get: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  post: 'bg-green-500/20 text-green-400 border-green-500/30',
  put: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  delete: 'bg-red-500/20 text-red-400 border-red-500/30',
  patch: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
} as const;

export const PARAMETER_TYPE_COLORS = {
  path: 'text-blue-400/85',
  query: 'text-green-400/85',
  header: 'text-yellow-400/85',
  cookie: 'text-pink-400/85',
} as const;

export const PARAMETER_TYPE_BADGE_COLORS: Record<Parameter['in'], string> = {
  path: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  query: 'bg-green-500/20 text-green-400 border-green-500/30',
  header: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  cookie: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
} as const;

export const getStatusColor = (status: string) => {
  if (status.startsWith('2'))
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (status.startsWith('4'))
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (status.startsWith('5'))
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const getHistoryStatusColor = (code: number) => {
  if (code === 0) return 'text-red-300 bg-red-900 border-red-700';
  if (code >= 200 && code < 300)
    return 'text-green-400 bg-green-900 border-green-700';
  if (code >= 300 && code < 400)
    return 'text-blue-400 bg-blue-900 border-blue-700';
  if (code >= 400 && code < 500)
    return 'text-yellow-400 bg-yellow-900 border-yellow-700';
  if (code >= 500) return 'text-red-300 bg-red-500 border-red-700';
  return 'text-gray-400 bg-gray-900 border-gray-700';
};

export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'locale';
