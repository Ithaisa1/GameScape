import { Link } from 'react-router-dom';
import { useGameContext } from '../context/useGameContext';
import '../styles/GameCard.css';

export default function GameCard({ game }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useGameContext();

  const handleFavoriteClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
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
    <Link to={`/games/${game.id}`} className="game-card">
      <div className="game-card__image">
        <img
          src={imageUrl}
          alt={game.name}
          loading="lazy"
        />
        <button
          className={`game-card__favorite ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
         {favorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
        <div className="game-card__meta">
          <span className="game-card__rating">⭐ {rating}</span>
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
    </Link>
  );
}