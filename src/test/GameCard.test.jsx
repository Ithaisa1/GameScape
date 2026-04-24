import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import GameCard from '../components/GameCard/GameCard';
import GameProvider from '../context/GameProvider';
import AuthProvider from '../context/AuthProvider';
import NotificationProvider from '../context/NotificationProvider';
import { ThemeProvider } from '../context/ThemeProvider';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: '' };

const mockGame = {
  id: 1,
  name: 'Test Game',
  background_image: 'https://example.com/image.jpg',
  rating: 4.5,
  released: '2023-01-01',
  genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }],
};

const AllProviders = ({ children }) => (
  <ThemeProvider>
    <NotificationProvider>
      <AuthProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </AuthProvider>
    </NotificationProvider>
  </ThemeProvider>
);

describe('GameCard', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.getItem.mockReturnValue('[]');
    window.location.href = '';
  });

  it('renders game information correctly', () => {
    render(
      <MemoryRouter>
        <AllProviders>
          <GameCard game={mockGame} />
        </AllProviders>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
  });

  it('renders favorite button', () => {
    render(
      <MemoryRouter>
        <AllProviders>
          <GameCard game={mockGame} />
        </AllProviders>
      </MemoryRouter>
    );

    const favoriteButton = screen.getByText('🤍');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('renders fallback image when background_image is missing', () => {
    const gameWithoutImage = { ...mockGame, background_image: null };
    
    render(
      <MemoryRouter>
        <AllProviders>
          <GameCard game={gameWithoutImage} />
        </AllProviders>
      </MemoryRouter>
    );

    const image = screen.getByAltText('Test Game');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x400');
  });

  it('renders user rating when available in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([
      { id: 1, rating: 5, text: 'Great game!' }
    ]));
    
    render(
      <MemoryRouter>
        <AllProviders>
          <GameCard game={mockGame} />
        </AllProviders>
      </MemoryRouter>
    );

    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('does not render user rating when no reviews in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    
    render(
      <MemoryRouter>
        <AllProviders>
          <GameCard game={mockGame} />
        </AllProviders>
      </MemoryRouter>
    );

    // Should only show API rating, not user rating
    const ratings = screen.getAllByText('4.5');
    expect(ratings.length).toBe(1);
  });
});
