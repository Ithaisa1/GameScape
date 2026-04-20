import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GameCard from '../components/GameCard';
import { GameProvider } from '../context/GameContext';

const mockGame = {
  id: 1,
  name: 'Test Game',
  background_image: 'https://example.com/image.jpg',
  rating: 4.5,
  released: '2023-01-01',
  genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }],
};

describe('GameCard', () => {
  it('renders game information correctly', () => {
    render(
      <GameProvider>
        <GameCard game={mockGame} />
      </GameProvider>
    );

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
  });

  it('renders favorite button', () => {
    render(
      <GameProvider>
        <GameCard game={mockGame} />
      </GameProvider>
    );

    const favoriteButton = screen.getByLabelText(/Add to favorites/i);
    expect(favoriteButton).toBeInTheDocument();
  });

  it('renders fallback image when background_image is missing', () => {
    const gameWithoutImage = { ...mockGame, background_image: null };
    
    render(
      <GameProvider>
        <GameCard game={gameWithoutImage} />
      </GameProvider>
    );

    const image = screen.getByAltText('Test Game');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x400');
  });
});
