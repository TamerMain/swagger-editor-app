import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

describe('LogoutButton', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  it('renders a logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls signOut and redirects to /login when clicked', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
