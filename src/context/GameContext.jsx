import { useState } from 'react';
import { GameContext } from './GameContext.js';

export default function GameProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [ratingSort, setRatingSort] = useState(''); // 'asc', 'desc', or ''
  const [currentPage, setCurrentPage] = useState(1);

  const addToFavorites = (game) => {
    // Check if game is already in favorites
    const exists = favorites.find((fav) => fav.id === game.id);
    if (!exists) {
      setFavorites([...favorites, game]);
    }
  };

  const removeFromFavorites = (gameId) => {
    setFavorites(favorites.filter((fav) => fav.id !== gameId));
  };

  const isFavorite = (gameId) => {
    return favorites.some((fav) => fav.id === gameId);
  };

  return (
    <GameContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedPlatform,
        setSelectedPlatform,
        ratingSort,
        setRatingSort,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
