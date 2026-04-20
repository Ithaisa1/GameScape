import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
