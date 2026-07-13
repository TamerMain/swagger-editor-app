import { render, screen } from '@/lib/test-utils';
import { describe, it, expect, vi } from 'vitest';
import History from './History';
import { type HistoryRow } from '@/types/supabase';

vi.mock('./HistoryItem', () => ({
  default: ({ item }: { item: HistoryRow }) => (
    <div data-testid="mock-history-item">{item.id}</div>
  ),
}));

describe('History Component', () => {
  const mockHistoryData = [
    {
      id: '1',
      url: '/api/test-1',
      method: 'GET',
      created_at: '2026-01-01',
    },
    {
      id: '2',
      url: '/api/test-2',
      method: 'POST',
      created_at: '2026-01-02',
    },
  ] as unknown as HistoryRow[];

  describe('Empty States', () => {
    it('renders empty placeholder layout when history prop is null', () => {
      render(<History history={null} />);

      expect(
        screen.getByText(/You haven't executed any requests yet/i),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('renders empty placeholder layout when history array is empty', () => {
      render(<History history={[]} />);

      expect(
        screen.getByText(/You haven't executed any requests yet/i),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('mock-history-item')).not.toBeInTheDocument();
    });
  });

  describe('Populated States', () => {
    it('renders the correct title heading regardless of data state', () => {
      render(<History history={[]} />);
      expect(
        screen.getByRole('heading', { level: 1, name: /request history/i }),
      ).toBeInTheDocument();
    });

    it('loops through the array and renders a HistoryItem for every row entry', () => {
      render(<History history={mockHistoryData} />);

      const items = screen.getAllByTestId('mock-history-item');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('1');
      expect(items[1]).toHaveTextContent('2');
      expect(
        screen.queryByText(/You haven't executed any requests yet/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles null history gracefully', () => {
      render(<History history={null} />);
      expect(
        screen.getByText(/You haven't executed any requests yet/i),
      ).toBeInTheDocument();
    });

    it('handles undefined history gracefully', () => {
      render(<History history={undefined as unknown as HistoryRow[] | null} />);
      expect(
        screen.getByText(/You haven't executed any requests yet/i),
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading level for title', () => {
      render(<History history={mockHistoryData} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Request History');
    });

    it('has proper link attributes for navigation', () => {
      render(<History history={null} />);
      const editorLink = screen.getByRole('link', { name: /go home/i });

      expect(editorLink).toHaveAttribute('href', '/');
    });
  });
});
