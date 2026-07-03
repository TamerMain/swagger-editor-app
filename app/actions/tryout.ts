'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateBodySize } from '@/lib/requestSize';
import { type RequestBodyTypes } from '@/types/openapi';

export async function executeRequest(
  endpoint: string,
  method: string,
  params: { headers?: Record<string, string>; body?: RequestBodyTypes },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const requestSize = calculateBodySize(params.body);
  const startTime = performance.now();

  try {
    const fetchOptions: RequestInit = { method, headers: params.headers || {} };
    if (params.body) {
      if (params.body instanceof FormData) {
        fetchOptions.body = params.body;
      } else {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
        fetchOptions.body = JSON.stringify(params.body);
      }
    }

    const response = await fetch(endpoint, fetchOptions);
    const duration = performance.now() - startTime;
    const responseBody = await response.text();
    const responseSize = calculateBodySize(responseBody);
    let parsedBody;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch {
      parsedBody = responseBody;
    }

    await supabase.from('history').insert({
      user_id: user.id,
      endpoint,
      method,
      request_size: requestSize,
      status_code: response.status,
      duration_ms: Math.round(duration),
      response_size: responseSize,
      error_details: response.ok
        ? null
        : `Status ${response.status}: ${response.statusText}`,
    });

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: parsedBody,
      ok: response.ok,
      statusText: response.statusText,
    };
  } catch (error) {
    await supabase.from('history').insert({
      user_id: user.id,
      endpoint,
      method,
      request_size: requestSize,
      status_code: 0,
      duration_ms: null,
      response_size: null,
      error_details: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      status: 0,
      headers: {},
      body: {
        error: error instanceof Error ? error.message : 'Request failed',
      },
      ok: false,
      statusText: 'Network Error',
    };
  }
}
