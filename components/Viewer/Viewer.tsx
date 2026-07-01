import { useState } from "react";
import SpecHeader from "@/components/Viewer/SpecHeader";
import PathItem from "@/components/Viewer/PathItem";
import { getMethods } from "@/lib/getMethods";
import { type OpenAPISpec } from "@/types/openapi";

interface ViewerProps {
  spec: OpenAPISpec | null;
  isValid: boolean;
}

export default function Viewer({ spec, isValid }: ViewerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>(
    {},
  );

  if (!isValid || !spec) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg">No valid OpenAPI spec loaded</p>
          <p className="text-sm mt-2">Edit the spec on the left</p>
        </div>
      </div>
    );
  }

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const totalOperations = Object.values(spec.paths).reduce(
    (acc, pathItem) => acc + getMethods(pathItem).length,
    0,
  );

  const hasPaths = Object.keys(spec.paths).length > 0;

  return (
    <div className="space-y-6">
      <SpecHeader spec={spec} totalOperations={totalOperations} />

      <div className="space-y-3">
        {Object.entries(spec.paths).map(([path, pathItem]) => (
          <PathItem
            key={path}
            path={path}
            pathItem={pathItem}
            isExpanded={expandedPaths[path] || false}
            onToggle={() => togglePath(path)}
          />
        ))}
      </div>

      {!hasPaths && (
        <div className="text-center text-gray-500 py-8">
          <p>No paths defined in the specification</p>
        </div>
      )}
    </div>
  );
}
