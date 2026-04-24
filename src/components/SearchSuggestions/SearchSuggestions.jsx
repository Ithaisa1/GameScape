import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGameContext } from '../../hooks/useGameContext';
import styles from './SearchSuggestions.module.css';

export default function SearchSuggestions() {
  const { getSearchHistory, isAuthenticated } = useAuthContext();
  const { searchQuery, setSearchQuery, fetchGames } = useGameContext();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const searchHistory = getSearchHistory();

  // Generar sugerencias basadas en el historial
  useEffect(() => {
    if (!isAuthenticated || !searchQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filtrar búsquedas que coincidan parcialmente con el input actual
    const filteredSuggestions = searchHistory
      .filter(item => 
        item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.query.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Máximo 5 sugerencias

    // Si no hay coincidencias, mostrar las búsquedas más recientes
    if (filteredSuggestions.length === 0 && searchQuery.length > 0) {
      setSuggestions(searchHistory.slice(0, 3));
    } else {
      setSuggestions(filteredSuggestions);
    }

    setShowSuggestions(searchQuery.length > 0 && suggestions.length > 0);
  }, [searchQuery, searchHistory, isAuthenticated]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.query);
    setShowSuggestions(false);
    // Ejecutar búsqueda automáticamente
    setTimeout(() => {
      fetchGames();
    }, 100);
  };

  const handleClearSuggestions = () => {
    setShowSuggestions(false);
  };

  // Cerrar sugerencias al hacer clic fuera
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
