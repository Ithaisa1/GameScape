import { useGameContext } from '../context/GameContext';
import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

export default function Home() {
  const { searchQuery, selectedGenre } = useGameContext();
  const { games, loading, error } = useGames(searchQuery, selectedGenre);

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  // Show error if there is one
  if (error) {
    return (
      <div className="error">
        <h2>Error: {error}</h2>
        <p>Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }

  // Set title based on search
  const title = searchQuery ? `Resultados para "${searchQuery}"` : 'GameScape';
  const hasGames = games.length > 0;

  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">{title}</h1>
        <SearchBar />
      </div>

      {!hasGames ? (
        <div className="home__empty">
          <p>No se encontraron juegos.</p>
        </div>
      ) : (
        <div className="home__grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}