import { HTTP_METHODS } from "@/constants/constants";
import { type HttpMethods, type PathItem } from "@/types/openapi";

export const getMethods = (pathItem: PathItem): HttpMethods[] => {
  return Object.values(HTTP_METHODS).filter((method) => pathItem[method]);
};
