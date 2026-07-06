import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import HistoryItem from './HistoryItem';
import { type HistoryRow } from '@/types/supabase';

vi.mock('@/lib/formatBytes', () => ({
  formatBytes: vi.fn((bytes: number) => `${bytes} bytes`),
}));

describe('HistoryItem', () => {
  const baseItem = {
    id: 'test-id',
    status_code: 200,
    method: 'GET',
    endpoint: '/api/v1/users',
    duration_ms: 120,
    timestamp: '2026-07-06T13:30:00.000Z',
    request_size: 100,
    response_size: 1500,
    error_details: null,
  } as unknown as HistoryRow;

  beforeAll(() => {
    vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(
      '7/6/2026, 5:30:00 PM',
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders structural details like method, endpoint, sizes, and timestamp', () => {
    render(<HistoryItem item={baseItem} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/v1/users')).toBeInTheDocument();
    expect(screen.getByText('📤 Request: 100 bytes')).toBeInTheDocument();
    expect(screen.getByText('📥 Response: 1500 bytes')).toBeInTheDocument();
    expect(screen.getByText('7/6/2026, 5:30:00 PM')).toBeInTheDocument();
  });

  describe('Status Code Styling Ranges', () => {
    const testStatusRange = (
      statusCode: number,
      expectedText: string,
      expectedClass: string,
    ) => {
      const item = { ...baseItem, status_code: statusCode };
      const { unmount } = render(<HistoryItem item={item} />);

      const badge = screen.getByText(expectedText);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain(expectedClass);

      unmount();
    };

    it('renders error badge states when status code is 0', () => {
      testStatusRange(0, 'ERR', 'text-red-300 bg-red-900');
    });

    it('renders green styling badge states for 2xx codes', () => {
      testStatusRange(201, '201', 'text-green-400 bg-green-900');
    });

    it('renders blue styling badge states for 3xx codes', () => {
      testStatusRange(304, '304', 'text-blue-400 bg-blue-900');
    });

    it('renders yellow styling badge states for 4xx codes', () => {
      testStatusRange(400, '400', 'text-yellow-400 bg-yellow-900');
    });

    it('renders bright red styling badge states for 5xx codes', () => {
      testStatusRange(503, '503', 'text-red-300 bg-red-500');
    });
  });

  describe('Optional Layout Blocks', () => {
    it('renders duration badge if duration_ms is present', () => {
      render(<HistoryItem item={baseItem} />);
      expect(screen.getByText('⏱ 120ms')).toBeInTheDocument();
    });

    it('hides duration badge completely if duration_ms is null', () => {
      const itemWithoutDuration = { ...baseItem, duration_ms: null };
      render(<HistoryItem item={itemWithoutDuration} />);

      expect(screen.queryByText(/ms/i)).not.toBeInTheDocument();
    });

    it('renders error block safely using regex when error details exist', () => {
      const itemWithError = {
        ...baseItem,
        error_details: 'Database timeout connection',
      };
      render(<HistoryItem item={itemWithError} />);

      expect(
        screen.getByText(/Database timeout connection/i),
      ).toBeInTheDocument();
    });

    it('hides error block layout container when error details are empty', () => {
      render(<HistoryItem item={baseItem} />);
      expect(screen.queryByText(/❌/)).not.toBeInTheDocument();
    });
  });
});
