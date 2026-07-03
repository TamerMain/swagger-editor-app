import {
  TRY_IT_OUT_FIELDS,
  PARAMETER_TYPES,
  BODY_TYPES,
} from "@/constants/constants";
import { type BodyTypes, Spec, Parameter, RequestBodyTypes } from "@/types/openapi";

type BuildUrlParams = {
  data: FormData;
  servers: Spec["servers"];
  path: string;
  pathParams: Parameter[];
  queryParams: Parameter[];
};

export function buildUrl({
  data,
  servers,
  path,
  pathParams,
  queryParams,
}: BuildUrlParams): string {
  // Get base URL (first server URL by default)
  const baseUrl =
    (data.get(TRY_IT_OUT_FIELDS.URL) as string) || servers?.[0]?.url || "";
  const cleanBase = baseUrl.replace(/\/$/, "");

  // Replace path params
  let fullPath = path;
  pathParams.forEach((p) => {
    const value =
      (data.get(
        `${TRY_IT_OUT_FIELDS.PARAMETER}_${PARAMETER_TYPES.PATH}_${p.name}`,
      ) as string) || "";
    fullPath = fullPath.replace(`{${p.name}}`, value);
  });

  // Add query params
  const queryStrings = queryParams
    .map((p) => {
      const value = data.get(
        `${TRY_IT_OUT_FIELDS.PARAMETER}_${PARAMETER_TYPES.QUERY}_${p.name}`,
      ) as string;
      return value ? `${p.name}=${encodeURIComponent(value)}` : null;
    })
    .filter(Boolean)
    .join("&");

  const url = `${cleanBase}${fullPath}`;
  return queryStrings ? `${url}?${queryStrings}` : url;
}

type BuildHeadersParams = {
  data: FormData;
  headerParams: Parameter[];
  customHeaders?: string;
  contentType?: string;
  bodyType: BodyTypes;
};

export function buildHeaders({
  data,
  headerParams,
  customHeaders,
  contentType,
  bodyType,
}: BuildHeadersParams): Record<string, string> {
  const headers: Record<string, string> = {};

  // Headers from Spec header parameters
  headerParams.forEach((p) => {
    const value = data.get(
      `${TRY_IT_OUT_FIELDS.PARAMETER}_${PARAMETER_TYPES.HEADER}_${p.name}`,
    ) as string;
    if (value) headers[p.name] = value;
  });

  // Content-type from Spec request body (other types browser handle itself)
  if (
    contentType &&
    (bodyType === BODY_TYPES.JSON || bodyType === BODY_TYPES.TEXT)
  ) {
    headers["Content-Type"] = contentType;
  }

  // Add Custom headers
  if (customHeaders) {
    try {
      const parsed = JSON.parse(customHeaders);
      Object.assign(headers, parsed);
    } catch {
      // Invalid JSON - ignore
    }
  }

  return headers;
}

type BuildBodyParams = {
  data: FormData;
  bodyType: BodyTypes;
};

export function buildBody({ data, bodyType }: BuildBodyParams): RequestBodyTypes {
  if (bodyType === BODY_TYPES.JSON) {
    const raw = data.get(TRY_IT_OUT_FIELDS.BODY.JSON) as string;
    if (!raw || !raw.trim()) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return raw; // Invalid JSON - Return raw
    }
  }

  if (bodyType === BODY_TYPES.TEXT) {
    return (data.get(TRY_IT_OUT_FIELDS.BODY.TEXT) as string) || undefined;
  }

  if (bodyType === BODY_TYPES.FILE) {
    const file = data.get(TRY_IT_OUT_FIELDS.BODY.FILE);
    if (file instanceof File) {
      const fd = new FormData();
      fd.append("file", file);
      return fd;
    }
    return undefined;
  }

  if (bodyType === BODY_TYPES.FORM_DATA) {
    const fd = new FormData();
    for (const [key, value] of data) {
      if (key.startsWith(`${TRY_IT_OUT_FIELDS.BODY.FORM_DATA.KEY}_`)) {
        const id = key.replace(`${TRY_IT_OUT_FIELDS.BODY.FORM_DATA.KEY}`, "");
        const fieldKey = value as string;
        const fieldValue = data.get(
          `${TRY_IT_OUT_FIELDS.BODY.FORM_DATA.VALUE}_${id}`,
        );
        if (fieldKey && fieldValue) {
          fd.append(fieldKey, fieldValue);
        }
      }
    }
    return fd;
  }

  return undefined;
}
