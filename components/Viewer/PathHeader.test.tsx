import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PathHeader from './PathHeader';
import { type HttpMethods } from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/constants';

vi.mock('@/components/Viewer/PathMethodBadge', () => ({
  default: ({ method }: { method: HttpMethods }) => (
    <span data-testid={`method-badge-${method}`}>{method}</span>
  ),
}));

describe('PathHeader', () => {
  const mockOnToggle = vi.fn();

  it('renders the path', () => {
    render(
      <PathHeader
        path="/users"
        methods={[]}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.getByText('/users')).toBeInTheDocument();
  });

  it('renders all method badges', () => {
    const methods: HttpMethods[] = [HTTP_METHODS.GET, HTTP_METHODS.POST];
    render(
      <PathHeader
        path="/users"
        methods={methods}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.getByTestId('method-badge-get')).toBeInTheDocument();
    expect(screen.getByTestId('method-badge-post')).toBeInTheDocument();
  });

  it('renders no method badges when methods is empty', () => {
    render(
      <PathHeader
        path="/users"
        methods={[]}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.queryByTestId(/method-badge/)).not.toBeInTheDocument();
  });

  it('renders the collapsed indicator when not expanded', () => {
    render(
      <PathHeader
        path="/users"
        methods={[]}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.getByText('▷')).toBeInTheDocument();
    expect(screen.queryByText('▼')).not.toBeInTheDocument();
  });

  it('renders the expanded indicator when expanded', () => {
    render(
      <PathHeader
        path="/users"
        methods={[]}
        isExpanded={true}
        onToggle={mockOnToggle}
      />,
    );
    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.queryByText('▷')).not.toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <PathHeader
        path="/users"
        methods={[]}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    await user.click(screen.getByText('/users'));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('renders all HTTP methods as badges', () => {
    const methods = Object.values(HTTP_METHODS);
    render(
      <PathHeader
        path="/users"
        methods={methods}
        isExpanded={false}
        onToggle={mockOnToggle}
      />,
    );
    methods.forEach((method) => {
      expect(screen.getByTestId(`method-badge-${method}`)).toBeInTheDocument();
    });
  });
});
