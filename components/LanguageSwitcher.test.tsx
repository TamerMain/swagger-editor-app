import { render, screen, fireEvent, waitFor } from '@/lib/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher';
import { setLocale } from '@/app/actions/locale';

vi.mock('@/app/actions/locale', () => ({
  setLocale: vi.fn(),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a select with all supported locales', () => {
    render(<LanguageSwitcher />);

    const select = screen.getByRole('combobox', { name: /language/i });
    expect(select).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Русский' })).toBeInTheDocument();
  });

  it('shows the current locale as the selected value', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('combobox', { name: /language/i })).toHaveValue(
      'en',
    );
  });

  it('calls setLocale with the chosen locale on change', async () => {
    render(<LanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox', { name: /language/i }), {
      target: { value: 'ru' },
    });

    await waitFor(() => {
      expect(setLocale).toHaveBeenCalledWith('ru');
    });
    expect(setLocale).toHaveBeenCalledTimes(1);
  });

  it('does not call setLocale when the value does not change', () => {
    render(<LanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox', { name: /language/i }), {
      target: { value: 'en' },
    });

    expect(setLocale).not.toHaveBeenCalled();
  });
});
