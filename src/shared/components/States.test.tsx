import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

describe('Shared states', () => {
  it('renders loading state', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status', { name: /loading advisors/i })).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<ErrorState />);
    expect(screen.getByText(/something went wrong while loading advisors/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<EmptyState />);
    expect(screen.getByText(/no advisors found/i)).toBeInTheDocument();
  });
});
