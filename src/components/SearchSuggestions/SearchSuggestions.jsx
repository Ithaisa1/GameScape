/**
 * @file SearchSuggestions.jsx
 * @description Componente que muestra sugerencias de búsqueda basadas en el historial del usuario.
 *              Filtra las búsquedas anteriores que coinciden con el input actual.
 * @module Components
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGameContext } from '../../hooks/useGameContext';
import styles from './SearchSuggestions.module.css';

/**
 * @component SearchSuggestions
 * @description Muestra sugerencias de búsqueda basadas en el historial del usuario autenticado.
 *              Filtra las búsquedas que coinciden parcialmente con el input actual y muestra
 *              las más recientes si no hay coincidencias.
 *
 * @returns {JSX.Element} Dropdown con sugerencias de búsqueda
 *
 * Estado interno:
 * - suggestions: Array de sugerencias filtradas del historial
 * - showSuggestions: Boolean para mostrar/ocultar el dropdown
 * - suggestionsRef: Ref del contenedor para detectar clics fuera
 *
 * Efectos secundarios:
 * - useEffect: Filtra el historial cuando cambia searchQuery o el historial del usuario
 * - useEffect: Cierra las sugerencias al hacer clic fuera del componente
 */
export default function SearchSuggestions() {
  const { getSearchHistory, isAuthenticated } = useAuthContext();
  const { searchQuery, setSearchQuery, fetchGames } = useGameContext();
  // Sugerencias filtradas del historial de búsquedas
  const [suggestions, setSuggestions] = useState([]);
  // Control de visibilidad del dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Ref para detectar clics fuera del componente
  const suggestionsRef = useRef(null);

  const searchHistory = getSearchHistory();

  // Efecto para generar sugerencias basadas en el historial cuando cambia el input
  useEffect(() => {
    if (!isAuthenticated || !searchQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filtrar búsquedas que coincidan parcialmente con el input actual
    // Busca coincidencias que contengan o empiecen con el texto del input
    const filteredSuggestions = searchHistory
      .filter(item => 
        item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.query.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limitar a máximo 5 sugerencias para no saturar la UI

    // Si no hay coincidencias exactas, mostrar las búsquedas más recientes
    if (filteredSuggestions.length === 0 && searchQuery.length > 0) {
      setSuggestions(searchHistory.slice(0, 3));
    } else {
      setSuggestions(filteredSuggestions);
    }

    setShowSuggestions(searchQuery.length > 0 && suggestions.length > 0);
  }, [searchQuery, searchHistory, isAuthenticated]);

  /**
   * @function handleSuggestionClick
   * @description Selecciona una sugerencia del historial, actualiza la búsqueda y ejecuta fetchGames
   * @param {Object} suggestion - Objeto de sugerencia con query, timestamp e id
   */
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.query);
    setShowSuggestions(false);
    // Ejecutar búsqueda automáticamente con un pequeño delay para asegurar que el estado se actualice
    setTimeout(() => {
      fetchGames();
    }, 100);
  };

  /**
   * @function handleClearSuggestions
   * @description Limpia las sugerencias y oculta el dropdown
   */
  const handleClearSuggestions = () => {
    setShowSuggestions(false);
  };

  // Efecto para cerrar las sugerencias al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={styles.searchSuggestions} ref={suggestionsRef}>
      <div className={styles.searchSuggestionsHeader}>
        <span className={styles.searchSuggestionsTitle}>Sugerencias basadas en tu historial</span>
        <button 
          className={styles.searchSuggestionsClose}
          onClick={handleClearSuggestions}
          title="Cerrar sugerencias"
        >
          ×
        </button>
      </div>
      
      <div className={styles.searchSuggestionsList}>
        {suggestions.map((item) => (
          <div 
            key={item.id} 
            className={styles.searchSuggestionsItem}
            onClick={() => handleSuggestionClick(item)}
          >
            <div className={styles.searchSuggestionsContent}>
              <span className={styles.searchSuggestionsQuery}>{item.query}</span>
              <span className={styles.searchSuggestionsTimestamp}>
                {formatTimestamp(item.timestamp)}
              </span>
            </div>
            <div className={styles.searchSuggestionsAction}>
              <span className={styles.searchSuggestionsArrow}>Buscar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Función para formatear timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return `Hoy`;
  } else if (date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
    return `Ayer`;
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short'
    });
  }
};
