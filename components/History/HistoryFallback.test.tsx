import { render, screen } from '@/lib/test-utils';
import { describe, it, expect } from 'vitest';
import HistoryFallback from './HistoryFallback';

describe('HistoryFallback', () => {
  it('renders the localized loading message', () => {
    render(<HistoryFallback />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
