/**
 * @file GameContext.jsx
 * @description Define el contexto de juegos que contiene el valor por defecto del contexto.
 *              Este archivo solo exporta el contexto creado con createContext. La implementación
 *              del provider está en GameProvider.jsx.
 * @module Context
 * @see GameProvider.jsx para la implementación del provider
 */

import { createContext } from 'react';

export const GameContext = createContext({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  searchQuery: '',
  setSearchQuery: () => {},
  selectedGenre: '',
  setSelectedGenre: () => {},
  selectedPlatform: '',
  setSelectedPlatform: () => {},
  ratingSort: '',
  setRatingSort: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  sortBy: 'relevance',
  setSortBy: () => {},
  yearRange: { min: '', max: '' },
  setYearRange: () => {},
  selectedPlatforms: [],
  setSelectedPlatforms: () => {},
  games: [],
  filteredGames: [],
  loading: true,
  error: null,
  totalCount: 0,
  gameDetail: null,
  gameDetailLoading: false,
  gameDetailError: null,
  fetchGameDetail: () => {},
  gameDetailCache: new Map()
});
