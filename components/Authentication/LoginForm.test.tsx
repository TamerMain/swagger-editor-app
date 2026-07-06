import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

describe('LoginForm', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignInWithPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });
  });

  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('updates input values when typed into', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signInWithPassword and redirects on successful login', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('displays an error message when login fails', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Invalid login credentials'),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state while submitting', async () => {
    mockSignInWithPassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it('renders a link to the signup page', () => {
    render(<LoginForm />);
    const link = screen.getByRole('link', { name: /sign up/i });
    expect(link).toHaveAttribute('href', '/signup');
  });
});
