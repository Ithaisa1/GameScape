import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '../hooks/useGameContext';
import { useAuthContext } from '../hooks/useAuthContext';
import GameCard from '../components/GameCard/GameCard';
import SearchBar from '../components/SearchBar/SearchBar';
import Loader from '../components/Loader/Loader';
import GameFilters from '../components/GameFilters/GameFilters';
import Pagination from '../components/Pagination/Pagination';

export default function Home() {
  const { 
    searchQuery, 
    selectedGenre, 
    ratingSort, 
    currentPage, 
    setCurrentPage,
    games,
    filteredGames,
    loading,
    error,
    totalCount
  } = useGameContext();

  const { isAuthenticated } = useAuthContext();

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

  // Calculate total pages (20 games per page - API pagination)
  const gamesPerPage = 20;
  const totalPages = Math.ceil(totalCount / gamesPerPage);

  // Set title based on search
  const title = searchQuery ? `Resultados para "${searchQuery}"` : 'GameScape';
  const slogan = searchQuery ? '' : 'Encuentra tu próxima aventura';
  const hasGames = filteredGames.length > 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(45deg, #5B8CFF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{title}</h1>
        {slogan && <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>{slogan}</p>}
        
        {!isAuthenticated && (
          <div style={{ background: 'linear-gradient(145deg, #171A21, #222734)', borderRadius: '15px', padding: '2rem', marginBottom: '2rem', border: '1px solid #333' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>¡Inicia sesión para guardar tus favoritos!</h3>
              <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>Crea tu cuenta personal y guarda los juegos que te gusten</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/login" style={{ background: '#5B8CFF', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}>
                  Iniciar Sesión
                </Link>
                <Link to="/register" style={{ background: 'transparent', color: '#5B8CFF', border: '1px solid #5B8CFF', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}>
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <SearchBar />
        <GameFilters />
      </div>

      {!hasGames ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>No se encontraron juegos.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}