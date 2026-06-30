import { type HttpMethod, type Parameter } from "@/types/openapi";

export const FORMAT = {
  JSON: "json",
  YAML: "yaml",
} as const;

export const methodColors: Record<HttpMethod, string> = {
  get: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  post: "bg-green-500/20 text-green-400 border-green-500/30",
  put: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  delete: "bg-red-500/20 text-red-400 border-red-500/30",
  patch: "bg-purple-500/20 text-purple-400 border-purple-500/30",
} as const;

export const parameterTypeColors: Record<Parameter["in"], string> = {
  path: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  query: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  header: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  cookie: "bg-pink-500/20 text-pink-400 border-pink-500/30",
} as const;

export const getStatusColor = (status: string) => {
  if (status.startsWith("2"))
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (status.startsWith("4"))
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (status.startsWith("5"))
    return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
};
