import { render, screen } from '@/lib/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TryResponse from './TryResponse';

type TryResponseProps = {
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    ok?: boolean;
    statusText?: string;
  };
  error?: string | null;
};

function makeResponse(
  overrides: Partial<TryResponseProps['response']> = {},
): TryResponseProps['response'] {
  return {
    status: 200,
    headers: {},
    body: null,
    ok: true,
    ...overrides,
  };
}

describe('TryResponse', () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);

    Object.defineProperty(global, 'navigator', {
      value: { clipboard: { writeText: mockWriteText } },
      writable: true,
      configurable: true,
    });
  });

  it('renders the status code', () => {
    render(<TryResponse response={makeResponse({ status: 200 })} />);
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('renders ERR when status is 0', () => {
    render(<TryResponse response={makeResponse({ status: 0 })} />);
    expect(screen.getByText(/ERR/)).toBeInTheDocument();
  });

  it('renders statusText when provided', () => {
    render(
      <TryResponse
        response={makeResponse({ status: 200, statusText: 'OK' })}
      />,
    );
    expect(screen.getByText(/- OK/)).toBeInTheDocument();
  });

  it('does not render statusText when not provided', () => {
    render(<TryResponse response={makeResponse({ status: 200 })} />);
    expect(screen.queryByText(/- OK/)).not.toBeInTheDocument();
  });

  it('renders Error label when response.ok is false', () => {
    render(<TryResponse response={makeResponse({ ok: false })} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('does not render Error label when response.ok is true', () => {
    render(<TryResponse response={makeResponse({ ok: true })} />);
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('renders the error prop when provided', () => {
    render(
      <TryResponse response={makeResponse()} error="Something went wrong" />,
    );
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('does not render error section when error is null', () => {
    render(<TryResponse response={makeResponse()} error={null} />);
    expect(screen.queryByText(/❌/)).not.toBeInTheDocument();
  });

  it('does not render error section when error is not provided', () => {
    render(<TryResponse response={makeResponse()} />);
    expect(screen.queryByText(/❌/)).not.toBeInTheDocument();
  });

  it('renders errorMessage from body.error field', () => {
    render(
      <TryResponse
        response={makeResponse({ body: { error: 'Unauthorized' } })}
      />,
    );
    expect(screen.getByText('❌ Unauthorized')).toBeInTheDocument();
  });

  it('does not render errorMessage when body has no error field', () => {
    render(
      <TryResponse response={makeResponse({ body: { data: 'something' } })} />,
    );
    expect(screen.queryByText(/❌/)).not.toBeInTheDocument();
  });

  it('renders string body directly', () => {
    render(
      <TryResponse response={makeResponse({ body: 'plain text response' })} />,
    );
    expect(screen.getByText('plain text response')).toBeInTheDocument();
  });

  it('parses a JSON string body and renders formatted', () => {
    const body = JSON.stringify({ id: 1, name: 'Alice' });
    const { container } = render(
      <TryResponse response={makeResponse({ body })} />,
    );
    const pre = container.querySelector('pre');
    expect(pre?.textContent?.trim()).toBe(
      JSON.stringify({ id: 1, name: 'Alice' }, null, 2),
    );
  });
  it('renders null body as "null"', () => {
    render(<TryResponse response={makeResponse({ body: null })} />);
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('applies correct color class for 2xx status', () => {
    render(<TryResponse response={makeResponse({ status: 200 })} />);
    const badge = screen.getByText(/200/);
    expect(badge.className).toContain('bg-green-500/20');
  });

  it('applies correct color class for 4xx status', () => {
    render(<TryResponse response={makeResponse({ status: 404, ok: false })} />);
    const badge = screen.getByText(/404/);
    expect(badge.className).toContain('bg-yellow-500/20');
  });

  it('applies correct color class for 5xx status', () => {
    render(<TryResponse response={makeResponse({ status: 500, ok: false })} />);
    const badge = screen.getByText(/500/);
    expect(badge.className).toContain('bg-red-500/20');
  });
  it('renders a Copy button', () => {
    render(<TryResponse response={makeResponse()} />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });
});
