import '@testing-library/jest-dom';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    getAll: vi.fn(() => []),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL="https://vjdnmpuimmjleqknqqtu.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_2hMafG7r5oAld7lOgZmbwA_9mzq3wwj"