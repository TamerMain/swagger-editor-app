import { render, screen } from '@/lib/test-utils';
import { describe, it, expect } from 'vitest';
import ViewerHeader from './ViewerHeader';
import { type Spec } from '@/types/openapi';

const baseSpec: Spec = {
  info: { title: 'My API', version: '1.0.0' },
  paths: {},
};

describe('ViewerHeader', () => {
  it('renders the API title', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={0} />);
    expect(screen.getByText('My API')).toBeInTheDocument();
  });

  it('renders the API version', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={0} />);
    expect(screen.getByText('Version: 1.0.0')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const spec: Spec = {
      ...baseSpec,
      info: { ...baseSpec.info, description: 'A great API' },
    };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.getByText('A great API')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={0} />);
    expect(screen.queryByText('A great API')).not.toBeInTheDocument();
  });

  it('renders servers when provided', () => {
    const spec: Spec = {
      ...baseSpec,
      servers: [
        { url: 'https://api.example.com', description: 'Production' },
        { url: 'https://staging.example.com', description: 'Staging' },
      ],
    };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.getByText('Servers:')).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/api\.example\.com/)).toBeInTheDocument();
    expect(
      screen.getByText(/https:\/\/staging\.example\.com/),
    ).toBeInTheDocument();
  });

  it('renders server description when provided', () => {
    const spec: Spec = {
      ...baseSpec,
      servers: [{ url: 'https://api.example.com', description: 'Production' }],
    };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.getByText(/Production/)).toBeInTheDocument();
  });

  it('does not render servers section when servers is empty', () => {
    const spec: Spec = { ...baseSpec, servers: [] };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.queryByText('Servers:')).not.toBeInTheDocument();
  });

  it('does not render servers section when servers is not provided', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={0} />);
    expect(screen.queryByText('Servers:')).not.toBeInTheDocument();
  });

  it('renders path count correctly', () => {
    const spec: Spec = {
      ...baseSpec,
      paths: { '/users': {}, '/posts': {} },
    };
    render(<ViewerHeader spec={spec} totalOperations={5} />);
    expect(screen.getByText('Paths: 2')).toBeInTheDocument();
  });

  it('renders total operations count correctly', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={7} />);
    expect(screen.getByText('Operations: 7')).toBeInTheDocument();
  });

  it('renders schemas count when components.schemas is provided', () => {
    const spec: Spec = {
      ...baseSpec,
      components: {
        schemas: { User: {}, Post: {}, Comment: {} },
      },
    };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.getByText('Schemas: 3')).toBeInTheDocument();
  });

  it('does not render schemas when components is not provided', () => {
    render(<ViewerHeader spec={baseSpec} totalOperations={0} />);
    expect(screen.queryByText(/schemas/i)).not.toBeInTheDocument();
  });

  it('does not render schemas when components.schemas is not provided', () => {
    const spec: Spec = { ...baseSpec, components: {} };
    render(<ViewerHeader spec={spec} totalOperations={0} />);
    expect(screen.queryByText(/schemas/i)).not.toBeInTheDocument();
  });
});
