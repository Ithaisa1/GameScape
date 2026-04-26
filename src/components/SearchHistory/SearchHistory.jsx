/**
 * @file SearchHistory.jsx
 * @description Componente que muestra el historial de búsquedas del usuario con opción de limpiarlo.
 *              Formatea las fechas de forma relativa (Hoy, Ayer, o fecha completa).
 * @module Components
 */

import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './SearchHistory.module.css';

/**
 * @component SearchHistory
 * @description Muestra el historial de búsquedas del usuario autenticado. Permite buscar de nuevo
 *              una búsqueda anterior y limpiar todo el historial con confirmación.
 *
 * @returns {JSX.Element} Lista de historial de búsquedas con botón para limpiar
 *
 * Estado interno:
 * - showClearConfirm: Boolean para mostrar modal de confirmación de limpieza
 */
export default function SearchHistory() {
  const { getSearchHistory, clearSearchHistory } = useAuthContext();
  // Control de visibilidad del modal de confirmación para limpiar historial
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const searchHistory = getSearchHistory();

  /**
   * @function handleClearHistory
   * @description Limpia el historial de búsquedas y oculta el modal de confirmación
   */
  const handleClearHistory = () => {
    clearSearchHistory();
    setShowClearConfirm(false);
  };

  /**
   * @function formatTimestamp
   * @description Formatea un timestamp de forma relativa (Hoy, Ayer, o fecha completa)
   * @param {string|number} timestamp - Timestamp en formato ISO o milisegundos
   * @returns {string} Fecha formateada de forma legible
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Si es hoy, mostrar hora
    if (date.toDateString() === now.toDateString()) {
      return `Hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    // Si es ayer, mostrar "Ayer" con hora
    } else if (date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return `Ayer a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    // Si es más antiguo, mostrar fecha completa
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

  /**
   * @function handleSearchAgain
   * @description Redirige a la página principal con la búsqueda seleccionada
   * @param {string} query - Texto de la búsqueda a repetir
   */
  const handleSearchAgain = (query) => {
    // Redirigir a Home con el parámetro de búsqueda en la URL
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  // Si no hay historial, mostrar estado vacío
  if (!searchHistory || searchHistory.length === 0) {
    return (
      <div className={styles.searchHistory}>
        <div className={styles.searchHistoryEmpty}>
          <h3>Historial de Búsquedas</h3>
          <p>No tienes búsquedas recientes</p>
          <p>Las búsquedas se guardarán automáticamente cuando busques juegos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-history">
      <div className={styles.searchHistoryHeader}>
        <h3>Historial de Búsquedas</h3>
        <div className={styles.searchHistoryActions}>
          <button 
            className={styles.searchHistoryClearBtn}
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Limpiar Historial
          </button>
        </div>
      </div>
      
      <div className={styles.searchHistoryList}>
        {searchHistory.map((item) => (
          <div key={item.id} className={styles.searchHistoryItem}>
            <div className={styles.searchHistoryQuery}>
              <span className={styles.searchHistoryText}>{item.query}</span>
              <button 
                className={styles.searchHistorySearchBtn}
                onClick={() => handleSearchAgain(item.query)}
                title="Buscar de nuevo"
              >
                🔍
              </button>
            </div>
            <div className={styles.searchHistoryTimestamp}>
              {formatTimestamp(item.timestamp)}
            </div>
          </div>
        ))}
      </div>

      {showClearConfirm && (
        <div className={styles.searchHistoryConfirmModal}>
          <div className={styles.searchHistoryConfirmContent}>
            <h4>¿Limpiar historial de búsquedas?</h4>
            <p>Se eliminarán todas tus búsquedas guardadas</p>
            <div className={styles.searchHistoryConfirmButtons}>
              <button 
                className={styles.searchHistoryCancelBtn}
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.searchHistoryConfirmBtn}
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
