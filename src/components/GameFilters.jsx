import { useGameContext } from '../hooks/useGameContext';
import '../styles/GameFilters.css';

export default function GameFilters() {
  const { selectedGenre, setSelectedGenre, ratingSort, setRatingSort } = useGameContext();

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setRatingSort(e.target.value);
  };

  return (
    <div className="game-filters">
      <div className="game-filters__item">
        <label htmlFor="genre-select">Género:</label>
        <select
          id="genre-select"
          className="game-filters__select"
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

      <div className="game-filters__item">
        <label htmlFor="rating-sort">Valoración:</label>
        <select
          id="rating-sort"
          className="game-filters__select"
          value={ratingSort}
          onChange={handleRatingSortChange}
        >
          <option value="">Por defecto</option>
          <option value="desc">Mayor a menor</option>
          <option value="asc">Menor a mayor</option>
        </select>
      </div>
    </div>
  );
}
