'use client';

import { buildUrl, buildHeaders, buildBody } from '@/lib/requestBuilder';
import { PARAMETER_TYPES, TRY_IT_OUT_FIELDS } from '@/constants/constants';
import { Spec, Operation, HttpMethods, BodyTypes } from '@/types/openapi';

type TryCurlProps = {
  servers: Spec['servers'];
  method: HttpMethods;
  operation: Operation;
  path: string;
};

export default function TryCurl({
  servers,
  method,
  operation,
  path,
}: TryCurlProps) {
  const handleCurl = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const form = e.currentTarget.closest('form');
    if (!form) return;

    const data = new FormData(form);

    const params = operation?.parameters || [];
    const pathParams = params.filter((p) => p.in === PARAMETER_TYPES.PATH);
    const queryParams = params.filter((p) => p.in === PARAMETER_TYPES.QUERY);
    const headerParams = params.filter((p) => p.in === PARAMETER_TYPES.HEADER);

    const url = buildUrl({
      data,
      servers,
      path,
      pathParams,
      queryParams,
    });

    const bodyType =
      (data.get(TRY_IT_OUT_FIELDS.BODY.CURRENT_TYPE) as BodyTypes) || 'json';
    const headers = buildHeaders({
      data,
      headerParams,
      customHeaders: data.get(TRY_IT_OUT_FIELDS.HEADERS) as string,
      contentType:
        Object.keys(operation.requestBody?.content || {})[0] ||
        'application/json',
      bodyType,
    });

    const body = buildBody({ data, bodyType });

    let curl = `curl -X ${method.toUpperCase()} "${url}"`;

    Object.entries(headers).forEach(([key, value]) => {
      if (value) curl += ` \\\n  -H "${key}: ${value}"`;
    });

    if (body) {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      curl += ` \\\n  -d '${bodyStr}'`;
    }

    navigator.clipboard.writeText(curl);
  };

  return (
    <button
      type="button"
      onClick={handleCurl}
      className="px-2 py-1 bg-neutral-600 hover:bg-neutral-700 rounded text-white text-xs"
    >
      cURL
    </button>
  );
}
