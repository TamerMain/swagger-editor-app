import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PathMethodBadge from './PathMethodBadge';
import { HTTP_METHODS, METHOD_COLORS } from '@/constants/constants';

describe('PathMethodBadge', () => {
  it('renders the method text', () => {
    render(<PathMethodBadge method={HTTP_METHODS.GET} />);
    expect(screen.getByText('get')).toBeInTheDocument();
  });

  it('renders all HTTP methods correctly', () => {
    Object.values(HTTP_METHODS).forEach((method) => {
      const { unmount } = render(<PathMethodBadge method={method} />);
      expect(screen.getByText(method)).toBeInTheDocument();
      unmount();
    });
  });

  it('applies the correct color class for GET', () => {
    render(<PathMethodBadge method={HTTP_METHODS.GET} />);
    const badge = screen.getByText('get');
    expect(badge.className).toContain(METHOD_COLORS.get);
  });

  it('applies the correct color class for POST', () => {
    render(<PathMethodBadge method={HTTP_METHODS.POST} />);
    const badge = screen.getByText('post');
    expect(badge.className).toContain('bg-green-500/20');
  });

  it('applies the correct color class for PUT', () => {
    render(<PathMethodBadge method={HTTP_METHODS.PUT} />);
    const badge = screen.getByText('put');
    expect(badge.className).toContain('bg-yellow-500/20');
  });

  it('applies the correct color class for DELETE', () => {
    render(<PathMethodBadge method={HTTP_METHODS.DELETE} />);
    const badge = screen.getByText('delete');
    expect(badge.className).toContain('bg-red-500/20');
  });

  it('applies the correct color class for PATCH', () => {
    render(<PathMethodBadge method={HTTP_METHODS.PATCH} />);
    const badge = screen.getByText('patch');
    expect(badge.className).toContain('bg-purple-500/20');
  });

  it('applies all color classes for each method from METHOD_COLORS', () => {
    Object.values(HTTP_METHODS).forEach((method) => {
      const { unmount } = render(<PathMethodBadge method={method} />);
      const badge = screen.getByText(method);
      const expectedClasses = METHOD_COLORS[method].split(' ');
      expectedClasses.forEach((cls) => {
        expect(badge.className).toContain(cls);
      });
      unmount();
    });
  });
});
