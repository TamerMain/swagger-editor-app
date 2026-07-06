import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DisplayRequestBody from './DisplayRequestBody';
import { type RequestBody } from '@/types/openapi';

function makeRequestBody(overrides: Partial<RequestBody> = {}): RequestBody {
  return {
    content: {},
    ...overrides,
  };
}

describe('DisplayRequestBody', () => {
  it('renders nothing when requestBody is undefined', () => {
    const { container } = render(
      <DisplayRequestBody requestBody={undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the Request Body heading', () => {
    render(<DisplayRequestBody requestBody={makeRequestBody()} />);
    expect(screen.getByText(/request body/i)).toBeInTheDocument();
  });

  it('renders the required asterisk when requestBody is required', () => {
    render(
      <DisplayRequestBody requestBody={makeRequestBody({ required: true })} />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not render the required asterisk when requestBody is not required', () => {
    render(
      <DisplayRequestBody requestBody={makeRequestBody({ required: false })} />,
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('does not render the required asterisk when required is not provided', () => {
    render(<DisplayRequestBody requestBody={makeRequestBody()} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <DisplayRequestBody
        requestBody={makeRequestBody({ description: 'User creation payload' })}
      />,
    );
    expect(screen.getByText('User creation payload')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<DisplayRequestBody requestBody={makeRequestBody()} />);
    expect(screen.queryByText('User creation payload')).not.toBeInTheDocument();
  });

  it('renders content types when content is provided', () => {
    const requestBody = makeRequestBody({
      content: {
        'application/json': {},
        'multipart/form-data': {},
      },
    });
    render(<DisplayRequestBody requestBody={requestBody} />);
    expect(
      screen.getByText('Content Types: application/json, multipart/form-data'),
    ).toBeInTheDocument();
  });

  it('does not render content types when content is empty', () => {
    render(
      <DisplayRequestBody requestBody={makeRequestBody({ content: {} })} />,
    );
    expect(screen.getByText(/content types/i)).toHaveTextContent(
      'Content Types:',
    );
    expect(screen.queryByText(/content types:[\s]+\S/)).not.toBeInTheDocument();
  });
  it('renders a single content type correctly', () => {
    const requestBody = makeRequestBody({
      content: { 'application/json': {} },
    });
    render(<DisplayRequestBody requestBody={requestBody} />);
    expect(
      screen.getByText('Content Types: application/json'),
    ).toBeInTheDocument();
  });

  it('renders a fully populated request body correctly', () => {
    const requestBody: RequestBody = {
      required: true,
      description: 'Create a new user',
      content: {
        'application/json': { schema: { type: 'object' } },
        'application/xml': {},
      },
    };
    render(<DisplayRequestBody requestBody={requestBody} />);

    expect(screen.getByText(/request body/i)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Create a new user')).toBeInTheDocument();
    expect(
      screen.getByText('Content Types: application/json, application/xml'),
    ).toBeInTheDocument();
  });
});
