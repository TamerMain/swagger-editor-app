import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignUpForm } from './SignupForm';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

describe('SignUpForm', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    });
  });

  it('renders email, password, and confirm password fields', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('shows an error when passwords do not match', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'differentpassword',
    );
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText('Passwords do not match'),
    ).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls signUp with correct credentials when passwords match', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    });
  });

  it('shows a success message after successful sign up', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/check your email for the confirmation link/i),
    ).toBeInTheDocument();
  });

  it('navigates to /login when "Go to Login" is clicked after success', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    const goToLoginButton = await screen.findByRole('button', {
      name: /go to login/i,
    });
    await user.click(goToLoginButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('displays an error message when signUp fails', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
    });
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText('User already registered'),
    ).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    let resolveSignUp: (value: unknown) => void;
    mockSignUp.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignUp = resolve;
        }),
    );

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      screen.getByRole('button', { name: /creating account/i }),
    ).toBeDisabled();

    resolveSignUp!({ error: null });

    await waitFor(() => {
      expect(
        screen.getByText(/check your email for the confirmation link/i),
      ).toBeInTheDocument();
    });
  });

  it('renders a link to the login page', () => {
    render(<SignUpForm />);
    const link = screen.getByRole('link', { name: /sign in/i });
    expect(link).toHaveAttribute('href', '/login');
  });
});
