import { render, screen, fireEvent, act } from '@/lib/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  const setupScrollContainer = (properties: {
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
  }) => {
    const container = document.createElement('div');
    container.className = 'scroll-container';

    Object.defineProperties(container, {
      scrollTop: { value: properties.scrollTop, configurable: true },
      clientHeight: { value: properties.clientHeight, configurable: true },
      scrollHeight: { value: properties.scrollHeight, configurable: true },
    });

    document.body.appendChild(container);
    return container;
  };

  it('does not render the footer initially', () => {
    setupScrollContainer({
      scrollTop: 0,
      clientHeight: 500,
      scrollHeight: 2000,
    });
    render(<Footer />);

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('renders the footer with correct details when scrolled near the bottom', () => {
    const container = setupScrollContainer({
      scrollTop: 1400,
      clientHeight: 500,
      scrollHeight: 2000,
    });
    render(<Footer />);
    fireEvent.scroll(container);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Swagger UI/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about',
    );
  });

  it('hides the footer if the user scrolls away from the bottom range', () => {
    const container = setupScrollContainer({
      scrollTop: 1400,
      clientHeight: 500,
      scrollHeight: 2000,
    });
    render(<Footer />);

    fireEvent.scroll(container);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    Object.defineProperty(container, 'scrollTop', {
      value: 100,
      configurable: true,
    });
    fireEvent.scroll(container);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('safely cleans up event listeners and timeouts on unmount', () => {
    const container = setupScrollContainer({
      scrollTop: 1400,
      clientHeight: 500,
      scrollHeight: 2000,
    });
    const removeSpy = vi.spyOn(container, 'removeEventListener');

    const { unmount } = render(<Footer />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
