import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { User } from '@supabase/supabase-js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Header from '@/components/Header';
import { useAuth } from '@/lib/context/AuthContext';

// Mock useAuth
vi.mock('@/lib/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock SignOutButton
vi.mock('@/components/Authentication/SignoutButton', () => ({
  SignOutButton: () => <button>Sign Out</button>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  const setupScrollContainer = (scrollTopValue: number) => {
    const container = document.createElement('div');
    container.className = 'scroll-container';
    Object.defineProperty(container, 'scrollTop', {
      value: scrollTopValue,
      configurable: true,
    });
    document.body.appendChild(container);
    return container;
  };

  describe('Unauthenticated User State', () => {
    it('renders signin and signup links when no user exists', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: null });

      render(<Header />);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
          'href',
          '/signin',
        );
        expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
          'href',
          '/signup',
        );
      });

      expect(
        screen.queryByRole('link', { name: /history/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /sign out/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Authenticated User State', () => {

    it('renders history and sign out when user is authenticated', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: {
          id: 'user-123',
          email: 'test@example.com',
        } as User,
      });

      render(<Header />);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute(
          'href',
          '/history',
        );
        expect(
          screen.getByRole('button', { name: /sign out/i }),
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('link', { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Sticky Layout Responsiveness', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('applies sticky styles when container scrolls past 0', async () => {
      const container = setupScrollContainer(150);
      vi.mocked(useAuth).mockReturnValue({ user: null });

      render(<Header />);

      fireEvent.scroll(container);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const navigationTag = screen.getByRole('navigation');
      expect(navigationTag.className).toContain('max-h-[3vh]');
    });

    it('removes sticky styles when scrolled back to top', () => {
      const container = setupScrollContainer(150);
      vi.mocked(useAuth).mockReturnValue({ user: null });

      render(<Header />);

      fireEvent.scroll(container);
      act(() => {
        vi.advanceTimersByTime(100);
      });

      Object.defineProperty(container, 'scrollTop', {
        value: 0,
        configurable: true,
      });
      fireEvent.scroll(container);
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const navigationTag = screen.getByRole('navigation');
      expect(navigationTag.className).not.toContain('-mt-[4vh]');
    });
  });

  it('cleans up event listeners on unmount', () => {
    const container = setupScrollContainer(0);
    const removeSpy = vi.spyOn(container, 'removeEventListener');
    vi.mocked(useAuth).mockReturnValue({ user: null });

    const { unmount } = render(<Header />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
