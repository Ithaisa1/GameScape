import { useState } from 'react';
import { useGameContext } from '../context/GameContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useGameContext();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const showClearButton = localQuery.length > 0;

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search games..."
        value={localQuery}
        onChange={handleChange}
      />
      {showClearButton && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
        >
          ✕
        </button>
      )}
      <button type="submit" className="search-bar__button">
        🔍
      </button>
    </form>
  );
}