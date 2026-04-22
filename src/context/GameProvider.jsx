import { useState, useEffect, useContext, createContext } from 'react';
import { AuthContext } from './AuthContext';
import { getGames, searchGames, getGamesByGenre, searchGamesWithGenre, getGameById } from '../services/api';

export const GameContext = createContext();

export default function GameProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [ratingSort, setRatingSort] = useState(''); // 'asc', 'desc', or ''
  const [currentPage, setCurrentPage] = useState(1);
  
  // API related state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [gameDetail, setGameDetail] = useState(null);
  const [gameDetailLoading, setGameDetailLoading] = useState(false);
  const [gameDetailError, setGameDetailError] = useState(null);
  
  // Cache for game details to avoid flickering
  const [gameDetailCache, setGameDetailCache] = useState(new Map());

  // Get user from AuthContext
  const { user, isAuthenticated, updateProfile, addToSearchHistory } = useContext(AuthContext);

  const addToFavorites = (game) => {
    if (!isAuthenticated || !user) return;
    
    // Check if game is already in favorites
    const exists = user.favorites?.find((fav) => fav.id === game.id);
    if (!exists) {
      const updatedFavorites = [...(user.favorites || []), game];
      updateProfile({ favorites: updatedFavorites });
    }
  };

  const removeFromFavorites = (gameId) => {
    if (!isAuthenticated || !user) return;
    
    const updatedFavorites = user.favorites?.filter((fav) => fav.id !== gameId) || [];
    updateProfile({ favorites: updatedFavorites });
  };

  const isFavorite = (gameId) => {
    if (!isAuthenticated || !user) return false;
    return user.favorites?.some((fav) => fav.id === gameId) || false;
  };

  // Get current favorites (from user or local state)
  const favorites = user?.favorites || [];

  // Fetch games based on filters
  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      
      // Convert genre to number if it exists
      const genreId = selectedGenre ? Number(selectedGenre) : '';
      
      // Simple if-else logic
      if (searchQuery && genreId) {
        data = await searchGamesWithGenre(searchQuery, genreId, currentPage);
      } else if (searchQuery) {
        data = await searchGames(searchQuery, currentPage);
        // Add to search history
        addToSearchHistory(searchQuery);
      } else if (genreId) {
        data = await getGamesByGenre(genreId, currentPage);
      } else {
        data = await getGames(currentPage);
      }

      setGames(data.results);
      setTotalCount(data.count);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch game details by ID
  const fetchGameDetail = async (id) => {
    if (!id) return;
    
    // Check if we already have this game in cache
    if (gameDetailCache.has(id)) {
      setGameDetail(gameDetailCache.get(id));
      setGameDetailError(null);
      setGameDetailLoading(false);
      return;
    }
    
    try {
      setGameDetailLoading(true);
      setGameDetailError(null);
      const gameData = await getGameById(id);
      setGameDetail(gameData);
      setGameDetailError(null);
      
      // Add to cache
      setGameDetailCache(prev => new Map(prev).set(id, gameData));
    } catch (err) {
      setGameDetailError('No se pudo cargar la información del juego');
      console.error('Error fetching game detail:', err);
    } finally {
      setGameDetailLoading(false);
    }
  };

  // Fetch games whenever dependencies change
  useEffect(() => {
    fetchGames();
  }, [searchQuery, selectedGenre, currentPage]);

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
        // API related
        games,
        loading,
        error,
        totalCount,
        gameDetail,
        gameDetailLoading,
        gameDetailError,
        fetchGameDetail,
        gameDetailCache,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
