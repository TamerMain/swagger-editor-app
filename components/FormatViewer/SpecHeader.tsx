import { type OpenAPISpec } from "@/types/openapi";

type SpecHeaderProps = { spec: OpenAPISpec; totalOperations: number };

export default function SpecHeader({ spec, totalOperations }: SpecHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white">{spec.info.title}</h2>
      <p className="text-gray-400 text-sm mb-2">Version: {spec.info.version}</p>

      {spec.info.description && (
        <p className="text-gray-300 text-sm mb-4">{spec.info.description}</p>
      )}

      <div className="flex gap-4 text-xs text-gray-400 mb-4">
        <span>Paths: {Object.keys(spec.paths).length}</span>
        <span>•</span>
        <span>Operations: {totalOperations}</span>
        {spec.components?.schemas && (
          <>
            <span>•</span>
            <span>Schemas: {Object.keys(spec.components.schemas).length}</span>
          </>
        )}
      </div>
    </div>
  );
}
