// components/Viewer/PathItem.tsx
import MethodBadge from "@/components/Viewer/MethodBadge";
import OperationDetails from "@/components/Viewer/OperationDetails";
import { getMethods } from "@/lib/getMethods";

type PathItemProps = {
  path: string;
  pathItem: any;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function PathItem({
  path,
  pathItem,
  isExpanded,
  onToggle,
}: PathItemProps) {
  const methods = getMethods(pathItem);

  // ✅ Extract path-level parameters (common to all operations)
  const pathItemParameters = pathItem.parameters || [];

  return (
    <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900/50">
      {/* Header */}
      <div
        className="p-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-mono text-sm">{path}</span>
            <div className="flex gap-1">
              {methods.map((method) => (
                <MethodBadge key={method} method={method} />
              ))}
            </div>
          </div>
          <span className="text-gray-500 text-xs">
            {isExpanded ? "▼" : "▶"}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-neutral-700/50">
          {methods.map((method) => {
            const operation = pathItem[method];
            console.log("Operation");
            console.log(pathItem);
            if (!operation) return null;
            return (
              <OperationDetails
                key={method}
                method={method}
                operation={operation}
                path={path}
                pathItemParameters={pathItemParameters} // ✅ Pass path-level params down
              />
            );
          })}
        </div>
      )}
    </div>
  );
}