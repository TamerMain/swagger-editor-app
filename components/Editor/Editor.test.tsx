import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Editor from '@/components/Editor/Editor';
import { ToastProvider } from '@/lib/context/ToastContext';
import { useAuth } from '@/lib/context/AuthContext';

// Mock useAuth
vi.mock('@/lib/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock server actions
vi.mock('@/app/actions/editor', () => ({
  loadSchema: vi.fn(),
  saveSchema: vi.fn(),
}));

// Mock parseFormat and convertFormat
vi.mock('@/lib/formatParser', () => ({
  parseFormat: vi.fn(),
  convertFormat: vi.fn(),
}));

// Mock CodeMirror
vi.mock('@uiw/react-codemirror', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock EditorHeader
vi.mock('@/components/Editor/EditorHeader', () => ({
  default: ({
    format,
    isAuth,
    isSaving,
    errors,
    onSchemaClear,
    onSchemaSave,
    onFormatSwitch,
  }: {
    format: string;
    isAuth: boolean;
    isSaving: boolean;
    errors: unknown[];
    onSchemaClear: () => void;
    onSchemaSave: () => void;
    onFormatSwitch: () => void;
  }) => (
    <div data-testid="editor-header">
      <span data-testid="format">{format}</span>
      <span data-testid="is-auth">{String(isAuth)}</span>
      <span data-testid="is-saving">{String(isSaving)}</span>
      <span data-testid="header-error-count">{errors.length}</span>
      <button onClick={onSchemaClear}>Clear</button>
      <button onClick={onSchemaSave}>Save</button>
      <button onClick={onFormatSwitch}>Switch Format</button>
    </div>
  ),
}));

describe('Editor', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('mock-openapi-content'),
    } as unknown as Response);
  });

  it('loads the mock spec file for an unauthenticated user', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/examples/mockoon.yaml');
    });

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    expect(screen.getByTestId('is-auth')).toHaveTextContent('false');
  });

  it('loads the saved schema for an authenticated user', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue('saved-user-content');
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'saved-user-content',
      );
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
  });

  it('falls back to the mock file when an authenticated user has no saved content', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/examples/mockoon.yaml');
    });

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });
  });

  it('displays an error when the loaded content is invalid', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: false,
      error: 'Invalid specification',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Invalid specification/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('header-error-count')).toHaveTextContent('1');
  });

  it('validates content on change and updates errors', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi
      .fn()
      .mockImplementation(async (content: string) => {
        if (content === 'mock-openapi-content') {
          return { valid: true, format: 'yaml' };
        }
        return { valid: false, error: 'Bad syntax' };
      });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    const textarea = screen.getByTestId('codemirror');
    await user.clear(textarea);
    await user.type(textarea, 'broken');

    await waitFor(() => {
      expect(screen.getByText(/Bad syntax/i)).toBeInTheDocument();
    });
  });

  it('switches format and converts content when the switch is triggered', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat, convertFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const mockConvertFormat = vi.fn().mockReturnValue('{ "converted": true }');
    vi.mocked(convertFormat).mockImplementation(mockConvertFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('format')).toHaveTextContent('yaml');
    });

    await user.click(screen.getByRole('button', { name: /switch format/i }));

    expect(convertFormat).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        '{ "converted": true }',
      );
    });
    expect(screen.getByTestId('format')).toHaveTextContent('json');
  });

  it('shows an error if format conversion fails', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat, convertFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const mockConvertFormat = vi.fn().mockImplementation(() => {
      throw new Error('bad conversion');
    });
    vi.mocked(convertFormat).mockImplementation(mockConvertFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    await user.click(screen.getByRole('button', { name: /switch format/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to convert format/i)).toBeInTheDocument();
    });
  });

  it('saves the schema for an authenticated user with no errors', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema, saveSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue('existing');
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const mockSaveSchema = vi.fn().mockResolvedValue(undefined);
    vi.mocked(saveSchema).mockImplementation(mockSaveSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue('existing');
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(saveSchema).toHaveBeenCalledWith('existing');
    });
  });

  it('does not save when there are validation errors', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema, saveSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue('existing');
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const mockSaveSchema = vi.fn().mockResolvedValue(undefined);
    vi.mocked(saveSchema).mockImplementation(mockSaveSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: false,
      error: 'Invalid specification',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('header-error-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(saveSchema).not.toHaveBeenCalled();
  });

  it('does not save when the user is not authenticated', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema, saveSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const mockSaveSchema = vi.fn().mockResolvedValue(undefined);
    vi.mocked(saveSchema).mockImplementation(mockSaveSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(saveSchema).not.toHaveBeenCalled();
  });

  it('clears the schema when clear is triggered', async () => {
    const mockUseAuth = vi.fn().mockReturnValue({ user: null });
    vi.mocked(useAuth).mockImplementation(mockUseAuth);

    const { loadSchema } = await import('@/app/actions/editor');
    const mockLoadSchema = vi.fn().mockResolvedValue(null);
    vi.mocked(loadSchema).mockImplementation(mockLoadSchema);

    const { parseFormat } = await import('@/lib/formatParser');
    const mockParseFormat = vi.fn().mockResolvedValue({
      valid: true,
      format: 'yaml',
    });
    vi.mocked(parseFormat).mockImplementation(mockParseFormat);

    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Editor />
      </ToastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    await user.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue('');
    });
  });
});
