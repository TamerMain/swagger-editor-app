import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EditorHeader from './EditorHeader';
import { FORMAT } from '@/constants/constants';

describe('EditorHeader', () => {
  const defaultProps = {
    format: FORMAT.YAML,
    isAuth: false,
    isSaving: false,
    errors: [],
    onSchemaClear: vi.fn(),
    onSchemaSave: vi.fn(),
    onFormatSwitch: vi.fn(),
  };

  it('renders the current format badge in uppercase', () => {
    const { rerender } = render(
      <EditorHeader {...defaultProps} format={FORMAT.YAML} />,
    );
    expect(screen.getByText('YAML')).toBeInTheDocument();

    rerender(<EditorHeader {...defaultProps} format={FORMAT.JSON} />);
    expect(screen.getByText('JSON')).toBeInTheDocument();
  });

  it('displays validation success message when there are no errors', () => {
    render(<EditorHeader {...defaultProps} errors={[]} />);
    expect(
      screen.getByText(/Valid OpenAPI 3.0 Specification/i),
    ).toBeInTheDocument();
  });

  it('hides validation success message when there are errors', () => {
    render(<EditorHeader {...defaultProps} errors={['Some syntax error']} />);
    expect(
      screen.queryByText(/Valid OpenAPI 3.0 Specification/i),
    ).not.toBeInTheDocument();
  });

  it('calls onSchemaClear when Clear button is clicked', async () => {
    const onSchemaClear = vi.fn();
    const user = userEvent.setup();

    render(<EditorHeader {...defaultProps} onSchemaClear={onSchemaClear} />);

    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onSchemaClear).toHaveBeenCalledTimes(1);
  });

  describe('Save Button Actions', () => {
    it('does not render the Save Schema button if user is unauthenticated', () => {
      render(<EditorHeader {...defaultProps} isAuth={false} />);
      expect(
        screen.queryByRole('button', { name: /save schema/i }),
      ).not.toBeInTheDocument();
    });

    it('renders the Save Schema button and triggers click action if authenticated', async () => {
      const onSchemaSave = vi.fn();
      const user = userEvent.setup();

      render(
        <EditorHeader
          {...defaultProps}
          isAuth={true}
          onSchemaSave={onSchemaSave}
        />,
      );

      const saveButton = screen.getByRole('button', { name: /save schema/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();

      await user.click(saveButton);
      expect(onSchemaSave).toHaveBeenCalledTimes(1);
    });

    it('shows loading state text and preserves visibility when saving is active', () => {
      render(<EditorHeader {...defaultProps} isAuth={true} isSaving={true} />);
      expect(
        screen.getByRole('button', { name: /saving\.\.\./i }),
      ).toBeInTheDocument();
    });

    it('disables the button and shows error text when validation errors are present', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuth={true}
          errors={['Invalid format']}
        />,
      );

      const saveButton = screen.getByRole('button', {
        name: /invalid schema/i,
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Format Switch Button Actions', () => {
    it('shows correct toggle target name depending on current active format', () => {
      const { rerender } = render(
        <EditorHeader {...defaultProps} format={FORMAT.YAML} />,
      );
      expect(
        screen.getByRole('button', { name: /switch to json/i }),
      ).toBeInTheDocument();

      rerender(<EditorHeader {...defaultProps} format={FORMAT.JSON} />);
      expect(
        screen.getByRole('button', { name: /switch to yaml/i }),
      ).toBeInTheDocument();
    });

    it('calls onFormatSwitch when clicked', async () => {
      const onFormatSwitch = vi.fn();
      const user = userEvent.setup();

      render(
        <EditorHeader {...defaultProps} onFormatSwitch={onFormatSwitch} />,
      );

      await user.click(screen.getByRole('button', { name: /switch to json/i }));
      expect(onFormatSwitch).toHaveBeenCalledTimes(1);
    });

    it('disables the format switch button when validation errors exist', () => {
      render(
        <EditorHeader
          {...defaultProps}
          errors={['Invalid layout structure']}
        />,
      );
      expect(
        screen.getByRole('button', { name: /switch to json/i }),
      ).toBeDisabled();
    });
  });
});
