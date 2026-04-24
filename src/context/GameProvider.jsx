import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getGames, searchGames, getGamesByGenre, searchGamesWithGenre, getGameById, getGameStores } from '../services/api';
import { useNotifications } from './NotificationProvider';

export const GameContext = createContext();

export default function GameProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [ratingSort, setRatingSort] = useState(''); // 'asc', 'desc', or ''
  const [currentPage, setCurrentPage] = useState(1);
  
  // Nuevos filtros avanzados
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'rating', 'released', 'name', 'popularity'
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [manualTrigger, setManualTrigger] = useState(0); // Para forzar actualización manual
  
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
  const { showNotification } = useNotifications();

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

  // Memoized filtered games for performance optimization
  const filteredGames = useMemo(() => {
    let filtered = games;

    // Filter by year range
    if (yearRange.min || yearRange.max) {
      filtered = filtered.filter(game => {
        if (!game.released) return true;
        const gameYear = new Date(game.released).getFullYear();
        
        if (yearRange.min && gameYear < parseInt(yearRange.min)) return false;
        if (yearRange.max && gameYear > parseInt(yearRange.max)) return false;
        
        return true;
      });
    }

    // Filter by platforms
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(game => {
        if (!game.platforms || game.platforms.length === 0) return false;
        
        return selectedPlatforms.some(selectedPlatform => {
          return game.platforms.some(platform => {
            const platformName = platform.platform.name.toLowerCase();
            
            switch(selectedPlatform) {
              case 'pc':
                return platformName.includes('pc') || platformName.includes('windows');
              case 'playstation':
                return platformName.includes('playstation') || platformName.includes('ps');
              case 'xbox':
                return platformName.includes('xbox');
              case 'nintendo':
                return platformName.includes('nintendo') || platformName.includes('switch');
              case 'mobile':
                return platformName.includes('android') || platformName.includes('ios') || platformName.includes('mobile');
              default:
                return false;
            }
          });
        });
      });
    }

    // Apply sorting
    if (sortBy || ratingSort) {
      filtered = [...filtered].sort((a, b) => {
        // First apply rating sort if specified
        if (ratingSort) {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        }
        
        // Then apply sortBy
        switch(sortBy) {
          case 'rating':
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA;
          case 'released':
            const dateA = a.released ? new Date(a.released) : new Date(0);
            const dateB = b.released ? new Date(b.released) : new Date(0);
            return dateB - dateA;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'popularity':
            // Use rating as popularity proxy (could be enhanced with actual popularity metrics)
            const popA = a.rating || 0;
            const popB = b.rating || 0;
            return popB - popA;
          case 'relevance':
          default:
            // Keep original order for relevance
            return 0;
        }
      });
    }

    return filtered;
  }, [games, yearRange, selectedPlatforms, sortBy, ratingSort]);

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

      // Set games from API - filtering will be handled by useMemo at component level
      setGames(data.results);
      // Usar count real de API (44,000+ juegos) con fallback mínimo
      const apiCount = data.count || 0;
      const realCount = Math.max(apiCount, 1000); // Mínimo 1000 para asegurar paginación
      setTotalCount(realCount);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
      showNotification('Error al cargar juegos. Intenta nuevamente.', 'error');
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
      
      // Fetch both game details and stores
      const [gameData, storesData] = await Promise.all([
        getGameById(id),
        getGameStores(id)
      ]);
      
      // Combine game data with stores
      const gameWithStores = {
        ...gameData,
        stores: storesData.results || []
      };
      
      setGameDetail(gameWithStores);
      setGameDetailError(null);
      
      // Add to cache
      setGameDetailCache(prev => new Map(prev).set(id, gameWithStores));
    } catch (err) {
      setGameDetailError('No se pudo cargar la información del juego');
      console.error('Error fetching game detail:', err);
      showNotification('No se pudo cargar la información del juego. Intenta nuevamente.', 'error');
    } finally {
      setGameDetailLoading(false);
    }
  };

  // Listen for manual filter application
  useEffect(() => {
    const handleApplyFilters = () => {
      setManualTrigger(prev => prev + 1);
    };

    window.addEventListener('applyFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFilters', handleApplyFilters);
  }, []);

  // Fetch games whenever dependencies change (only basic filters + manual trigger)
  useEffect(() => {
    fetchGames();
  }, [searchQuery, selectedGenre, currentPage, manualTrigger]);

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
        // Nuevos filtros avanzados
        sortBy,
        setSortBy,
        yearRange,
        setYearRange,
        selectedPlatforms,
        setSelectedPlatforms,
        // API related
        games,
        filteredGames,
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
