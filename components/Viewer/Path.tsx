import PathHeader from "@/components/Viewer/PathHeader";
import PathMethod from "@/components/Viewer/PathMethod";
import { getMethods } from "@/lib/getMethods";
import { Spec, PathItem } from "@/types/openapi";

type PathProps = {
  servers: Spec["servers"];
  path: string;
  pathItem: PathItem;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function Path({
  servers,
  path,
  pathItem,
  isExpanded,
  onToggle,
}: PathProps) {
  const methods = getMethods(pathItem);
  const pathLevelParameters = pathItem.parameters || undefined;

  return (
    <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900/50">
      <PathHeader
        path={path}
        methods={methods}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-neutral-700/50">
          {methods.map((method) => {
            const operation = pathItem[method];
            if (!operation) return null;
            return (
              <PathMethod
                key={method}
                servers={servers}
                method={method}
                operation={operation}
                path={path}
                pathLevelParameters={pathLevelParameters}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
