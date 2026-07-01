import MethodBadge from "@/components/FormatViewer/MethodBadge";
import OperationDetails from "@/components/FormatViewer/OperationDetails";
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

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50">
      {/* Header */}
      <div
        className="p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
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
        <div className="p-3 pt-0 border-t border-gray-700/50">
          {methods.map((method) => {
            const operation = pathItem[method];
            if (!operation) return null;
            return (
              <OperationDetails
                key={method}
                method={method}
                operation={operation}
                path={path}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}