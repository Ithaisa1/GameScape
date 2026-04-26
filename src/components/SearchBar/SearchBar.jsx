/**
 * @file SearchBar.jsx
 * @description Componente de barra de búsqueda con autocompletado y sugerencias de la API.
 *              Permite buscar juegos por nombre con debounce para optimizar las llamadas a la API.
 * @module Components
 */

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { searchSuggestions } from '../../services/api';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions';
import styles from './SearchBar.module.css';

/**
 * @component SearchBar
 * @description Barra de búsqueda con autocompletado. Muestra sugerencias de la API mientras el usuario escribe
 *              y permite limpiar la búsqueda con un botón. Utiliza debounce para evitar llamadas excesivas a la API.
 *
 * @returns {JSX.Element} Barra de búsqueda con input y sugerencias
 *
 * Estado interno:
 * - localQuery: Valor del input local (se sincroniza con searchQuery al enviar)
 * - suggestions: Array de sugerencias de la API
 * - showSuggestions: Boolean para mostrar/ocultar el dropdown de sugerencias
 * - searchRef: Ref del contenedor para detectar clics fuera
 *
 * Efectos secundarios:
 * - useEffect con debounce: Obtiene sugerencias de la API cuando localQuery cambia (con 300ms de delay)
 * - useEffect con clickOutside: Cierra las sugerencias al hacer clic fuera del componente
 */
export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useGameContext();
  const { user } = useAuthContext();
  // Estado local del input para controlar el texto mientras el usuario escribe
  const [localQuery, setLocalQuery] = useState(searchQuery);
  // Sugerencias obtenidas de la API
  const [suggestions, setSuggestions] = useState([]);
  // Control de visibilidad del dropdown de sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Ref para detectar clics fuera del componente
  const searchRef = useRef(null);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario de búsqueda. Actualiza searchQuery en el contexto
   *              y cierra las sugerencias.
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setShowSuggestions(false);
  };

  /**
   * @function handleChange
   * @description Actualiza el estado local del input cuando el usuario escribe
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  /**
   * @function handleClear
   * @description Limpia el input y resetea todos los estados relacionados con la búsqueda
   */
  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  /**
   * @function handleSuggestionClick
   * @description Selecciona una sugerencia y ejecuta la búsqueda con ese texto
   * @param {string} gameName - Nombre del juego seleccionado
   */
  const handleSuggestionClick = (gameName) => {
    setLocalQuery(gameName);
    setSearchQuery(gameName);
    setShowSuggestions(false);
  };

  const showClearButton = localQuery.length > 0;

  // Efecto con debounce para obtener sugerencias de la API
  // Espera 300ms después de que el usuario deje de escribir antes de hacer la llamada
  useEffect(() => {
    let timeoutId;

    /**
     * @function fetchSuggestions
     * @description Obtiene sugerencias de la API RAWG basadas en la consulta actual
     */
    const fetchSuggestions = async () => {
      if (localQuery.length >= 2) {
        try {
          const data = await searchSuggestions(localQuery);
          // La API devuelve un array de juegos en results
          setSuggestions(data.results || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout (debounce 500ms)
    timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [localQuery]);

  // Cerrar sugerencias al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.searchBarInputWrapper} ref={searchRef}>
        <input
          type="text"
          className={styles.searchBarInput}
          placeholder="Search games..."
          value={localQuery}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
        />
        {showClearButton && (
          <button
            type="button"
            className={styles.searchBarClear}
            onClick={handleClear}
          >
            &#10005;
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.searchBarSuggestions}>
          {suggestions.map((game) => (
            <div
              key={game.id}
              className={styles.searchBarSuggestion}
              onClick={() => handleSuggestionClick(game.name)}
            >
              {game.name}
            </div>
          ))}
        </div>
      )}

      {user && (
        <div className={styles.searchBarSuggestionsContainer}>
          <SearchSuggestions />
        </div>
      )}

      <button type="submit" className={styles.searchBarButton}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}