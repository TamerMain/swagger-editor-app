import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setLocale } from './locale';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LOCALE_COOKIE } from '@/constants/constants';

const mockSet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('setLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      set: mockSet,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  it('sets the locale cookie for a supported locale', async () => {
    await setLocale('ru');

    expect(mockSet).toHaveBeenCalledWith(
      LOCALE_COOKIE,
      'ru',
      expect.objectContaining({ path: '/', sameSite: 'lax' }),
    );
  });

  it('sets a long-lived cookie so the locale survives a browser restart', async () => {
    await setLocale('en');

    const options = mockSet.mock.calls[0][2];
    expect(options.maxAge).toBeGreaterThan(60 * 60 * 24 * 30);
  });

  it('revalidates the root layout so the whole tree re-renders', async () => {
    await setLocale('ru');

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('ignores an unsupported locale', async () => {
    await setLocale('de' as never);

    expect(mockSet).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
