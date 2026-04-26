/**
 * @file useGameContext.jsx
 * @description Hook personalizado para acceder al contexto de juegos.
 *              Proporciona una forma segura de acceder al GameContext con validación de error.
 * @module Hooks
 */

import { useContext } from 'react';
import { GameContext } from '../context/GameProvider';

/**
 * @hook useGameContext
 * @description Hook personalizado para acceder al contexto de juegos. Valida que el hook
 *              se use dentro de un GameProvider y lanza un error si no es así.
 * @returns {Object} Objeto con el contexto de juegos (favorites, games, filteredGames, searchQuery, etc.)
 * @throws {Error} Si se usa fuera de un GameProvider
 * @example
 * const { favorites, addToFavorites, games, searchQuery } = useGameContext();
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
