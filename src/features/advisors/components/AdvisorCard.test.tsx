import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Advisor } from '../types/advisor.types';
import { AdvisorCard } from './AdvisorCard';

const baseAdvisor: Advisor = {
  id: 1,
  name: 'Advisor Laura',
  profilePictureUrl: 'https://example.com/avatar.jpg',
  price: '$4.99/min',
  isCallAvailable: true,
  isChatAvailable: false,
};

describe('AdvisorCard', () => {
  it('renders advisor information', () => {
    render(<AdvisorCard advisor={baseAdvisor} />);

    expect(screen.getByText('Advisor Laura')).toBeInTheDocument();
    expect(screen.getByText('$4.99/min')).toBeInTheDocument();
  });

  it('enables CALL NOW when call is available', () => {
    render(<AdvisorCard advisor={baseAdvisor} />);

    expect(screen.getByRole('button', { name: /call now/i })).toBeEnabled();
  });

  it('disables CALL LATER when call is unavailable', () => {
    render(<AdvisorCard advisor={{ ...baseAdvisor, isCallAvailable: false }} />);

    expect(screen.getByRole('button', { name: /call later/i })).toBeDisabled();
  });

  it('enables CHAT NOW when chat is available', () => {
    render(<AdvisorCard advisor={{ ...baseAdvisor, isChatAvailable: true }} />);

    expect(screen.getByRole('button', { name: /chat now/i })).toBeEnabled();
  });

  it('disables CHAT LATER when chat is unavailable', () => {
    render(<AdvisorCard advisor={baseAdvisor} />);

    expect(screen.getByRole('button', { name: /chat later/i })).toBeDisabled();
  });
});
