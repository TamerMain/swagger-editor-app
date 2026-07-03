"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateBodySize } from "@/lib/requestSize";
import { type RequestBody } from "@/types/tryitout";

export async function executeRequest(
  endpoint: string,
  method: string,
  params: { headers?: Record<string, string>; body?: RequestBody },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authentication required");
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
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify(params.body);
      }
    }

    const response = await fetch(endpoint, fetchOptions);
    const duration = performance.now() - startTime;
    const responseBody = await response.text();
    const responseSize = calculateBodySize(responseBody);

    await supabase.from("history").insert({
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
      body: responseBody,
    };
  } catch (error) {
    await supabase.from("history").insert({
      user_id: user.id,
      endpoint,
      method,
      request_size: requestSize,
      status_code: 0,
      duration_ms: null,
      response_size: null,
      error_details: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
