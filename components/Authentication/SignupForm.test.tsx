// __tests__/SignUpForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignUpForm } from '@/components/Authentication/SignupForm';
import { signUp } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

// Mock the server action
vi.mock('@/app/actions/auth', () => ({
  signUp: vi.fn(),
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('SignUpForm', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
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
    expect(signUp).not.toHaveBeenCalled();
  });

  it('calls signUp with correct credentials when passwords match', async () => {
    const mockSignUp = vi.mocked(signUp);
    mockSignUp.mockResolvedValue(null);

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows a success message after successful sign up', async () => {
    const mockSignUp = vi.mocked(signUp);
    mockSignUp.mockResolvedValue(null);

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

  it('navigates to /signin when "Go to SignIn" is clicked after success', async () => {
    const mockSignUp = vi.mocked(signUp);
    mockSignUp.mockResolvedValue(null);

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    const goToSignInButton = await screen.findByRole('button', {
      name: /go to signin/i,
    });
    await user.click(goToSignInButton);

    expect(mockPush).toHaveBeenCalledWith('/signin');
  });

  it('displays an error message when signUp fails', async () => {
    const mockSignUp = vi.mocked(signUp);
    mockSignUp.mockResolvedValue('User already registered');

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
    const mockSignUp = vi.mocked(signUp);
    mockSignUp.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
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

    await waitFor(() => {
      expect(
        screen.getByText(/check your email for the confirmation link/i),
      ).toBeInTheDocument();
    });
  });

  it('renders a link to the signin page', () => {
    render(<SignUpForm />);
    const link = screen.getByRole('link', { name: /sign in/i });
    expect(link).toHaveAttribute('href', '/signin');
  });
});