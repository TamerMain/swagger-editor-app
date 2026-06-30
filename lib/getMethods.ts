import { type HttpMethod } from "@/types/openapi";

export const getMethods = (pathItem: any): HttpMethod[] => {
  const methods: HttpMethod[] = [];
  ["get", "post", "put", "delete", "patch"].forEach((method) => {
    if (pathItem[method as HttpMethod]) {
      methods.push(method as HttpMethod);
    }
  });
  return methods;
};
