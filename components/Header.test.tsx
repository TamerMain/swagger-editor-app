import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Header from './Header';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockUnsubscribe = vi.fn();
const mockOnAuthStateChange = vi.fn<
  (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    data: { subscription: { unsubscribe: () => void } };
  }
>((_callback) => ({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
}));
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null } });
const mockSignOut = vi.fn().mockResolvedValue({ error: null });

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
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
    it('renders login and signup links when no session exists', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      render(<Header />);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
          'href',
          '/login',
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
    const mockUserInstance = { id: 'user-123', email: 'test@example.com' };

    it('renders history options and sign out actions when active session exists', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: mockUserInstance } });
      render(<Header />);
      await screen.findByRole('link', { name: /history/i });
      expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute(
        'href',
        '/history',
      );
      expect(
        screen.getByRole('button', { name: /sign out/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });

    it('handles auth updates adaptively through state listener subscriptions', async () => {
      let authCallback: (
        event: AuthChangeEvent,
        session: Session | null,
      ) => void = () => {};
      mockOnAuthStateChange.mockImplementationOnce((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      });

      render(<Header />);
      act(() => {
        authCallback('SIGNED_IN', { user: mockUserInstance } as Session);
      });

      expect(
        await screen.findByRole('link', { name: /history/i }),
      ).toBeInTheDocument();

      act(() => {
        authCallback('SIGNED_OUT', null);
      });

      expect(
        screen.queryByRole('link', { name: /history/i }),
      ).not.toBeInTheDocument();
    });

    it('clears session tokens and redirects on signing out', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: mockUserInstance } });
      const user = userEvent.setup();
      render(<Header />);
      const signOutBtn = await screen.findByRole('button', {
        name: /sign out/i,
      });
      await user.click(signOutBtn);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sticky Layout Responsiveness', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('applies sticky repositioning styles when document container scrolls past 0', async () => {
      const container = setupScrollContainer(150);
      render(<Header />);

      fireEvent.scroll(container);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const navigationTag = screen.getByRole('navigation');
      expect(navigationTag.className).toContain('-mt-[4vh]');
    });

    it('removes negative margins if scrolled back up to top index', () => {
      const container = setupScrollContainer(150);
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

  it('unsubscribes from auth listeners and timeouts when component is destroyed', () => {
    const container = setupScrollContainer(0);
    const removeSpy = vi.spyOn(container, 'removeEventListener');

    const { unmount } = render(<Header />);
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
