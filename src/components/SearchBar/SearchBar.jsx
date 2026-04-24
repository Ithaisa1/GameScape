import { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { searchSuggestions } from '../../services/api';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useGameContext();
  const { user } = useAuthContext();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (gameName) => {
    setLocalQuery(gameName);
    setSearchQuery(gameName);
    setShowSuggestions(false);
  };

  const showClearButton = localQuery.length > 0;

  // Debounce for suggestions
  useEffect(() => {
    let timeoutId;

    const fetchSuggestions = async () => {
      if (localQuery.length >= 2) {
        try {
          const data = await searchSuggestions(localQuery);
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