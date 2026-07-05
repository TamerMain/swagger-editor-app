import PathMethodBadge from "@/components/Viewer/PathMethodBadge";
import { type HttpMethods } from "@/types/openapi";

type PathHeaderProps = {
  path: string;
  methods: HttpMethods[];
  isExpanded: boolean;
  onToggle: () => void;
};

export default function PathHeader({
  path,
  methods,
  isExpanded,
  onToggle,
}: PathHeaderProps) {
  return (
    <div
      className="p-3 cursor-pointer hover:bg-neutral-800/50 transition-colors group/path"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-mono text-sm group-hover/path:text-blue-400">{path}</span>
          <div className="flex gap-1">
            {methods.map((method) => (
              <PathMethodBadge key={method} method={method} />
            ))}
          </div>
        </div>
        <span className="text-gray-500 text-xs">{isExpanded ? "▼" : "▷"}</span>
      </div>
    </div>
  );
}
