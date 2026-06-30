import { type HttpMethod } from "@/types/openapi";
import { methodColors } from "@/constants/constants";

type MethodBadgeProps = { method: HttpMethod };

export default function MethodBadge({ method }: MethodBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${methodColors[method]}`}
    >
      {method}
    </span>
  );
}
