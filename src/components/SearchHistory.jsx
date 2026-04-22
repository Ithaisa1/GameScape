import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/SearchHistory.css';

export default function SearchHistory() {
  const { getSearchHistory, clearSearchHistory } = useAuthContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const searchHistory = getSearchHistory();

  const handleClearHistory = () => {
    clearSearchHistory();
    setShowClearConfirm(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `Hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return `Ayer a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleSearchAgain = (query) => {
    // Redirigir a Home con la búsqueda
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  if (!searchHistory || searchHistory.length === 0) {
    return (
      <div className="search-history">
        <div className="search-history__empty">
          <h3>Historial de Búsquedas</h3>
          <p>No tienes búsquedas recientes</p>
          <p>Las búsquedas se guardarán automáticamente cuando busques juegos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-history">
      <div className="search-history__header">
        <h3>Historial de Búsquedas</h3>
        <div className="search-history__actions">
          <button 
            className="search-history__clear-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Limpiar Historial
          </button>
        </div>
      </div>
      
      <div className="search-history__list">
        {searchHistory.map((item) => (
          <div key={item.id} className="search-history__item">
            <div className="search-history__query">
              <span className="search-history__text">{item.query}</span>
              <button 
                className="search-history__search-btn"
                onClick={() => handleSearchAgain(item.query)}
                title="Buscar de nuevo"
              >
                🔍
              </button>
            </div>
            <div className="search-history__timestamp">
              {formatTimestamp(item.timestamp)}
            </div>
          </div>
        ))}
      </div>

      {showClearConfirm && (
        <div className="search-history__confirm-modal">
          <div className="search-history__confirm-content">
            <h4>¿Limpiar historial de búsquedas?</h4>
            <p>Se eliminarán todas tus búsquedas guardadas</p>
            <div className="search-history__confirm-buttons">
              <button 
                className="search-history__cancel-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="search-history__confirm-btn"
                onClick={handleClearHistory}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
