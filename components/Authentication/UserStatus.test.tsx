import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserStatus } from './UserStatus';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('UserStatus', () => {
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
      },
    });
  });

  it('renders a Sign In link when no user is authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const ui = await UserStatus();
    render(ui);

    const link = screen.getByRole('link', { name: /sign in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });

  it('renders the user email when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
    });

    const ui = await UserStatus();
    render(ui);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });
});
