import { render, screen, waitFor } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignUpForm } from '@/components/Authentication/SignupForm';
import { signUp } from '@/app/actions/auth';

vi.mock('@/app/actions/auth', () => ({
  signUp: vi.fn(),
}));

const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'Passw0rd!';

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  {
    email = VALID_EMAIL,
    password = VALID_PASSWORD,
    confirm = VALID_PASSWORD,
  } = {},
) => {
  await user.type(screen.getByLabelText(/^email$/i), email);
  await user.type(screen.getByLabelText(/^password$/i), password);
  await user.type(screen.getByLabelText(/confirm password/i), confirm);
  await user.click(screen.getByRole('button', { name: /sign up/i }));
};

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    await fillForm(user, { confirm: 'Different1!' });

    expect(
      await screen.findByText('Passwords do not match'),
    ).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('rejects a weak password before submitting', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user, { password: 'password', confirm: 'password' });

    expect(await screen.findByText(/at least one digit/i)).toBeInTheDocument();
    expect(
      screen.getByText(/at least one special character/i),
    ).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('calls signUp with correct credentials when passwords match', async () => {
    vi.mocked(signUp).mockResolvedValue(null);

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user);

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD);
    });
  });

  it('shows a success message after successful sign up', async () => {
    vi.mocked(signUp).mockResolvedValue(null);

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user);

    expect(
      await screen.findByText(/check your email for the confirmation link/i),
    ).toBeInTheDocument();
  });

  it('links to /signin after success', async () => {
    vi.mocked(signUp).mockResolvedValue(null);

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user);

    const link = await screen.findByRole('link', { name: /go to sign in/i });
    expect(link).toHaveAttribute('href', '/signin');
  });

  it('displays a localized error message when signUp fails', async () => {
    vi.mocked(signUp).mockResolvedValue({ errors: ['emailTaken'] });

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user);

    expect(
      await screen.findByText('This email is already registered'),
    ).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    vi.mocked(signUp).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 100)),
    );

    const user = userEvent.setup({ delay: null });
    render(<SignUpForm />);

    await fillForm(user);

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
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/signin',
    );
  });
});
