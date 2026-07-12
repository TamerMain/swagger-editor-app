import { type HttpMethods } from '@/types/openapi';
import { METHOD_COLORS } from '@/constants/constants';

type PathMethodBadgeProps = { method: HttpMethods };

export default function PathMethodBadge({ method }: PathMethodBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${METHOD_COLORS[method]}`}
    >
      {method}
    </span>
  );
}
