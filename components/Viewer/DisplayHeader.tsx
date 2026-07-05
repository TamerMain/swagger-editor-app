import MethodBadge from '@/components/Viewer/PathMethodBadge';
import { type HttpMethods, type Operation } from '@/types/openapi';

type DisplayHeaderProps = {
  method: HttpMethods;
  operation: Operation;
};

export default function DisplayHeader({
  method,
  operation,
}: DisplayHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-1 text-gray-500">
      <MethodBadge method={method} />
      {operation.summary && (
        <span className="text-white group-hover/method:text-blue-400 text-sm">{operation.summary}</span>
      )}
      {operation.operationId && (
        <span className="text-gray-500 text-[10px] font-mono">
          {operation.operationId}
        </span>
      )}
      {operation.description && (
        <p className="text-neutral-400 text-xs">
          {' | '}
          {operation.description}
        </p>
      )}
      {operation.tags && operation.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {operation.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-neutral-700/50 rounded text-[10px] text-neutral-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
