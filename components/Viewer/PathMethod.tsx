import DisplayHeader from "./DisplayHeader";
import DisplayParameters from "@/components/Viewer/DisplayParameters";
import DisplayRequestBody from "@/components/Viewer/DisplayRequestBody";
import DisplayResponses from "@/components/Viewer/DisplayResponses";
import TryItOut from "@/components/Viewer/TryItOut/TryItOut";
import {
  type HttpMethods,
  type PathItem,
  type Operation,
  type Spec,
} from "@/types/openapi";

type PathMethodProps = {
  servers: Spec["servers"];
  method: HttpMethods;
  operation: Operation;
  path: string;
  pathLevelParameters?: PathItem["parameters"];
};

export default function PathMethod({
  servers,
  method,
  operation,
  path,
  pathLevelParameters = [],
}: PathMethodProps) {
  const mergedParameters = [
    ...(operation.parameters || []), // Operation level parameters
    ...(pathLevelParameters || []), // PathItem level parameters
  ];

  // Remove duplicates. Keep more specific parameters
  const uniqueParameters = mergedParameters.filter(
    (param, index, self) =>
      index ===
      self.findIndex((p) => p.name === param.name && p.in === param.in),
  );

  const mergedOperation = {
    ...operation,
    parameters: uniqueParameters,
  };

  return (
    <div className="pt-2 mt-2 border-t border-neutral-700/50 first:border-none">
      <DisplayHeader method={method} operation={operation} />
      <DisplayParameters parameters={uniqueParameters} />
      <DisplayRequestBody requestBody={operation.requestBody} />
      <DisplayResponses responses={operation.responses} />
      <TryItOut servers={servers} method={method} operation={mergedOperation} path={path} />
    </div>
  );
}
