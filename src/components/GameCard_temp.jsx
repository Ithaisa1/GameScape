import { Link } from 'react-router-dom';
import { useGameContext } from '../hooks/useGameContext';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/GameCard.css';

export default function GameCard({ game }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useGameContext();
  const { isAuthenticated } = useAuthContext();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirigir al login
      window.location.href = '/login';
      return;
    }
    
    console.log('Click en favorito:', game.id, isFavorite(game.id));
    
    if (isFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };

  const favorite = isFavorite(game.id);
  const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
  const year = game.released ? new Date(game.released).getFullYear() : 'TBA';
  const imageUrl = game.background_image || 'https://via.placeholder.com/300x400';

  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="game-card__image">
        <img
          src={imageUrl}
          alt={game.name}
          loading="lazy"
        />
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
        <div className="game-card__meta">
          <span className="game-card__rating">â {rating}</span>
          <span className="game-card__released">{year}</span>
        </div>
        <div className="game-card__genres">
          {game.genres && game.genres.slice(0, 3).map((genre) => (
            <span key={genre.id} className="game-card__genre">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`game-card__favorite ${favorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
       {favorite ? 'â¤ï¸' : 'ð¤'}
      </button>
    </Link>
  );
}
