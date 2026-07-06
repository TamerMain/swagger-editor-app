import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DisplayResponses from './DisplayResponses';
import { type Operation, type Response } from '@/types/openapi';

type DisplayResponsesProps = Operation['responses'];

function makeResponses(
  overrides: DisplayResponsesProps = {},
): DisplayResponsesProps {
  return { ...overrides };
}

describe('DisplayResponses', () => {
  it('renders nothing when responses is undefined', () => {
    const { container } = render(
      <DisplayResponses
        responses={undefined as unknown as DisplayResponsesProps}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when responses is an empty object', () => {
    const { container } = render(
      <DisplayResponses responses={makeResponses()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the Responses heading when responses are provided', () => {
    render(<DisplayResponses responses={makeResponses({ '200': {} })} />);
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  it('renders a single status code', () => {
    render(<DisplayResponses responses={makeResponses({ '200': {} })} />);
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders multiple status codes', () => {
    render(
      <DisplayResponses
        responses={makeResponses({
          '200': {},
          '404': {},
          '500': {},
        })}
      />,
    );
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const response: Response = { description: 'Success' };
    render(<DisplayResponses responses={makeResponses({ '200': response })} />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<DisplayResponses responses={makeResponses({ '200': {} })} />);
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('renders descriptions for multiple responses', () => {
    render(
      <DisplayResponses
        responses={makeResponses({
          '200': { description: 'OK' },
          '201': { description: 'Created' },
          '404': { description: 'Not Found' },
        })}
      />,
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders status codes with correct color classes for 2xx', () => {
    render(<DisplayResponses responses={makeResponses({ '200': {} })} />);
    const badge = screen.getByText('200');
    expect(badge.className).toContain('bg-green-500/20');
    expect(badge.className).toContain('text-green-400');
  });

  it('renders status codes with correct color classes for 4xx', () => {
    render(<DisplayResponses responses={makeResponses({ '404': {} })} />);
    const badge = screen.getByText('404');
    expect(badge.className).toContain('bg-yellow-500/20');
    expect(badge.className).toContain('text-yellow-400');
  });

  it('renders status codes with correct color classes for 5xx', () => {
    render(<DisplayResponses responses={makeResponses({ '500': {} })} />);
    const badge = screen.getByText('500');
    expect(badge.className).toContain('bg-red-500/20');
    expect(badge.className).toContain('text-red-400');
  });

  it('renders status codes with fallback color for unknown status', () => {
    render(<DisplayResponses responses={makeResponses({ '302': {} })} />);
    const badge = screen.getByText('302');
    expect(badge.className).toContain('bg-gray-500/20');
    expect(badge.className).toContain('text-gray-400');
  });

  it('renders a fully populated responses object correctly', () => {
    render(
      <DisplayResponses
        responses={{
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' },
        }}
      />,
    );
    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('Bad Request')).toBeInTheDocument();
    expect(screen.getByText('401')).toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });
});
