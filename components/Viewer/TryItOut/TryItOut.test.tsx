import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TryItOut from './TryItOut';
import {
  type Operation,
  type Spec,
  type HttpMethods,
  type ParameterType,
  type Parameter,
  type ResponseData,
} from '@/types/openapi';
import { HTTP_METHODS, PARAMETER_TYPES } from '@/constants/constants';
import { executeRequest } from '@/app/actions/tryout';
import { buildUrl, buildHeaders, buildBody } from '@/lib/requestBuilder';

vi.mock('@/app/actions/tryout', () => ({
  executeRequest: vi.fn(),
}));

vi.mock('@/lib/requestBuilder', () => ({
  buildUrl: vi.fn(),
  buildHeaders: vi.fn(),
  buildBody: vi.fn(),
}));

vi.mock('./TryURL', () => ({
  default: ({ servers }: { servers: Spec['servers'] }) => (
    <div data-testid="try-url">
      <span data-testid="try-url-server">{servers?.[0]?.url}</span>
    </div>
  ),
}));

vi.mock('./TryParameters', () => ({
  default: ({ type, params }: { type: ParameterType; params: Parameter[] }) => (
    <div data-testid={`try-parameters-${type}`}>
      <span data-testid={`try-parameters-${type}-count`}>{params.length}</span>
    </div>
  ),
}));

vi.mock('./TryHeaders', () => ({
  default: ({ headerParams }: { headerParams: Operation['parameters'] }) => (
    <div data-testid="try-headers">
      <span data-testid="try-headers-count">{headerParams?.length ?? 0}</span>
    </div>
  ),
}));

vi.mock('./TryBody', () => ({
  default: ({
    requestBody,
    method,
  }: {
    requestBody: Operation['requestBody'];
    method: string;
  }) => (
    <div data-testid="try-body">
      <span data-testid="try-body-method">{method}</span>
      {requestBody && <span data-testid="has-request-body">true</span>}
    </div>
  ),
}));

vi.mock('./TryResponse', () => ({
  default: ({
    response,
    error,
  }: {
    response: {
      status: number;
      headers: Record<string, string>;
      body: unknown;
    };
    error?: string | null;
  }) => (
    <div data-testid="try-response">
      <span data-testid="try-response-status">{response.status}</span>
      {error && <span data-testid="try-response-error">{error}</span>}
    </div>
  ),
}));

vi.mock('./TryCurl', () => ({
  default: ({
    method,
    path,
  }: {
    servers: Spec['servers'];
    method: HttpMethods;
    operation: Operation;
    path: string;
  }) => (
    <div data-testid="try-curl">
      <span data-testid="try-curl-method">{method}</span>
      <span data-testid="try-curl-path">{path}</span>
    </div>
  ),
}));

const baseOperation: Operation = {
  responses: { '200': { description: 'OK' } },
};

const baseServers: Spec['servers'] = [
  { url: 'https://api.example.com', description: 'Production' },
];

const mockResponse: ResponseData = {
  status: 200,
  headers: { 'content-type': 'application/json' },
  body: { id: 1 },
};

describe('TryItOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (buildUrl as ReturnType<typeof vi.fn>).mockReturnValue(
      'https://api.example.com/users',
    );
    (buildHeaders as ReturnType<typeof vi.fn>).mockReturnValue({
      'Content-Type': 'application/json',
    });
    (buildBody as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
  });

  it('renders the Try It Out summary', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByText('Try It Out')).toBeInTheDocument();
  });

  it('renders all child components', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('try-url')).toBeInTheDocument();
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.PATH}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.QUERY}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.HEADER}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.COOKIE}`),
    ).toBeInTheDocument();
    expect(screen.getByTestId('try-headers')).toBeInTheDocument();
    expect(screen.getByTestId('try-body')).toBeInTheDocument();
    expect(screen.getByTestId('try-curl')).toBeInTheDocument();
  });

  it('passes servers to TryURL', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('try-url-server')).toHaveTextContent(
      'https://api.example.com',
    );
  });

  it('passes method to TryBody', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.POST}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('try-body-method')).toHaveTextContent('post');
  });

  it('passes method and path to TryCurl', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users/{id}"
      />,
    );
    expect(screen.getByTestId('try-curl-method')).toHaveTextContent('get');
    expect(screen.getByTestId('try-curl-path')).toHaveTextContent(
      '/users/{id}',
    );
  });

  it('correctly splits parameters by type', () => {
    const operation: Operation = {
      ...baseOperation,
      parameters: [
        { name: 'id', in: PARAMETER_TYPES.PATH },
        { name: 'limit', in: PARAMETER_TYPES.QUERY },
        { name: 'limit2', in: PARAMETER_TYPES.QUERY },
        { name: 'Authorization', in: PARAMETER_TYPES.HEADER },
        { name: 'session', in: PARAMETER_TYPES.COOKIE },
      ],
    };
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={operation}
        path="/users/{id}"
      />,
    );
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.PATH}-count`),
    ).toHaveTextContent('1');
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.QUERY}-count`),
    ).toHaveTextContent('2');
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.HEADER}-count`),
    ).toHaveTextContent('1');
    expect(
      screen.getByTestId(`try-parameters-${PARAMETER_TYPES.COOKIE}-count`),
    ).toHaveTextContent('1');
  });

  it('renders the Execute button', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(
      screen.getByRole('button', { name: /execute/i }),
    ).toBeInTheDocument();
  });

  it('does not render TryResponse before form submission', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    expect(screen.queryByTestId('try-response')).not.toBeInTheDocument();
  });

  it('calls executeRequest and shows response on successful submission', async () => {
    (executeRequest as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse,
    );
    const user = userEvent.setup({ delay: null });
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );

    await user.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(screen.getByTestId('try-response')).toBeInTheDocument();
    });
    expect(screen.getByTestId('try-response-status')).toHaveTextContent('200');
    expect(executeRequest).toHaveBeenCalledWith(
      'https://api.example.com/users',
      HTTP_METHODS.GET,
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('shows loading state while request is in progress', async () => {
    let resolveRequest: (value: ResponseData) => void;
    (executeRequest as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const user = userEvent.setup({ delay: null });
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );

    await user.click(screen.getByRole('button', { name: /execute/i }));

    expect(screen.getByRole('button', { name: /execute/i })).toBeDisabled();

    resolveRequest!(mockResponse);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /execute/i }),
      ).not.toBeDisabled();
    });
  });

  it('shows error state when executeRequest throws', async () => {
    (executeRequest as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network failure'),
    );
    const user = userEvent.setup({ delay: null });
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );

    await user.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /execute/i }),
      ).not.toBeDisabled();
    });
    expect(screen.queryByTestId('try-response')).not.toBeInTheDocument();
  });

  it('passes requestBody to TryBody when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      requestBody: { content: { 'application/json': {} }, required: true },
    };
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.POST}
        operation={operation}
        path="/users"
      />,
    );
    expect(screen.getByTestId('has-request-body')).toBeInTheDocument();
  });

  it('handles operation with no parameters gracefully', () => {
    render(
      <TryItOut
        servers={baseServers}
        method={HTTP_METHODS.GET}
        operation={baseOperation}
        path="/users"
      />,
    );
    Object.values(PARAMETER_TYPES).forEach((type) => {
      expect(
        screen.getByTestId(`try-parameters-${type}-count`),
      ).toHaveTextContent('0');
    });
  });
});
