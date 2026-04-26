import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getGames, searchGames, getGamesByGenre, searchGamesWithGenre, getGameById, getGameStores } from '../services/api';
import { useNotifications } from './NotificationProvider';

export const GameContext = createContext();

/**
 * @component GameProvider
 * @description Proveedor de contexto para la gestión de juegos. Gestiona búsqueda, filtros, paginación,
 *              favoritos y detalles de juegos. Utiliza la API de RAWG para obtener datos de juegos
 *              y localStorage para persistir favoritos del usuario.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de juegos
 *
 * @returns {JSX.Element} Provider de GameContext con el estado y funciones de gestión de juegos
 *
 * @context
 * - favorites: Array de juegos favoritos del usuario
 * - addToFavorites: Función para agregar juego a favoritos
 * - removeFromFavorites: Función para eliminar juego de favoritos
 * - isFavorite: Función para verificar si un juego es favorito
 * - searchQuery: String con la consulta de búsqueda actual
 * - setSearchQuery: Función para establecer la consulta de búsqueda
 * - selectedGenre: String con el género seleccionado
 * - setSelectedGenre: Función para establecer el género seleccionado
 * - selectedPlatform: String con la plataforma seleccionada (legacy)
 * - setSelectedPlatform: Función para establecer la plataforma seleccionada (legacy)
 * - ratingSort: String con el ordenamiento por rating ('asc', 'desc', '')
 * - setRatingSort: Función para establecer el ordenamiento por rating
 * - currentPage: Number con la página actual de paginación
 * - setCurrentPage: Función para establecer la página actual
 * - sortBy: String con el criterio de ordenamiento ('relevance', 'rating', 'released', 'name', 'popularity')
 * - setSortBy: Función para establecer el criterio de ordenamiento
 * - yearRange: Object con rango de años {min, max}
 * - setYearRange: Función para establecer el rango de años
 * - selectedPlatforms: Array de plataformas seleccionadas
 * - setSelectedPlatforms: Función para establecer las plataformas seleccionadas
 * - games: Array de juegos obtenidos de la API
 * - filteredGames: Array de juegos filtrados y ordenados (memoizado)
 * - loading: Boolean que indica si se están cargando juegos
 * - error: String con mensaje de error o null
 * - totalCount: Number con el total de juegos disponibles
 * - gameDetail: Object con detalles del juego seleccionado
 * - gameDetailLoading: Boolean que indica si se están cargando detalles
 * - gameDetailError: String con mensaje de error de detalles o null
 * - fetchGameDetail: Función para obtener detalles de un juego por ID
 * - gameDetailCache: Map con caché de detalles de juegos para evitar parpadeo
 */
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

  /**
   * @function addToFavorites
   * @description Agrega un juego a la lista de favoritos del usuario autenticado
   * @param {Object} game - Objeto del juego a agregar
   */
  const addToFavorites = (game) => {
    if (!isAuthenticated || !user) return;
    
    // Check if game is already in favorites
    const exists = user.favorites?.find((fav) => fav.id === game.id);
    if (!exists) {
      const updatedFavorites = [...(user.favorites || []), game];
      updateProfile({ favorites: updatedFavorites });
    }
  };

  /**
   * @function removeFromFavorites
   * @description Elimina un juego de la lista de favoritos del usuario autenticado
   * @param {string|number} gameId - ID del juego a eliminar
   */
  const removeFromFavorites = (gameId) => {
    if (!isAuthenticated || !user) return;
    
    const updatedFavorites = user.favorites?.filter((fav) => fav.id !== gameId) || [];
    updateProfile({ favorites: updatedFavorites });
  };

  /**
   * @function isFavorite
   * @description Verifica si un juego está en la lista de favoritos del usuario
   * @param {string|number} gameId - ID del juego a verificar
   * @returns {boolean} True si el juego es favorito, false en caso contrario
   */
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

  /**
   * @function fetchGames
   * @description Obtiene juegos de la API RAWG basándose en los filtros actuales (búsqueda, género, página)
   *              Actualiza el estado de games, loading, error y totalCount
   */
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

  /**
   * @function fetchGameDetail
   * @description Obtiene detalles de un juego específico por ID, incluyendo tiendas donde está disponible.
   *              Utiliza caché para evitar parpadeo al navegar entre juegos
   * @param {string|number} id - ID del juego a obtener
   */
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
