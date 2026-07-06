import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Editor from './Editor';
import { createClient } from '@/lib/supabase/client';
import { parseFormat, convertFormat } from '@/lib/formatParser';
import { FORMAT } from '@/constants/constants';
type MockSupabaseParams = {
  user?: { id: string } | null;
  savedContent?: string | null;
};
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/formatParser', () => ({
  parseFormat: vi.fn(),
  convertFormat: vi.fn(),
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="codemirror"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@/components/Editor/EditorHeader', () => ({
  default: ({
    format,
    isAuth,
    isSaving,
    errors,
    onSchemaClear,
    onSchemaSave,
    onFormatSwitch,
  }: any) => (
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

function createMockSupabase({
  user = null,
  savedContent = null,
}: MockSupabaseParams = {}) {
  const maybeSingle = vi.fn().mockResolvedValue({
    data: savedContent ? { content: savedContent } : null,
  });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn().mockReturnValue({ select, upsert });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: user ? null : null,
      }),
    },
    from,
    __mocks: { maybeSingle, eq, select, upsert, from },
  };
}

describe('Editor', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('mock-openapi-content'),
    }) as any;
  });

  it('loads the mock spec file for an unauthenticated user', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    render(<Editor />);

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
    const mockSupabase = createMockSupabase({
      user: { id: 'user-1' },
      savedContent: 'saved-user-content',
    });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'saved-user-content',
      );
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
  });

  it('falls back to the mock file when an authenticated user has no saved content', async () => {
    const mockSupabase = createMockSupabase({
      user: { id: 'user-1' },
      savedContent: null,
    });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    render(<Editor />);

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
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: false,
      error: 'Invalid specification',
    });

    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByText(/Invalid specification/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('header-error-count')).toHaveTextContent('1');
  });

  it('validates content on change and updates errors', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockImplementation(
      async (content: string) => {
        if (content === 'mock-openapi-content') {
          return { valid: true, format: FORMAT.YAML };
        }
        return { valid: false, error: 'Bad syntax' };
      },
    );

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    const textarea = screen.getByTestId('codemirror');
    await user.clear(textarea);
    await user.type(textarea, 'broken');

    await waitFor(() => {
      expect(screen.getByText('❌ Bad syntax')).toBeInTheDocument();
    });
  });
  it('switches format and converts content when the switch is triggered', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });
    (convertFormat as ReturnType<typeof vi.fn>).mockReturnValue(
      '{ "converted": true }',
    );

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('format')).toHaveTextContent(FORMAT.YAML);
    });

    await user.click(screen.getByRole('button', { name: /switch format/i }));

    expect(convertFormat).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        '{ "converted": true }',
      );
    });
    expect(screen.getByTestId('format')).toHaveTextContent(FORMAT.JSON);
  });

  it('shows an error if format conversion fails', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });
    (convertFormat as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('bad conversion');
    });

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

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
    const mockSupabase = createMockSupabase({
      user: { id: 'user-1' },
      savedContent: 'existing',
    });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue('existing');
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(mockSupabase.__mocks.upsert).toHaveBeenCalledWith(
        { user_id: 'user-1', content: 'existing' },
        { onConflict: 'user_id' },
      );
    });
  });

  it('does not save when there are validation errors', async () => {
    const mockSupabase = createMockSupabase({
      user: { id: 'user-1' },
      savedContent: 'existing',
    });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: false,
      error: 'Invalid specification',
    });

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('header-error-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(mockSupabase.__mocks.upsert).not.toHaveBeenCalled();
  });

  it('does not save when the user is not authenticated', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

    await waitFor(() => {
      expect(screen.getByTestId('codemirror')).toHaveValue(
        'mock-openapi-content',
      );
    });

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(mockSupabase.__mocks.upsert).not.toHaveBeenCalled();
  });

  it('clears the schema when clear is triggered', async () => {
    const mockSupabase = createMockSupabase({ user: null });
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
    (parseFormat as ReturnType<typeof vi.fn>).mockResolvedValue({
      valid: true,
      format: FORMAT.YAML,
    });

    const user = userEvent.setup({ delay: null });
    render(<Editor />);

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
