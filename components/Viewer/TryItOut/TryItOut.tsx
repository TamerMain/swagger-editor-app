import { useState } from 'react';
import { executeRequest } from '@/app/actions/tryout';
import { buildUrl, buildHeaders, buildBody } from '@/lib/requestBuilder';
import TryParameters from './TryParameters';
import TryHeaders from './TryHeaders';
import TryBody from './TryBody';
import TryURL from './TryURL';
import TryResponse from './TryResponse';
import TryCurl from './TryCurl';
import { PARAMETER_TYPES, TRY_IT_OUT_FIELDS } from '@/constants/constants';
import {
  Operation,
  Spec,
  type HttpMethods,
  type BodyTypes,
  type ResponseData,
} from '@/types/openapi';

type TryItOutProps = {
  servers: Spec['servers'];
  method: HttpMethods;
  operation: Operation;
  path: string;
};

export default function TryItOut({
  servers,
  method,
  operation,
  path,
}: TryItOutProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = operation?.parameters || [];
  const pathParams = params.filter((p) => p.in === PARAMETER_TYPES.PATH);
  const queryParams = params.filter((p) => p.in === PARAMETER_TYPES.QUERY);
  const headerParams = params.filter((p) => p.in === PARAMETER_TYPES.HEADER);
  const cookieParams = params.filter((p) => p.in === PARAMETER_TYPES.COOKIE);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const data = new FormData(e.currentTarget);

    try {
      const url = buildUrl({
        data,
        servers,
        path,
        pathParams,
        queryParams,
      });

      const headers = buildHeaders({
        data,
        headerParams,
        customHeaders: data.get(TRY_IT_OUT_FIELDS.HEADERS) as string,
        contentType:
          Object.keys(operation.requestBody?.content || {})[0] ||
          'application/json',
        bodyType:
          (data.get(TRY_IT_OUT_FIELDS.BODY.CURRENT_TYPE) as BodyTypes) ||
          'json',
      });

      const body = buildBody({
        data,
        bodyType:
          (data.get(TRY_IT_OUT_FIELDS.BODY.CURRENT_TYPE) as BodyTypes) ||
          'json',
      });

      const result = await executeRequest(url, method, { headers, body });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <details>
        <summary className="w-fit px-2 py-1 text-white hover:text-blue-400 cursor-pointer text-xs border-2 rounded border-transparent">
          Try It Out
        </summary>
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <div className="space-y-3">
              <TryURL servers={servers} />
              <TryParameters type={PARAMETER_TYPES.PATH} params={pathParams} />
              <TryParameters
                type={PARAMETER_TYPES.QUERY}
                params={queryParams}
              />
              <TryParameters
                type={PARAMETER_TYPES.HEADER}
                params={headerParams}
              />
              <TryParameters
                type={PARAMETER_TYPES.COOKIE}
                params={cookieParams}
              />
              <TryHeaders headerParams={headerParams} />
              <TryBody requestBody={operation.requestBody} method={method} />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                  disabled={loading}
                >
                  Execute
                </button>
                <TryCurl
                  servers={servers}
                  method={method}
                  operation={operation}
                  path={path}
                />
              </div>
              {response && <TryResponse response={response} error={error} />}
            </div>
          </div>
        </form>
      </details>
    </div>
  );
}
