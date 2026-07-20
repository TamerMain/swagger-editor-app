import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PathMethod from './PathMethod';
import {
  type HttpMethods,
  type Operation,
  type Spec,
  type PathItem,
  type Parameter,
} from '@/types/openapi';
import { HTTP_METHODS, PARAMETER_TYPES } from '@/constants/constants';

vi.mock('./DisplayHeader', () => ({
  default: ({
    method,
    operation,
  }: {
    method: HttpMethods;
    operation: Operation;
  }) => (
    <div data-testid="display-header">
      <span data-testid="display-header-method">{method}</span>
      <span data-testid="display-header-summary">{operation.summary}</span>
    </div>
  ),
}));

vi.mock('@/components/Viewer/DisplayParameters', () => ({
  default: ({ parameters }: { parameters: Operation['parameters'] }) => (
    <div data-testid="display-parameters">
      <span data-testid="param-count">{parameters?.length ?? 0}</span>
    </div>
  ),
}));

vi.mock('@/components/Viewer/DisplayRequestBody', () => ({
  default: ({ requestBody }: { requestBody: Operation['requestBody'] }) => (
    <div data-testid="display-request-body">
      {requestBody && <span data-testid="has-request-body">true</span>}
    </div>
  ),
}));

vi.mock('@/components/Viewer/DisplayResponses', () => ({
  default: ({ responses }: { responses: Operation['responses'] }) => (
    <div data-testid="display-responses">
      <span data-testid="response-count">{Object.keys(responses).length}</span>
    </div>
  ),
}));

vi.mock('@/components/Viewer/TryItOut/TryItOut', () => ({
  default: ({
    method,
    path,
  }: {
    servers: Spec['servers'];
    method: HttpMethods;
    operation: Operation;
    path: string;
  }) => (
    <div data-testid="try-it-out">
      <span data-testid="try-it-out-method">{method}</span>
      <span data-testid="try-it-out-path">{path}</span>
    </div>
  ),
}));

const baseOperation: Operation = {
  summary: 'Get users',
  responses: { '200': { description: 'OK' } },
};

const baseServers: Spec['servers'] = [
  { url: 'https://api.example.com', description: 'Production' },
];

describe('PathMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all child components', () => {
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('display-header')).toBeInTheDocument();
    expect(screen.getByTestId('display-parameters')).toBeInTheDocument();
    expect(screen.getByTestId('display-request-body')).toBeInTheDocument();
    expect(screen.getByTestId('display-responses')).toBeInTheDocument();
    expect(screen.getByTestId('try-it-out')).toBeInTheDocument();
  });

  it('passes method and operation to DisplayHeader', () => {
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.POST}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('display-header-method')).toHaveTextContent(
      'post',
    );
    expect(screen.getByTestId('display-header-summary')).toHaveTextContent(
      'Get users',
    );
  });

  it('passes method and path to TryItOut', () => {
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.DELETE}
        operation={baseOperation}
        path="/users/{id}"
      />,
    );
    expect(screen.getByTestId('try-it-out-method')).toHaveTextContent('delete');
    expect(screen.getByTestId('try-it-out-path')).toHaveTextContent(
      '/users/{id}',
    );
  });

  it('passes operation responses to DisplayResponses', () => {
    const operation: Operation = {
      responses: {
        '200': { description: 'OK' },
        '404': { description: 'Not Found' },
      },
    };
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('response-count')).toHaveTextContent('2');
  });

  it('passes requestBody to DisplayRequestBody when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      requestBody: {
        content: { 'application/json': {} },
        required: true,
      },
    };
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.POST}
        operation={operation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('has-request-body')).toBeInTheDocument();
  });

  it('merges operation and path-level parameters and deduplicates', () => {
    const operationParam: Parameter = {
      name: 'id',
      in: PARAMETER_TYPES.PATH,
      required: true,
    };
    const pathLevelParam: Parameter = {
      name: 'id',
      in: PARAMETER_TYPES.PATH,
      required: false,
    };
    const extraParam: Parameter = {
      name: 'limit',
      in: PARAMETER_TYPES.QUERY,
    };

    const operation: Operation = {
      ...baseOperation,
      parameters: [operationParam],
    };

    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users/{id}"
        pathLevelParameters={[pathLevelParam, extraParam]}
      />,
    );
    expect(screen.getByTestId('param-count')).toHaveTextContent('2');
  });

  it('uses only operation parameters when no path-level parameters are provided', () => {
    const operation: Operation = {
      ...baseOperation,
      parameters: [
        { name: 'id', in: PARAMETER_TYPES.PATH },
        { name: 'limit', in: PARAMETER_TYPES.QUERY },
      ],
    };
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('param-count')).toHaveTextContent('2');
  });

  it('uses only path-level parameters when operation has none', () => {
    const operation: Operation = { ...baseOperation };
    const pathLevelParameters: PathItem['parameters'] = [
      { name: 'version', in: PARAMETER_TYPES.HEADER },
    ];
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users"
        pathLevelParameters={pathLevelParameters}
      />,
    );
    expect(screen.getByTestId('param-count')).toHaveTextContent('1');
  });

  it('renders zero parameters when neither operation nor path-level parameters exist', () => {
    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('param-count')).toHaveTextContent('0');
  });

  it('keeps operation-level parameter over duplicate path-level parameter', () => {
    const operationParam: Parameter = {
      name: 'id',
      in: PARAMETER_TYPES.PATH,
      required: true,
      description: 'operation-level',
    };
    const pathParam: Parameter = {
      name: 'id',
      in: PARAMETER_TYPES.PATH,
      required: false,
      description: 'path-level',
    };

    const operation: Operation = {
      ...baseOperation,
      parameters: [operationParam],
    };

    render(
      <PathMethod
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users/{id}"
        pathLevelParameters={[pathParam]}
      />,
    );
    expect(screen.getByTestId('param-count')).toHaveTextContent('1');
  });
});
