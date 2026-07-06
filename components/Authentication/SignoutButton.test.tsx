import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SignOutButton } from './SignoutButton';

vi.mock('@/app/actions/auth', () => ({
  signOut: vi.fn().mockResolvedValue({ error: null }),
}));


describe('SignOutButton', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('renders a signout button', () => {
    render(<SignOutButton />);
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });

  it('calls signOut and redirects to / when clicked', async () => {
    const { signOut } = await import('@/app/actions/auth');
    const user = userEvent.setup();
    
    render(<SignOutButton />);
    await user.click(screen.getByRole('button', { name: /Sign Out/i }));

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/');
  });
});
