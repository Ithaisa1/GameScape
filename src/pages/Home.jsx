import { useEffect } from 'react';
import { useGameContext } from '../context/useGameContext';
import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import GameFilters from '../components/GameFilters';
import Pagination from '../components/Pagination';
import '../styles/Home.css';

export default function Home() {
  const { searchQuery, selectedGenre, ratingSort, currentPage, setCurrentPage } = useGameContext();
  const { games, loading, error, totalCount } = useGames(searchQuery, selectedGenre, currentPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, setCurrentPage]);

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  // Show error if there is one
  if (error) {
  return (
    <div className="error">
      <div className="error__icon">⚠️</div>
      <h2 className="error__title">Oops! Algo salió mal</h2>
      <p className="error__message">{error}</p>
      <div className="error__actions">
        <button 
          className="error__retry-btn"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
        <button 
          className="error__home-btn"
          onClick={() => window.location.href = '/'}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}

  // Sort games by rating (simple logic)
  let sortedGames = [...games];
  if (ratingSort === 'asc') {
    sortedGames.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  } else if (ratingSort === 'desc') {
    sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Calculate total pages (20 games per page)
  const gamesPerPage = 20;
  const totalPages = Math.ceil(totalCount / gamesPerPage);

  // Set title based on search
  const title = searchQuery ? `Resultados para "${searchQuery}"` : 'GameScape';
  const slogan = searchQuery ? '' : 'Encuentra tu próxima aventura';
  const hasGames = sortedGames.length > 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">{title}</h1>
        {slogan && <p className="home__slogan">{slogan}</p>}
        <SearchBar />
        <GameFilters />
      </div>

      {!hasGames ? (
        <div className="home__empty">
          <p>No se encontraron juegos.</p>
        </div>
      ) : (
        <>
          <div className="home__grid">
            {sortedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}