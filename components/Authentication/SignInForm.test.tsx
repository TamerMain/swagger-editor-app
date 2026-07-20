import { render, screen, waitFor } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignInForm } from '@/components/Authentication/SignInForm';
import { signIn } from '@/app/actions/auth';

vi.mock('@/app/actions/auth', () => ({
  signIn: vi.fn(),
}));

const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'Passw0rd!';

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('updates input values when typed into', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, VALID_EMAIL);
    await user.type(passwordInput, VALID_PASSWORD);

    expect(emailInput).toHaveValue(VALID_EMAIL);
    expect(passwordInput).toHaveValue(VALID_PASSWORD);
  });

  it('calls signIn on successful signin', async () => {
    vi.mocked(signIn).mockResolvedValue(null);

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), VALID_EMAIL);
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD);
    });
  });

  it('rejects an invalid email', async () => {
    vi.mocked(signIn).mockResolvedValue({ errors: ['emailInvalid'] });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('accepts a unicode password', async () => {
    vi.mocked(signIn).mockResolvedValue(null);

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), VALID_EMAIL);
    await user.type(screen.getByLabelText(/password/i), 'Пароль1!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(VALID_EMAIL, 'Пароль1!');
    });
  });

  it('displays a localized error message when signin fails', async () => {
    vi.mocked(signIn).mockResolvedValue({ errors: ['credentialsInvalid'] });

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Invalid email or password'),
    ).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    vi.mocked(signIn).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 100)),
    );

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), VALID_EMAIL);
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
    });
  });

  it('renders a link to the signup page', () => {
    render(<SignInForm />);
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/signup',
    );
  });
});
