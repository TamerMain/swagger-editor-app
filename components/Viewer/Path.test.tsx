import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Path from './Path';
import { type PathItem, type Spec, type HttpMethods } from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/constants';
import { getMethods } from '@/lib/getMethods';

vi.mock('@/lib/getMethods', () => ({
  getMethods: vi.fn(),
}));

vi.mock('@/components/Viewer/PathHeader', () => ({
  default: ({
    path,
    methods,
    isExpanded,
    onToggle,
  }: {
    path: string;
    methods: HttpMethods[];
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div data-testid="path-header">
      <span data-testid="path-value">{path}</span>
      <span data-testid="is-expanded">{String(isExpanded)}</span>
      <span data-testid="methods">{methods.join(',')}</span>
      <button onClick={onToggle}>Toggle</button>
    </div>
  ),
}));

vi.mock('@/components/Viewer/PathMethod', () => ({
  default: ({
    method,
    path,
  }: {
    servers: Spec['servers'];
    method: HttpMethods;
    operation: object;
    path: string;
    pathLevelParameters?: PathItem['parameters'];
  }) => (
    <div data-testid={`path-method-${method}`}>
      <span>{method}</span>
      <span>{path}</span>
    </div>
  ),
}));

const basePathItem: PathItem = {
  get: { responses: { '200': { description: 'OK' } } },
  post: { responses: { '201': { description: 'Created' } } },
};

const baseServers: Spec['servers'] = [
  { url: 'https://api.example.com', description: 'Production' },
];

describe('Path', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([
      HTTP_METHODS.GET,
      HTTP_METHODS.POST,
    ]);
  });

  it('renders PathHeader with correct props', () => {
    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('path-value')).toHaveTextContent('/users');
    expect(screen.getByTestId('is-expanded')).toHaveTextContent('false');
    expect(screen.getByTestId('methods')).toHaveTextContent('get,post');
  });

  it('calls getMethods with the pathItem', () => {
    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(getMethods).toHaveBeenCalledWith(basePathItem);
  });

  it('does not render PathMethod components when collapsed', () => {
    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.queryByTestId('path-method-get')).not.toBeInTheDocument();
    expect(screen.queryByTestId('path-method-post')).not.toBeInTheDocument();
  });

  it('renders PathMethod components when expanded', () => {
    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.getByTestId('path-method-get')).toBeInTheDocument();
    expect(screen.getByTestId('path-method-post')).toBeInTheDocument();
  });

  it('calls onToggle when the toggle button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('skips rendering PathMethod when operation is undefined for a method', () => {
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([
      HTTP_METHODS.GET,
      HTTP_METHODS.DELETE,
    ]);

    const pathItem: PathItem = {
      get: { responses: { '200': { description: 'OK' } } },
    };

    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={pathItem}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('path-method-get')).toBeInTheDocument();
    expect(screen.queryByTestId('path-method-delete')).not.toBeInTheDocument();
  });

  it('passes path-level parameters to PathMethod', () => {
    const pathItem: PathItem = {
      get: { responses: { '200': { description: 'OK' } } },
      parameters: [{ name: 'version', in: 'path', required: true }],
    };
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([
      HTTP_METHODS.GET,
    ]);

    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={pathItem}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('path-method-get')).toBeInTheDocument();
  });

  it('handles pathItem with no parameters gracefully', () => {
    const pathItem: PathItem = {
      get: { responses: { '200': { description: 'OK' } } },
    };
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([
      HTTP_METHODS.GET,
    ]);

    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={pathItem}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('path-method-get')).toBeInTheDocument();
  });

  it('renders nothing in the expanded section when no methods exist', () => {
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([]);

    render(
      <Path
        servers={baseServers}
        path="/empty"
        pathItem={{}}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.queryByTestId(/path-method/)).not.toBeInTheDocument();
  });

  it('passes servers down to PathMethod', () => {
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([
      HTTP_METHODS.GET,
    ]);

    render(
      <Path
        servers={baseServers}
        path="/users"
        pathItem={basePathItem}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('path-method-get')).toBeInTheDocument();
  });
});
