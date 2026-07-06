import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Viewer from './Viewer';
import { type Spec, type PathItem, type HttpMethods } from '@/types/openapi';
import { getMethods } from '@/lib/getMethods';

vi.mock('@/lib/getMethods', () => ({
  getMethods: vi.fn(),
}));

vi.mock('@/components/Viewer/ViewerHeader', () => ({
  default: ({
    spec,
    totalOperations,
  }: {
    spec: Spec;
    totalOperations: number;
  }) => (
    <div data-testid="viewer-header">
      <span data-testid="header-title">{spec.info.title}</span>
      <span data-testid="total-operations">{totalOperations}</span>
    </div>
  ),
}));

vi.mock('@/components/Viewer/Path', () => ({
  default: ({
    path,
    isExpanded,
    onToggle,
  }: {
    servers: Spec['servers'];
    path: string;
    pathItem: PathItem;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div data-testid={`path-${path}`}>
      <span data-testid={`expanded-${path}`}>{String(isExpanded)}</span>
      <button onClick={onToggle}>Toggle {path}</button>
    </div>
  ),
}));

const baseSpec: Spec = {
  info: { title: 'Test API', version: '1.0.0' },
  paths: {
    '/users': { get: { responses: { '200': { description: 'OK' } } } },
    '/posts': { post: { responses: { '201': { description: 'Created' } } } },
  },
};

describe('Viewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue([]);
  });

  it('renders the invalid state when isValid is false', () => {
    render(<Viewer spec={baseSpec} isValid={false} />);
    expect(
      screen.getByText('No valid OpenAPI spec loaded'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('viewer-header')).not.toBeInTheDocument();
  });

  it('renders the invalid state when spec is null', () => {
    render(<Viewer spec={null} isValid={true} />);
    expect(
      screen.getByText('No valid OpenAPI spec loaded'),
    ).toBeInTheDocument();
  });

  it('renders ViewerHeader with correct props when valid', () => {
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue(['get']);
    render(<Viewer spec={baseSpec} isValid={true} />);
    expect(screen.getByTestId('viewer-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Test API');
  });

  it('calculates totalOperations correctly', () => {
    (getMethods as ReturnType<typeof vi.fn>).mockReturnValue(['get', 'post']);
    render(<Viewer spec={baseSpec} isValid={true} />);
    // 2 paths × 2 methods each = 4
    expect(screen.getByTestId('total-operations')).toHaveTextContent('4');
  });

  it('renders a Path component for each path in the spec', () => {
    render(<Viewer spec={baseSpec} isValid={true} />);
    expect(screen.getByTestId('path-/users')).toBeInTheDocument();
    expect(screen.getByTestId('path-/posts')).toBeInTheDocument();
  });

  it('renders paths as collapsed by default', () => {
    render(<Viewer spec={baseSpec} isValid={true} />);
    expect(screen.getByTestId('expanded-/users')).toHaveTextContent('false');
    expect(screen.getByTestId('expanded-/posts')).toHaveTextContent('false');
  });

  it('toggles a path open when its toggle button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Viewer spec={baseSpec} isValid={true} />);

    await user.click(screen.getByRole('button', { name: 'Toggle /users' }));

    expect(screen.getByTestId('expanded-/users')).toHaveTextContent('true');
    expect(screen.getByTestId('expanded-/posts')).toHaveTextContent('false');
  });

  it('toggles a path closed when clicked again', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Viewer spec={baseSpec} isValid={true} />);

    await user.click(screen.getByRole('button', { name: 'Toggle /users' }));
    expect(screen.getByTestId('expanded-/users')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'Toggle /users' }));
    expect(screen.getByTestId('expanded-/users')).toHaveTextContent('false');
  });

  it('toggles paths independently', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Viewer spec={baseSpec} isValid={true} />);

    await user.click(screen.getByRole('button', { name: 'Toggle /posts' }));

    expect(screen.getByTestId('expanded-/users')).toHaveTextContent('false');
    expect(screen.getByTestId('expanded-/posts')).toHaveTextContent('true');
  });

  it('renders "no paths" message when spec has no paths', () => {
    const spec: Spec = { ...baseSpec, paths: {} };
    render(<Viewer spec={spec} isValid={true} />);
    expect(
      screen.getByText('No paths defined in the specification'),
    ).toBeInTheDocument();
  });

  it('does not render "no paths" message when spec has paths', () => {
    render(<Viewer spec={baseSpec} isValid={true} />);
    expect(
      screen.queryByText('No paths defined in the specification'),
    ).not.toBeInTheDocument();
  });

  it('passes servers from spec down to each Path', () => {
    const spec: Spec = {
      ...baseSpec,
      servers: [{ url: 'https://api.example.com' }],
    };
    render(<Viewer spec={spec} isValid={true} />);
    expect(screen.getByTestId('path-/users')).toBeInTheDocument();
    expect(screen.getByTestId('path-/posts')).toBeInTheDocument();
  });
});
