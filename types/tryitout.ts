export type RequestBody =
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
