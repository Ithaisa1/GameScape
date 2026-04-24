import { useState } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import styles from './GameFilters.module.css';

export default function GameFilters() {
  const { 
    selectedGenre, 
    setSelectedGenre, 
    ratingSort, 
    setRatingSort,
    sortBy,
    setSortBy,
    yearRange,
    setYearRange,
    selectedPlatforms,
    setSelectedPlatforms
  } = useGameContext();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setRatingSort(e.target.value);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleYearRangeChange = (type, value) => {
    setYearRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const applyFilters = () => {
    // Forzar la actualización manual de juegos
    const event = new Event('applyFilters');
    window.dispatchEvent(event);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setRatingSort('');
    setSortBy('relevance');
    setYearRange({ min: '', max: '' });
    setSelectedPlatforms([]);
    // Aplicar filtros después de limpiar
    setTimeout(applyFilters, 100);
  };

  return (
    <div className={styles.gameFilters}>
      <div className={styles.gameFiltersBasic}>
        <div className={styles.gameFiltersItem}>
          <label htmlFor="genre-select">Género:</label>
          <select
            id="genre-select"
            className={styles.gameFiltersSelect}
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">Todos</option>
            <option value="4">Action</option>
            <option value="3">Adventure</option>
            <option value="5">RPG</option>
            <option value="10">Strategy</option>
            <option value="14">Simulation</option>
            <option value="15">Sports</option>
            <option value="1">Racing</option>
            <option value="7">Puzzle</option>
          </select>
        </div>

        <div className={styles.gameFiltersItem}>
          <label htmlFor="rating-sort">Valoración:</label>
          <select
            id="rating-sort"
            className={styles.gameFiltersSelect}
            value={ratingSort}
            onChange={handleRatingSortChange}
          >
            <option value="">Por defecto</option>
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </div>

        <div className={styles.gameFiltersItem}>
          <label htmlFor="sort-by">Ordenar por:</label>
          <select
            id="sort-by"
            className={styles.gameFiltersSelect}
            value={sortBy}
            onChange={handleSortByChange}
          >
            <option value="relevance">Relevancia</option>
            <option value="rating">Rating</option>
            <option value="released">Fecha lanzamiento</option>
            <option value="name">Nombre</option>
            <option value="popularity">Popularidad</option>
          </select>
        </div>

        <div className={styles.gameFiltersActions}>
          <button 
            className={styles.gameFiltersToggle}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '◀ Menos filtros' : '▶ Más filtros'}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className={styles.gameFiltersAdvanced}>
          <div className={styles.gameFiltersSection}>
            <h4 className={styles.gameFiltersSectionTitle}>📅 Año de lanzamiento</h4>
            <div className={styles.gameFiltersRange}>
              <div className={styles.gameFiltersRangeItem}>
                <label>Desde:</label>
                <input
                  type="number"
                  placeholder="Ej: 2020"
                  min="1970"
                  max={new Date().getFullYear()}
                  value={yearRange.min}
                  onChange={(e) => handleYearRangeChange('min', e.target.value)}
                  className={styles.gameFiltersInput}
                />
              </div>
              <div className={styles.gameFiltersRangeItem}>
                <label>Hasta:</label>
                <input
                  type="number"
                  placeholder="Ej: 2024"
                  min="1970"
                  max={new Date().getFullYear()}
                  value={yearRange.max}
                  onChange={(e) => handleYearRangeChange('max', e.target.value)}
                  className={styles.gameFiltersInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.gameFiltersSection}>
            <h4 className={styles.gameFiltersSectionTitle}>🎮 Plataformas</h4>
            <div className={styles.gameFiltersPlatforms}>
              {[
                { id: 'pc', name: 'PC' },
                { id: 'playstation', name: 'PlayStation' },
                { id: 'xbox', name: 'Xbox' },
                { id: 'nintendo', name: 'Nintendo' },
                { id: 'mobile', name: 'Mobile' }
              ].map(platform => (
                <label key={platform.id} className={styles.gameFiltersCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => handlePlatformToggle(platform.id)}
                  />
                  <span>{platform.name}</span>
                </label>
              ))}
            </div>
            
            <div className={styles.gameFiltersAdvancedActions}>
              <button 
                className={styles.gameFiltersApply}
                onClick={applyFilters}
              >
                🔍 Aplicar Filtros
              </button>
              <button 
                className={styles.gameFiltersClear}
                onClick={clearFilters}
              >
                🔄 Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
