import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DisplayHeader from './DisplayHeader';
import { type HttpMethods, type Operation } from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/constants';

vi.mock('@/components/Viewer/PathMethodBadge', () => ({
  default: ({ method }: { method: HttpMethods }) => (
    <span data-testid="method-badge">{method}</span>
  ),
}));

const baseOperation: Operation = {
  responses: {},
};

describe('DisplayHeader', () => {
  it('renders the method badge with the correct method', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.GET} operation={baseOperation} />,
    );
    expect(screen.getByTestId('method-badge')).toHaveTextContent('get');
  });

  it('renders summary when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      summary: 'Get all users',
    };
    render(<DisplayHeader method={HTTP_METHODS.GET} operation={operation} />);
    expect(screen.getByText('Get all users')).toBeInTheDocument();
  });

  it('does not render summary when not provided', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.GET} operation={baseOperation} />,
    );
    expect(screen.queryByText(/get all users/i)).not.toBeInTheDocument();
  });

  it('renders operationId when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      operationId: 'getUsers',
    };
    render(<DisplayHeader method={HTTP_METHODS.GET} operation={operation} />);
    expect(screen.getByText('getUsers')).toBeInTheDocument();
  });

  it('does not render operationId when not provided', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.GET} operation={baseOperation} />,
    );
    expect(screen.queryByText('getUsers')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      description: 'Returns a list of all users in the system',
    };
    render(<DisplayHeader method={HTTP_METHODS.POST} operation={operation} />);
    expect(
      screen.getByText('Returns a list of all users in the system'),
    ).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.GET} operation={baseOperation} />,
    );
    expect(
      screen.queryByText('Returns a list of all users in the system'),
    ).not.toBeInTheDocument();
  });

  it('renders all tags when provided', () => {
    const operation: Operation = {
      ...baseOperation,
      tags: ['users', 'admin'],
    };
    render(<DisplayHeader method={HTTP_METHODS.GET} operation={operation} />);
    expect(screen.getByText('#users')).toBeInTheDocument();
    expect(screen.getByText('#admin')).toBeInTheDocument();
  });

  it('does not render tags section when tags array is empty', () => {
    const operation: Operation = {
      ...baseOperation,
      tags: [],
    };
    render(<DisplayHeader method={HTTP_METHODS.GET} operation={operation} />);
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it('does not render tags section when tags is not provided', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.GET} operation={baseOperation} />,
    );
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it('renders correctly with all fields populated', () => {
    const operation: Operation = {
      summary: 'Create user',
      description: 'Creates a new user account',
      operationId: 'createUser',
      tags: ['users', 'auth'],
      responses: { '201': { description: 'Created' } },
    };
    render(<DisplayHeader method={HTTP_METHODS.POST} operation={operation} />);

    expect(screen.getByTestId('method-badge')).toHaveTextContent('post');
    expect(screen.getByText('Create user')).toBeInTheDocument();
    expect(screen.getByText('createUser')).toBeInTheDocument();
    expect(screen.getByText('Creates a new user account')).toBeInTheDocument();
    expect(screen.getByText('#users')).toBeInTheDocument();
    expect(screen.getByText('#auth')).toBeInTheDocument();
  });

  it('renders correctly with only required fields', () => {
    render(
      <DisplayHeader method={HTTP_METHODS.DELETE} operation={baseOperation} />,
    );
    expect(screen.getByTestId('method-badge')).toHaveTextContent('delete');
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it('renders the method badge for all HTTP methods', () => {
    const methods = Object.values(HTTP_METHODS);
    methods.forEach((method) => {
      const { unmount } = render(
        <DisplayHeader method={method} operation={baseOperation} />,
      );
      expect(screen.getByTestId('method-badge')).toHaveTextContent(method);
      unmount();
    });
  });
});
