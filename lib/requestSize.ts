import { RequestBody } from "@/types/tryitout";

export function calculateBodySize(body: RequestBody): number {
  // 1. No Body
  if (!body) return 0;

  // 2. Strings
  if (typeof body === "string") {
    return new Blob([body]).size;
  }

  // 3. ArrayBuffer
  if (body instanceof ArrayBuffer) {
    return body.byteLength;
  }

  // 4. TypedArrays
  if (body instanceof Uint8Array) {
    return body.length;
  }

  // 5. FormData
  if (body instanceof FormData) {
    let size = 0;
    for (const [, value] of body.entries()) {
      if (value instanceof File) {
        size += value.size;
      } else if (typeof value === "string") {
        size += new Blob([value]).size;
      }
    }
    return size;
  }

  // 6. Stand-alone Blobs (or Files passed directly)
  if (body instanceof Blob) {
    return body.size;
  }

  // 7. URLSearchParams
  if (body instanceof URLSearchParams) {
    return new Blob([body.toString()]).size;
  }

  // 8. JSON Objects
  if (body && typeof body === "object") {
    try {
      return new Blob([JSON.stringify(body)]).size;
    } catch {
      return 0;
    }
  }

  // 9. Numbers, Booleans, etc.
  if (typeof body === "number" || typeof body === "boolean") {
    return new Blob([String(body)]).size;
  }

  // 10. Unknown type
  return 0;
}
