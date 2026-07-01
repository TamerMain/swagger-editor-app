'use server';

import { createClient } from "@/lib/supabase/server";
import { calculateBodySize } from "@/lib/requestSize";

export async function endpointTryout(
  endpoint: string,
  method: string,
  params: { headers?: Record<string, string>; body?: any }
) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authentication required");
  }

  const requestSize = calculateBodySize(params.body);
  const startTime = performance.now();

  try {
    // Make request
    const fetchOptions: RequestInit = { method, headers: params.headers || {} };
    
    if (params.body) {
      if (params.body instanceof FormData) {
        fetchOptions.body = params.body;
      } else {
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(params.body);
      }
    }

    const response = await fetch(endpoint, fetchOptions);
    const duration = performance.now() - startTime;

    // Check binary response
    const contentType = response.headers.get('content-type') || '';
    const isBinary = /image|octet-stream|pdf|zip/.test(contentType);

    let responseData: any;
    let responseSize = 0;

    if (isBinary) {
      const buffer = await response.arrayBuffer();
      responseSize = buffer.byteLength;
      responseData = Buffer.from(buffer).toString('base64');
    } else {
      const text = await response.text();
      responseSize = new Blob([text]).size;
      responseData = JSON.parse(text);
    }

    // Record history
    await supabase.from('history').insert({
      user_id: user.id,
      endpoint,
      method,
      request_size: requestSize,
      status_code: response.status,
      duration_ms: Math.round(duration),
      response_size: responseSize,
      error_details: null,
    });

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: responseData,
      isBinary,
      size: responseSize,
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
    throw error;
  }
}