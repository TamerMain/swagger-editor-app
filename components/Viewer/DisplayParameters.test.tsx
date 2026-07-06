import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DisplayParameters from './DisplayParameters';
import { type Operation, type Parameter } from '@/types/openapi';
import { PARAMETER_TYPES } from '@/constants/constants';

function makeParam(overrides: Partial<Parameter> = {}): Parameter {
  return {
    name: 'id',
    in: PARAMETER_TYPES.PATH,
    ...overrides,
  };
}

type DisplayParametersProps = Operation['parameters'];

describe('DisplayParameters', () => {
  it('renders nothing when parameters is undefined', () => {
    const { container } = render(<DisplayParameters parameters={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when parameters is an empty array', () => {
    const { container } = render(<DisplayParameters parameters={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the parameter count in the heading', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'id', in: PARAMETER_TYPES.PATH }),
      makeParam({ name: 'limit', in: PARAMETER_TYPES.QUERY }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.getByText('Parameters (2)')).toBeInTheDocument();
  });

  it('renders parameter name', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'userId', in: PARAMETER_TYPES.PATH }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.getByText(/userId/)).toBeInTheDocument();
  });

  it('renders parameter location (in) for all types', () => {
    const paramTypes = Object.values(PARAMETER_TYPES);
    paramTypes.forEach((type) => {
      const { unmount } = render(
        <DisplayParameters
          parameters={[makeParam({ name: 'test', in: type })]}
        />,
      );
      expect(screen.getByText(type)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders the required asterisk when parameter is required', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'id', in: PARAMETER_TYPES.PATH, required: true }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not render the required asterisk when parameter is not required', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'limit', in: PARAMETER_TYPES.QUERY, required: false }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders schema type when provided', () => {
    const parameters: DisplayParametersProps = [
      makeParam({
        name: 'id',
        in: PARAMETER_TYPES.PATH,
        schema: { type: 'integer' },
      }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.getByText('(integer)')).toBeInTheDocument();
  });

  it('does not render schema type when not provided', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'id', in: PARAMETER_TYPES.PATH }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.queryByText(/^\(.*\)$/)).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const parameters: DisplayParametersProps = [
      makeParam({
        name: 'id',
        in: PARAMETER_TYPES.PATH,
        description: 'The user identifier',
      }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.getByText('- The user identifier')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'id', in: PARAMETER_TYPES.PATH }),
    ];
    render(<DisplayParameters parameters={parameters} />);
    expect(screen.queryByText(/^- /)).not.toBeInTheDocument();
  });

  it('renders multiple parameters correctly', () => {
    const parameters: DisplayParametersProps = [
      makeParam({ name: 'userId', in: PARAMETER_TYPES.PATH, required: true }),
      makeParam({ name: 'limit', in: PARAMETER_TYPES.QUERY, required: false }),
      makeParam({ name: 'Authorization', in: PARAMETER_TYPES.HEADER }),
    ];
    render(<DisplayParameters parameters={parameters} />);

    expect(screen.getByText('Parameters (3)')).toBeInTheDocument();
    expect(screen.getByText(/userId/)).toBeInTheDocument();
    expect(screen.getByText(/limit/)).toBeInTheDocument();
    expect(screen.getByText(/Authorization/)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders a fully populated parameter correctly', () => {
    const parameters: DisplayParametersProps = [
      {
        name: 'filter',
        in: PARAMETER_TYPES.QUERY,
        required: true,
        description: 'Filter results by status',
        schema: { type: 'string' },
      },
    ];
    render(<DisplayParameters parameters={parameters} />);

    expect(screen.getByText('query')).toBeInTheDocument();
    expect(screen.getByText(/filter/)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('(string)')).toBeInTheDocument();
    expect(screen.getByText('- Filter results by status')).toBeInTheDocument();
  });
});
